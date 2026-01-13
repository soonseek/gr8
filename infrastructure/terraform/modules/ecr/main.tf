# ECR Module for gr8 Production Infrastructure
# Creates Elastic Container Registry repository for Docker images

# ECR Repository
resource "aws_ecr_repository" "main" {
  name                 = var.repository_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = var.tags
}

# ECR Lifecycle Policy (delete untagged images after 30 days)
resource "aws_ecr_lifecycle_policy" "main" {
  repository = aws_ecr_repository.main.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Delete untagged images after 30 days"
        selection = {
          tagStatus     = "untagged"
          countType     = "sinceImagePushed"
          countUnit     = "days"
          countNumber   = 30
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# ECR Repository Policy (allow pull/pull from ECS)
data "aws_iam_policy_document" "ecr_policy" {
  statement {
    sid    = "AllowECSPull"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }

    actions = [
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:BatchCheckLayerAvailability",
    ]
  }
}

resource "aws_ecr_repository_policy" "main" {
  repository = aws_ecr_repository.main.name
  policy     = data.aws_iam_policy_document.ecr_policy.json
}
