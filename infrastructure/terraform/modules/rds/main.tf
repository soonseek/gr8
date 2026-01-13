# RDS Module for gr8 Production Infrastructure
# Creates Amazon RDS PostgreSQL instance with secure configuration

# DB Subnet Group (for private subnets only)
resource "aws_db_subnet_group" "main" {
  name       = "${var.identifier}-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = merge(
    var.tags,
    {
      Name = "${var.identifier}-subnet-group"
    }
  )
}

# Security Group for RDS
resource "aws_security_group" "rds" {
  name_prefix = "${var.identifier}-rds-"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = var.vpc_id

  # Allow PostgreSQL from ECS tasks only
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = var.allowed_security_groups
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.identifier}-rds-sg"
    }
  )
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "main" {
  identifier         = var.identifier
  engine             = "postgres"
  engine_version     = "15.4"
  instance_class     = var.instance_class
  allocated_storage  = var.allocated_storage
  storage_type       = "gp3"
  storage_encrypted  = true

  db_name  = var.db_name
  username = var.username
  password = var.password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  # Performance insights (free for db.t3.micro)
  performance_insights_enabled = true

  # Monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  # Skip final snapshot for development (change to false for production)
  skip_final_snapshot = true

  # Store password in SSM Parameter Store
  lifecycle {
    ignore_changes = [password]
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.identifier}-rds"
    }
  )
}

# IAM Role for RDS Enhanced Monitoring
resource "aws_iam_role" "rds_monitoring" {
  name_prefix = "${var.identifier}-rds-monitoring-"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "rds.amazonaws.com"
        }
      }
    ]
  })

  tags = var.tags
}

# IAM Policy Attachment for RDS Monitoring
resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# SSM Parameter for RDS Password
resource "aws_ssm_parameter" "db_password" {
  name  = "/gr8/production/db/password"
  type  = "SecureString"
  value = var.password

  tags = merge(
    var.tags,
    {
      Name = "${var.identifier}-rds-password"
    }
  )
}

# SSM Parameter for RDS Endpoint
resource "aws_ssm_parameter" "db_endpoint" {
  name  = "/gr8/production/db/endpoint"
  type  = "String"
  value = aws_db_instance.main.endpoint

  tags = merge(
    var.tags,
    {
      Name = "${var.identifier}-rds-endpoint"
    }
  )
}
