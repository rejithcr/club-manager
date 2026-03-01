#!/bin/bash
yum update -y
yum install -y python3 python3-pip unzip

# Setup application directory
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

# Download source zip from S3
aws s3 cp s3://ccm-common-storage/deploy/backend-app.zip /home/ec2-user/backend-app.zip --region ap-south-1
unzip -o /home/ec2-user/backend-app.zip -d /home/ec2-user/app/

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install python dependencies
pip install -r requirements.txt

# Ensure ec2-user owns the extracted files and virtual environment
chown -R ec2-user:ec2-user /home/ec2-user/app

# Create Systemd service for gunicorn
cat << 'SERVICE' > /etc/systemd/system/flaskapp.service
[Unit]
Description=Flask application for Club Manager
After=network.target

[Service]
User=ec2-user
Group=ec2-user
WorkingDirectory=/home/ec2-user/app
Environment="PATH=/home/ec2-user/app/venv/bin"
ExecStart=/home/ec2-user/app/venv/bin/gunicorn -w 4 -b 0.0.0.0:80 "src.app:create_app()"
Restart=always
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
SERVICE

# Start and enable the service
systemctl daemon-reload
systemctl enable flaskapp
systemctl restart flaskapp
