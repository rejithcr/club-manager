# Security Groups

# EC2 Instance Security Group
resource "aws_security_group" "ec2" {
  name        = "${var.project_name}-ec2-sg-${local.environment}"
  description = "Security group for EC2 backend instance"
  vpc_id      = data.aws_vpc.default.id

  # HTTP access from anywhere
  ingress {
    description = "HTTP from anywhere"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  # SSH access
  ingress {
    description = "SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  # Allow all outbound traffic
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg-${local.environment}"
  }
}
