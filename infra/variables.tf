# Variables for Cricket Club Manager Infrastructure (Minimal Setup)
# Environment is determined by Terraform Workspace (dev/prod)

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "club-manager"
}

variable "deployment_type" {
  description = "Deployment type: 'lambda' or 'ec2'"
  type        = string
  default     = "lambda"
  
  validation {
    condition     = contains(["lambda", "ec2"], var.deployment_type)
    error_message = "deployment_type must be either 'lambda' or 'ec2'"
  }
}

# EC2 Configuration (can override workspace defaults)
variable "instance_type" {
  description = "EC2 instance type for backend (overrides workspace default if set)"
  type        = string
  default     = ""
}

variable "key_pair_name" {
  description = "Name of EC2 key pair for SSH access (leave empty to skip)"
  type        = string
  default     = ""
}

# External Database Configuration
variable "db_host" {
  description = "External database host/endpoint"
  type        = string
}

variable "db_port" {
  description = "Database port"
  type        = string
  default     = "5432"
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "postgres"
}

variable "db_username" {
  description = "PostgreSQL username"
  type        = string
}

variable "db_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

# Application Configuration
variable "jwt_secret_key" {
  description = "JWT secret key for authentication"
  type        = string
  sensitive   = true
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access the application"
  type        = list(string)
  default     = ["0.0.0.0/0"]  # WARNING: Restrict this in production
}

variable "ssl_certificate_arn" {
  description = "ARN of SSL certificate for HTTPS (optional)"
  type        = string
  default     = ""
}

# Connection Pool Settings (can override workspace defaults)
variable "db_min_connections" {
  description = "Minimum database connections in pool (overrides workspace default if set)"
  type        = number
  default     = 0
}

variable "db_max_connections" {
  description = "Maximum database connections in pool (overrides workspace default if set)"
  type        = number
  default     = 0
}

# Monitoring
variable "enable_cloudwatch_logs" {
  description = "Enable CloudWatch Logs for application"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "CloudWatch Logs retention in days"
  type        = number
  default     = 1
}

# Tags
variable "additional_tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}
