# Outputs

output "deployment_type" {
  description = "Type of deployment (lambda or ec2)"
  value       = var.deployment_type
}

output "vpc_id" {
  description = "ID of the default VPC"
  value       = data.aws_vpc.default.id
}

output "subnet_id" {
  description = "ID of the subnet used"
  value       = data.aws_subnet.default.id
}

# EC2 Outputs (only when deployment_type = "ec2")
output "ec2_instance_id" {
  description = "ID of EC2 instance"
  value       = var.deployment_type == "ec2" ? aws_instance.web_server[0].id : null
}

output "ec2_public_ip" {
  description = "Public IP of EC2 instance"
  value       = var.deployment_type == "ec2" ? aws_instance.web_server[0].public_ip : null
}

output "ec2_public_dns" {
  description = "Public DNS of EC2 instance"
  value       = var.deployment_type == "ec2" ? aws_instance.web_server[0].public_dns : null
}

output "ec2_application_url" {
  description = "Application URL for EC2"
  value       = var.deployment_type == "ec2" ? "http://${aws_instance.web_server[0].public_ip}:5000" : null
}

output "security_group_id" {
  description = "ID of EC2 security group"
  value       = var.deployment_type == "ec2" ? aws_security_group.ec2[0].id : null
}

output "ec2_iam_role_arn" {
  description = "ARN of EC2 IAM role"
  value       = var.deployment_type == "ec2" ? aws_iam_role.ec2[0].arn : null
}

# Lambda Outputs (only when deployment_type = "lambda")
output "lambda_function_name" {
  description = "Name of Lambda function"
  value       = var.deployment_type == "lambda" ? aws_lambda_function.api[0].function_name : null
}

output "lambda_function_arn" {
  description = "ARN of Lambda function"
  value       = var.deployment_type == "lambda" ? aws_lambda_function.api[0].arn : null
}

output "lambda_function_url" {
  description = "Lambda Function URL"
  value       = var.deployment_type == "lambda" ? aws_lambda_function_url.api[0].function_url : null
}

output "lambda_iam_role_arn" {
  description = "ARN of Lambda IAM role"
  value       = var.deployment_type == "lambda" ? aws_iam_role.lambda[0].arn : null
}

# Connection Instructions
output "connection_instructions" {
  description = "Instructions for connecting to resources"
  value = var.deployment_type == "ec2" ? (
    <<-EOT
    
    ========================================
    Cricket Club Manager - EC2 Deployment
    ========================================
    
    EC2 Instance:
      Instance ID: ${aws_instance.web_server[0].id}
      Public IP: ${aws_instance.web_server[0].public_ip}
      Public DNS: ${aws_instance.web_server[0].public_dns}
    
    Application URL: 
      http://${aws_instance.web_server[0].public_ip}:5000
    
    SSH Access:
      ${var.key_pair_name != "" ? "ssh -i ${var.key_pair_name}.pem ec2-user@${aws_instance.web_server[0].public_ip}" : "No key pair configured - use AWS Systems Manager Session Manager"}
    
    Database Configuration:
      Host: ${var.db_host}
      Port: ${var.db_port}
      Database: ${var.db_name}
      Username: ${var.db_username}
    
    Next Steps:
      1. Application is automatically deployed from S3
      2. Check service status: sudo systemctl status club-manager
      3. View logs: sudo journalctl -u club-manager -f
      4. Test API: curl http://${aws_instance.web_server[0].public_ip}:5000/health
      5. To update app: run package-app.ps1 to update S3
    
    Application Location:
      S3: s3://ccm-common-storage/deploy/app.zip
      Server: /opt/club-manager/backend
      Logs: /var/log/user-data.log (setup logs)
    
    ========================================
    EOT
  ) : (
    <<-EOT
    
    ========================================
    Cricket Club Manager - Lambda Deployment
    ========================================
    
    Lambda Function:
      Function Name: ${aws_lambda_function.api[0].function_name}
      ARN: ${aws_lambda_function.api[0].arn}
    
    Application URL: 
      ${aws_lambda_function_url.api[0].function_url}
    
    Database Configuration:
      Host: ${var.db_host}
      Port: ${var.db_port}
      Database: ${var.db_name}
      Username: ${var.db_username}
    
    Next Steps:
      1. Test API: curl ${aws_lambda_function_url.api[0].function_url}
      2. View logs: aws logs tail /aws/lambda/${aws_lambda_function.api[0].function_name} --follow
      3. To update: Deploy new Lambda package
    
    Environment: ${local.environment}
    Runtime: Python 3.11
    Memory: 512 MB
    Timeout: 30 seconds
    
    ========================================
    EOT
  )
}
