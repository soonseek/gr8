# RDS Module Variables

variable "identifier" {
  description = "Identifier for RDS instance"
  type        = string
}

variable "instance_class" {
  description = "RDS instance class"
  type        = string
}

variable "allocated_storage" {
  description = "Allocated storage for RDS (GB)"
  type        = number
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "username" {
  description = "Database master username"
  type        = string
  sensitive   = true
}

variable "password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

variable "vpc_id" {
  description = "VPC ID where RDS will be deployed"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for RDS"
  type        = list(string)
}

variable "allowed_security_groups" {
  description = "List of security group IDs allowed to access RDS"
  type        = list(string)
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}
