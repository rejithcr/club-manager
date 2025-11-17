# Cricket Club Manager - Infrastructure as Code (Minimal Setup)

This directory contains Terraform configuration to deploy a single EC2 instance for the Cricket Club Manager backend. This is a minimal setup using the default VPC with an external database.

**Uses Terraform Workspaces for environment management (dev/prod)**

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Internet                        │
└──────────────────┬──────────────────────────┘
                   │
                   │
            ┌──────▼──────┐
            │   EC2       │
            │  Instance   │
            │  (Backend)  │
            │  Port 8000  │
            └──────┬──────┘
                   │
                   │
            ┌──────▼──────┐
            │  External   │
            │  Database   │
            │ (PostgreSQL)│
            └─────────────┘
```

## 📁 Files

- **main.tf** - Main Terraform configuration with AWS provider and data sources
- **variables.tf** - Input variables definition
- **security_groups.tf** - Security group for EC2 instance
- **ec2.tf** - Single EC2 instance with IAM role
- **outputs.tf** - Output values after deployment (IP, DNS, connection info)
- **terraform.tfvars.example** - Example configuration file

## 🚀 Quick Start

### Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Terraform** v1.0+ installed
4. **S3 Bucket** `ccm-common-storage` with application package

### Upload Application to S3

Before deploying infrastructure, package and upload your backend application:

```powershell
# Package and upload backend application
backend\package-app.ps1

# This will:
# 1. Create app.zip with src/ and requirements.txt
# 2. Upload to s3://ccm-common-storage/deploy/app.zip
```

Or manually:
```bash
# Create package
cd backend
zip -r app.zip src/ requirements.txt

# Upload to S3
aws s3 cp app.zip s3://ccm-common-storage/deploy/app.zip
```

### Installation

```bash
# Install Terraform (Windows - using Chocolatey)
choco install terraform

# Or download from: https://www.terraform.io/downloads
```

### Configure AWS Credentials

```powershell
# Configure AWS CLI
aws configure

# Or set environment variables
$env:AWS_ACCESS_KEY_ID="your-access-key"
$env:AWS_SECRET_ACCESS_KEY="your-secret-key"
$env:AWS_DEFAULT_REGION="us-east-1"
```

### Deploy Infrastructure

```bash
# Navigate to infra directory
cd infra

# Initialize Terraform
terraform init

# Create and select workspace (dev or prod)
terraform workspace new dev
# or
terraform workspace select dev

# Review the planned changes
terraform plan

# Apply the configuration
terraform apply
```

## 🎯 Terraform Workspaces

This infrastructure uses **Terraform Workspaces** to manage different environments (dev, prod) with the same configuration files.

### Benefits of Using Workspaces

- **Single codebase** for all environments
- **Isolated state** for each environment
- **Environment-specific configurations** automatically applied
- **Easy switching** between environments
- **Cost optimization** - different instance sizes per environment

### Environment Configurations

#### Development (dev)
```hcl
instance_type      = "t3.small"    # ~$15/month
db_min_connections = 5
db_max_connections = 20
```

#### Production (prod)
```hcl
instance_type      = "t3.medium"   # ~$30/month
db_min_connections = 10
db_max_connections = 50
```

### Workspace Commands

```bash
# Show current workspace
terraform workspace show

# List all workspaces
terraform workspace list

# Create new workspace
terraform workspace new <name>

# Switch to workspace
terraform workspace select <name>

# Delete workspace (must be empty)
terraform workspace delete <name>
```

### Typical Workflow

#### Development Cycle
```bash
# 1. Switch to dev workspace
terraform workspace select dev

# 2. Deploy to dev
terraform plan
terraform apply

# 3. Verify everything works
curl http://<DEV_IP>:5000/health

# 4. Switch to prod and apply same changes
terraform workspace select prod
terraform plan
terraform apply
```

### File Organization Options

#### Option 1: Single tfvars file (Current setup)
```bash
infra/
  ├── terraform.tfvars        # Update values when switching workspaces
  └── ...
```

#### Option 2: Separate tfvars per environment
```bash
infra/
  ├── terraform.tfvars.dev    # Dev environment values
  ├── terraform.tfvars.prod   # Prod environment values
  └── ...

# Use with:
terraform plan -var-file="terraform.tfvars.dev"
terraform apply -var-file="terraform.tfvars.prod"
```

#### Option 3: Environment variables
```powershell
# Set variables
$env:TF_VAR_db_password="dev-password"
$env:TF_VAR_jwt_secret_key="dev-secret"

# Deploy
terraform apply
```

### Workspace Best Practices

1. **Always Check Current Workspace**
   ```bash
   # Before any operation, verify workspace
   terraform workspace show
   ```

2. **Separate Database Credentials**
   - Use different database endpoints for dev/prod
   - Different passwords for each environment
   - Consider AWS Secrets Manager for production

3. **Tag Resources**
   - Resources are automatically tagged with workspace name
   - Use tags for cost tracking and resource filtering

4. **Customizing Workspace Configurations**
   
   Edit `main.tf` to modify environment-specific settings:
   ```hcl
   locals {
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
   }
   ```

5. **Override Workspace Defaults**
   
   In `terraform.tfvars`:
   ```hcl
   instance_type = "t3.large"  # Override workspace default
   ```

### Workspace Troubleshooting

**Forgot which workspace you're in?**
```bash
terraform workspace show
```

**Accidentally deployed to wrong workspace?**
```bash
# Destroy resources in wrong workspace
terraform workspace select <wrong-workspace>
terraform destroy

# Deploy to correct workspace
terraform workspace select <correct-workspace>
terraform apply
```

**State file conflicts?**
```bash
# Each workspace has separate state file:
# terraform.tfstate.d/dev/terraform.tfstate
# terraform.tfstate.d/prod/terraform.tfstate
```

## 🔧 Configuration

### Required Variables

Edit `terraform.tfvars`:

```hcl
# External Database (REQUIRED)
db_host     = "your-db-host.com"
db_username = "dbadmin"
db_password = "YourSecurePassword123!"

# JWT secret key (REQUIRED)
jwt_secret_key = "your-long-random-secret-key-here"

# EC2 Key Pair (Optional - for SSH access)
key_pair_name = "your-keypair-name"
```

## 📊 Resource Overview

### Created Resources

- **1 EC2 Instance** (t3.small) in default VPC
- **1 Security Group** (allows HTTP:8000 and SSH:22)
- **1 IAM Role** for EC2 with SSM access
- **1 IAM Instance Profile**

Uses:
- **Default VPC** (no new VPC created)
- **Default Subnet** (first available)
- **External Database** (not created by Terraform)

### Estimated Monthly Cost

**Minimal Setup:**
- EC2 t3.small (1 instance): ~$15/month
- EBS Storage (30GB): ~$3/month
- Data transfer: ~$2/month
- **Total: ~$20/month**

*Note: Database costs not included (external)*

## 🔒 Security Best Practices

### 1. Use Temporary AWS Credentials

For secure deployments, use temporary session tokens instead of long-term credentials:

```powershell
# Generate temporary session token (1 hour)
python get_aws_session.py --output powershell | Invoke-Expression

# Now deploy with temporary credentials
terraform apply
```

See [AWS_SESSION_README.md](./AWS_SESSION_README.md) for detailed usage.

### 2. Secure Secrets

**DO NOT** commit secrets to version control. Use one of these methods:

#### Option A: Temporary AWS Session Tokens (Recommended)

```bash
# Generate temporary credentials (more secure than long-term keys)
python get_aws_session.py --duration 7200 --output export
```

#### Option B: AWS Secrets Manager (Recommended)

```bash
# Store database password
aws secretsmanager create-secret \
  --name cricket-club-manager/db-password \
  --secret-string "YourSecurePassword"

# Store JWT secret
aws secretsmanager create-secret \
  --name cricket-club-manager/jwt-secret \
  --secret-string "YourJWTSecret"
```

#### Option B: Environment Variables

```powershell
$env:TF_VAR_db_password="YourPassword"
$env:TF_VAR_jwt_secret_key="YourSecret"
terraform apply
```

#### Option C: terraform.tfvars (NOT in version control)

Add to `.gitignore`:
```
terraform.tfvars
*.tfstate
*.tfstate.backup
```

### 2. Restrict Network Access

Update `allowed_cidr_blocks` in `terraform.tfvars`:

```hcl
# Production - restrict to your IP or VPN
allowed_cidr_blocks = ["YOUR_IP/32"]

# Or use security group IDs
```

### 3. Enable Database Encryption

Database encryption is enabled by default in `rds.tf`.

### 4. Use IAM Authentication (Optional)

For enhanced security, enable IAM database authentication:

```hcl
# In rds.tf
iam_database_authentication_enabled = true
```

## 🚀 Deployment Process

### After Terraform Apply

1. **Get connection information:**
   ```bash
   terraform output connection_instructions
   ```

2. **SSH to EC2 instance:**
   ```bash
   ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>
   ```

3. **Deploy application code:**
   ```bash
   cd /opt/cricket-club-manager/backend
   
   # Upload your code (using scp, git, etc.)
   git clone https://github.com/yourusername/cricket-club-manager.git /opt/cricket-club-manager
   
   # Or use scp from local machine:
   # scp -i your-key.pem -r ./backend/* ec2-user@<EC2_IP>:/opt/cricket-club-manager/backend/
   
   # Install dependencies
   cd backend
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   # Install PostgreSQL client
   sudo yum install -y postgresql15
   
   # Connect to RDS
   psql -h <RDS_ENDPOINT> -U dbadmin -d cricketclub
   
   # Run migrations from db/ folder
   ```

5. **Start the application:**
   ```bash
   sudo systemctl start cricket-club-api
   sudo systemctl status cricket-club-api
   
   # View logs
   sudo journalctl -u cricket-club-api -f
   ```

6. **Test the API:**
   ```bash
   # From local machine
   curl http://<EC2_PUBLIC_IP>:8000/health
   ```

## 📈 Monitoring

### Application Monitoring

```bash
# SSH to EC2 and check service status
sudo systemctl status cricket-club-api

# Check application logs
sudo journalctl -u cricket-club-api -f

# Check Gunicorn workers
ps aux | grep gunicorn
```

## 🔄 Updates and Maintenance

### Update Application Code

The EC2 instance includes an automatic update script:

```bash
# SSH to EC2
ssh -i your-key.pem ec2-user@<EC2_IP>

# Update application (downloads latest from S3)
sudo /opt/cricket-club-manager/update-app.sh
```

Or update from your local machine:

```powershell
# 1. Package new version
.\infra\package-app.ps1

# 2. SSH and run update script
ssh -i your-key.pem ec2-user@<EC2_IP>
sudo /opt/cricket-club-manager/update-app.sh
```

The update script will:
1. Download latest `app.zip` from S3
2. Stop the service
3. Backup current version
4. Extract new version
5. Install dependencies
6. Restart the service

### Update Infrastructure

```bash
# Make changes to .tf files
# Review changes
terraform plan

# Apply changes
terraform apply
```

### Scaling

```hcl
# Change instance type in terraform.tfvars
instance_type = "t3.medium"

# Apply changes
terraform apply
```

For horizontal scaling, consider upgrading to the full infrastructure setup with ALB and Auto Scaling.

## 🧹 Cleanup

### Destroy Infrastructure

```bash
# WARNING: This will delete all resources and data!
terraform destroy

# If RDS has deletion protection
# First disable in terraform.tfvars:
# Then run destroy again
```

## 🐛 Troubleshooting

### Issue: Can't connect to EC2

**Solution:**
1. Check security group allows your IP
2. Verify key pair is correct
3. Use Session Manager (no SSH key needed):
   ```bash
   aws ssm start-session --target <INSTANCE_ID>
   ```

### Issue: Application not starting

**Solution:**
```bash
# Check systemd service status
sudo systemctl status cricket-club-api

# Check application logs
sudo journalctl -u cricket-club-api -n 100

# Check if database is accessible
psql -h <RDS_ENDPOINT> -U dbadmin -d cricketclub
```

### Issue: High database connections

**Solution:**
```bash
# Check current connections
psql -h <RDS_ENDPOINT> -U dbadmin -d cricketclub -c "SELECT count(*) FROM pg_stat_activity;"

# Adjust connection pool in .env
DB_MAX_CONNECTIONS=10  # Reduce if too high

# Restart service
sudo systemctl restart cricket-club-api
```

### Issue: Terraform state locked

**Solution:**
```bash
# Force unlock (use with caution)
terraform force-unlock <LOCK_ID>
```

### Issue: Wrong workspace deployed

**Solution:**
```bash
# Check current workspace
terraform workspace show

# If wrong workspace, destroy and redeploy
terraform destroy
terraform workspace select <correct-workspace>
terraform apply
```

## 📊 Monitoring and Cost Tracking

### Application Monitoring

```bash
# SSH to EC2 and check service status
sudo systemctl status cricket-club-api

# Check application logs
sudo journalctl -u cricket-club-api -f

# Check Gunicorn workers
ps aux | grep gunicorn
```

### Monitoring Per Environment

```bash
# In AWS Console, filter by tags:
# Environment = dev
# Environment = prod

# Or use AWS CLI
aws ec2 describe-instances \
  --filters "Name=tag:Environment,Values=dev"
```

### Cost Tracking

Enable AWS Cost Explorer and filter by Environment tag:
- **Dev environment**: ~$20/month (t3.small)
- **Prod environment**: ~$35/month (t3.medium)

```bash
# Group costs by Environment tag in Cost Explorer
```

## 📚 Additional Resources

- [Terraform Workspaces Documentation](https://developer.hashicorp.com/terraform/language/state/workspaces)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS Tagging Best Practices](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Backend Deployment Guide](../backend/DEPLOYMENT_GUIDE.md)

## 🤝 Support

For issues or questions:
1. Check CloudWatch Logs
2. Review systemd service logs
3. Check RDS connectivity
4. Verify security group rules
5. Ensure correct workspace is selected (`terraform workspace show`)

## 🎓 Key Takeaways

**Workspace Management:**
- ✅ Use `terraform workspace select <name>` before any operation
- ✅ Each workspace has isolated state and resources
- ✅ Environment configs are automatically applied based on workspace
- ✅ Tag filtering helps track resources per environment
- ✅ One codebase, multiple environments

**Deployment:**
- ✅ Package application with `package-app.ps1`
- ✅ Upload to S3 before deploying infrastructure
- ✅ EC2 automatically downloads and installs from S3
- ✅ Use update script for application updates

## 📝 License

This infrastructure configuration is part of the Cricket Club Manager project.
