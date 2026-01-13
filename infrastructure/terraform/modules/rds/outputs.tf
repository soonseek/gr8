# RDS Module Outputs

output "endpoint" {
  description = "RDS instance endpoint (connection string)"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "instance_id" {
  description = "RDS instance identifier"
  value       = aws_db_instance.main.id
}

output "database_name" {
  description = "Database name"
  value       = aws_db_instance.main.db_name
}

output "port" {
  description = "Database port"
  value       = aws_db_instance.main.port
}

output "security_group_id" {
  description = "Security group ID for RDS"
  value       = aws_security_group.rds.id
}

output "subnet_group_name" {
  description = "DB subnet group name"
  value       = aws_db_subnet_group.main.name
}
