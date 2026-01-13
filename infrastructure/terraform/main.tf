# Terraform Configuration for gr8 Production Infrastructure
# Main configuration file that calls all modules

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration (optional, for team collaboration)
  # Uncomment to use S3 + DynamoDB for remote state
  # backend "s3" {
  #   bucket         = "gr8-terraform-state"
  #   key            = "production/terraform.tfstate"
  #   region         = "ap-northeast-2"
  #   encrypt        = true
  #   dynamodb_table = "gr8-terraform-locks"
  # }
}

# AWS Provider
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Local variables for convenience
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  project_name      = var.project_name
  vpc_cidr          = var.vpc_cidr
  availability_zones = var.availability_zones
}

# ECR Module
module "ecr" {
  source = "./modules/ecr"

  repository_name = "${var.project_name}-backend"
}

# RDS Module
module "rds" {
  source = "./modules/rds"

  identifier          = "${var.project_name}-db"
  instance_class      = var.db_instance_class
  allocated_storage   = var.db_allocated_storage
  db_name             = var.db_name
  username            = var.db_username
  password            = var.db_password

  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids

  # Security: Only allow ECS tasks to access RDS
  allowed_security_groups = [module.ecs.security_group_id]

  tags = local.common_tags
}

# ECS Module
module "ecs" {
  source = "./modules/ecs"

  cluster_name     = "${var.project_name}-production"
  vpc_id           = module.vpc.vpc_id
  subnet_ids       = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids

  container_name = "gr8-backend"
  container_port = 8000

  ecr_repository_url = module.ecr.repository_url
  rds_endpoint       = module.rds.endpoint
  rds_db_name        = var.db_name
  rds_username       = var.db_username
  rds_password       = var.db_password

  cpu    = var.ecs_cpu
  memory = var.ecs_memory

  tags = local.common_tags
}
