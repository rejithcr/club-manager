variable "aws_region" {
  description = "AWS region for the deployment"
  type        = string
  default     = "ap-south-1"
}

variable "domain_name" {
  description = "The root domain name"
  type        = string
  default     = "sportsclubsmanager.com"
}
