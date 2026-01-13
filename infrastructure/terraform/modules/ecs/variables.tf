# ECS Module Variables

variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where ECS will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "List of public subnet IDs for ALB"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "container_name" {
  description = "Name of the container"
  type        = string
}

variable "container_port" {
  description = "Port exposed by the container"
  type        = number
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository"
  type        = string
}

variable "rds_endpoint" {
  description = "RDS instance endpoint"
  type        = string
  sensitive   = true
}

variable "rds_db_name" {
  description = "Database name"
  type        = string
}

variable "rds_username" {
  description = "Database username"
  type        = string
  sensitive   = true
}

variable "rds_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "cpu" {
  description = "CPU units for ECS task"
  type        = number
}

variable "memory" {
  description = "Memory for ECS task (MB)"
  type        = number
}

variable "alb_security_group_id" {
  description = "Security group ID for ALB"
  type        = string
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}
