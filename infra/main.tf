# Minimal Terraform configuration for Cricket Club Manager Backend
# Deploys single Flask backend EC2 instance using default VPC
# Assumes external RDS database
# Uses Terraform Workspaces for environment separation (dev/prod)

terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket = "ccm-common-storage"
    key    = "tf.state"
    region = "ap-south-1"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Local variables for workspace-based configuration
locals {
  environment = terraform.workspace
  
  # Environment-specific configurations
  config = {
    dev = {
      instance_type      = "t3.small"
      db_min_connections = 5
      db_max_connections = 20
    }
    prod = {
      instance_type      = "t3.medium"
      db_min_connections = 10
      db_max_connections = 50
    }
  }
  
  # Get current environment config
  env_config = local.config[local.environment]
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "Club Manager"
      Environment = local.environment
      Workspace   = terraform.workspace
      ManagedBy   = "Terraform"
    }
  }
}

# Data sources
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Use default VPC
data "aws_vpc" "default" {
  default = true
}

# Get default subnets
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Get first available default subnet
data "aws_subnet" "default" {
  id = data.aws_subnets.default.ids[0]
}
