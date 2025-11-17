# Outputs

output "vpc_id" {
  description = "ID of the default VPC"
  value       = data.aws_vpc.default.id
}

output "subnet_id" {
  description = "ID of the subnet used"
  value       = data.aws_subnet.default.id
}

output "ec2_instance_id" {
  description = "ID of EC2 instance"
  value       = aws_instance.web_server.id
}

output "ec2_public_ip" {
  description = "Public IP of EC2 instance"
  value       = aws_instance.web_server.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS of EC2 instance"
  value       = aws_instance.web_server.public_dns
}

output "application_url" {
  description = "Application URL"
  value       = "http://${aws_instance.web_server.public_ip}:8000"
}

output "security_group_id" {
  description = "ID of EC2 security group"
  value       = aws_security_group.ec2.id
}

output "iam_role_arn" {
  description = "ARN of EC2 IAM role"
  value       = aws_iam_role.ec2.arn
}

# Connection Instructions
output "connection_instructions" {
  description = "Instructions for connecting to resources"
  value = <<-EOT
    
    ========================================
    Cricket Club Manager - Deployment Info
    ========================================
    
    EC2 Instance:
      Instance ID: ${aws_instance.web_server.id}
      Public IP: ${aws_instance.web_server.public_ip}
      Public DNS: ${aws_instance.web_server.public_dns}
    
    Application URL: 
      http://${aws_instance.web_server.public_ip}:8000
    
    SSH Access:
      ${var.key_pair_name != "" ? "ssh -i ${var.key_pair_name}.pem ec2-user@${aws_instance.web_server.public_ip}" : "No key pair configured - use AWS Systems Manager Session Manager"}
    
    Database Configuration:
      Host: ${var.db_host}
      Port: ${var.db_port}
      Database: ${var.db_name}
      Username: ${var.db_username}
    
    Next Steps:
      1. Application is automatically deployed from S3
      2. Check service status: sudo systemctl status cricket-club-api
      3. View logs: sudo journalctl -u cricket-club-api -f
      4. Test API: curl http://${aws_instance.web_server.public_ip}:5000/health
      5. To update app: sudo /opt/cricket-club-manager/update-app.sh
    
    Application Location:
      S3: s3://ccm-common-storage/app.zip
      Server: /opt/cricket-club-manager/backend
      Logs: /var/log/user-data.log (setup logs)
    
    ========================================
  EOT
}
