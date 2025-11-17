# EC2 Configuration for Backend Application

# IAM Role for EC2
resource "aws_iam_role" "ec2" {
  name = "${var.project_name}-ec2-role-${local.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-ec2-role-${local.environment}"
  }
}

# IAM Policy for EC2 (S3, CloudWatch, SSM, Secrets Manager access)
resource "aws_iam_role_policy" "ec2_policy" {
  name = "${var.project_name}-ec2-policy-${local.environment}"
  role = aws_iam_role.ec2.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::ccm-common-storage",
          "arn:aws:s3:::ccm-common-storage/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "arn:aws:secretsmanager:*:*:secret:${var.project_name}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:*:*:parameter/${var.project_name}/*"
      }
    ]
  })
}

# Attach SSM Policy for Session Manager
resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "ec2" {
  name = "${var.project_name}-ec2-profile-${local.environment}"
  role = aws_iam_role.ec2.name

  tags = {
    Name = "${var.project_name}-ec2-profile-${local.environment}"
  }
}

# User Data Script
locals {
  user_data = <<-EOF
#!/bin/bash
set -e

# Log all output
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "========================================="
echo "Cricket Club Manager - Deployment Script"
echo "========================================="
echo "Starting deployment at: $(date)"

# Update system
echo "Updating system packages..."
yum update -y

yum update -y
yum install python3 -y # Install Python 3 if needed
yum install python3-pip -y # Install pip for Python 3
ln -s /usr/bin/python3 /usr/bin/python

# Create application directory
APP_DIR="/opt/club-manager/backend"
echo "Creating application directory: $APP_DIR"
mkdir -p $APP_DIR
cd $APP_DIR

echo "Downloading application from S3..."
aws s3 cp s3://ccm-common-storage/deploy/app.zip .  
echo "Extracting application..."
unzip -o app.zip

#### from here code is not coming in usedata log.
python3 -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt

# Set .env vars
    
DB_HOST=${var.db_host}
DB_USER=${var.db_username}
DB_PASSWORD=${var.db_password}
DB_NAME=${var.db_name}
DB_PORT=${var.db_port}
DB_MIN_CONNECTIONS=${var.db_min_connections != 0 ? var.db_min_connections : local.env_config.db_min_connections}
DB_MAX_CONNECTIONS=${var.db_max_connections != 0 ? var.db_max_connections : local.env_config.db_max_connections}
JWT_SECRET_KEY=${var.jwt_secret_key}


gunicorn --bind 0.0.0.0:8000 'src.app:create_app()'

EOF
}

# Single EC2 Instance
resource "aws_instance" "web_server" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = var.instance_type != "" ? var.instance_type : local.env_config.instance_type
  key_name      = var.key_pair_name != "" ? var.key_pair_name : null
  
  subnet_id              = data.aws_subnet.default.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  
  iam_instance_profile = aws_iam_instance_profile.ec2.name
  
  user_data = local.user_data

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    delete_on_termination = true
    encrypted             = true
  }

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  tags = {
    Name = "${var.project_name}-${local.environment}"
  }
}
