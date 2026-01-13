# Terraform Outputs for gr8 Production Infrastructure
# Define all important output values

# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = module.vpc.private_subnet_ids
}

# ECR Outputs
output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = module.ecr.repository_url
}

output "ecr_repository_name" {
  description = "Name of the ECR repository"
  value       = module.ecr.repository_name
}

# RDS Outputs
output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "rds_instance_id" {
  description = "RDS instance identifier"
  value       = module.rds.instance_id
}

# ECS Outputs
output "ecs_cluster_id" {
  description = "ECS cluster ID"
  value       = module.ecs.cluster_id
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.ecs.service_name
}

# ALB Outputs
output "alb_dns_name" {
  description = "DNS name of the load balancer"
  value       = module.ecs.alb_dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the load balancer"
  value       = module.ecs.alb_zone_id
}

# Combined outputs for easy access
output "api_endpoint" {
  description = "API endpoint URL (ALB DNS name)"
  value       = "http://${module.ecs.alb_dns_name}"
}
