# ECS Module for gr8 Production Infrastructure
# Creates ECS Fargate cluster, task definition, service, ALB, and CloudWatch Logs

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "main" {
  name              = "/ecs/${var.cluster_name}"
  retention_in_days = 7

  tags = var.tags
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = var.cluster_name

  tags = var.tags
}

# ECS Task Execution Role (for ECR pull and CloudWatch Logs)
resource "aws_iam_role" "task_execution_role" {
  name_prefix = "${var.cluster_name}-task-exec-"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

# IAM Policy for Task Execution Role
resource "aws_iam_role_policy_attachment" "task_execution_role_policy" {
  role       = aws_iam_role.task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Additional IAM policy for pulling from ECR
resource "aws_iam_role_policy" "ecr_pull" {
  name = "${var.cluster_name}-ecr-pull"
  role = aws_iam_role.task_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
        Resource = "*"
      }
    ]
  })
}

# Security Group for ECS Tasks
resource "aws_security_group" "ecs_tasks" {
  name_prefix = "${var.cluster_name}-tasks-"
  description = "Security group for ECS tasks"
  vpc_id      = var.vpc_id

  # Allow outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow inbound from ALB
  ingress {
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [var.alb_security_group_id]
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.cluster_name}-tasks-sg"
    }
  )
}

# ECS Task Definition
resource "aws_ecs_task_definition" "main" {
  family                   = "${var.cluster_name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = aws_iam_role.task_execution_role.arn
  task_role_arn            = aws_iam_role.task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = var.container_name
      image     = "${var.ecr_repository_url}:latest"
      cpu       = var.cpu
      memory    = var.memory
      essential = true

      portMappings = [
        {
          containerPort = var.container_port
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "DATABASE_URL"
          value = "postgresql+asyncpg://${var.rds_username}:${var.rds_password}@${var.rds_endpoint}/${var.rds_db_name}"
        },
        {
          name  = "ENVIRONMENT"
          value = "production"
        }
      ]

      secrets = []

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.main.name
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "ecs"
          "awslogs-create-group"  = "true"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = var.tags
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.cluster_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.subnet_ids

  enable_deletion_protection = false

  tags = merge(
    var.tags,
    {
      Name = "${var.cluster_name}-alb"
    }
  )
}

# ALB Target Group
resource "aws_lb_target_group" "main" {
  name        = "${var.cluster_name}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200"
  }

  tags = var.tags
}

# ALB Listener
resource "aws_lb_listener" "main" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }

  tags = var.tags
}

# ECS Service
resource "aws_ecs_service" "main" {
  name            = "${var.cluster_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = var.container_name
    container_port   = var.container_port
  }

  # Enable deployment circuit breaker
  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  # Deployment configuration
  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100

    # Rolling update
    deployment_circuit_breaker {
      enable   = true
      rollback = true
    }
  }

  # Wait for steady state
  wait_for_steady_state = true

  tags = var.tags
}

# Data source for current region
data "aws_region" "current" {}

# Security Group Output (needed by RDS module)
output "security_group_id" {
  value = aws_security_group.ecs_tasks.id
}
