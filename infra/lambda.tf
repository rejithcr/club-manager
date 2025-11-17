# Lambda Configuration for Backend Application
# Only created when deployment_type = "lambda"

# Data source to get S3 object metadata for change detection
data "aws_s3_object" "lambda_zip" {
  count  = var.deployment_type == "lambda" ? 1 : 0
  bucket = "ccm-common-storage"
  key    = "deploy/app.zip"
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda" {
  count = var.deployment_type == "lambda" ? 1 : 0
  name  = "${var.project_name}-lambda-role-${local.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-lambda-role-${local.environment}"
  }
}

# IAM Policy for Lambda
resource "aws_iam_role_policy" "lambda_policy" {
  count = var.deployment_type == "lambda" ? 1 : 0
  name  = "${var.project_name}-lambda-policy-${local.environment}"
  role  = aws_iam_role.lambda[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "arn:aws:secretsmanager:*:*:secret:${var.project_name}/*"
      }
    ]
  })
}

# Lambda Function
resource "aws_lambda_function" "api" {
  count         = var.deployment_type == "lambda" ? 1 : 0
  function_name = "${var.project_name}-api-${local.environment}"
  role          = aws_iam_role.lambda[0].arn
  handler       = "src.app.lambda_handler"
  runtime       = "python3.9"
  timeout       = 60
  memory_size   = 512

  # Deploy from S3
  s3_bucket         = "ccm-common-storage"
  s3_key            = "deploy/app.zip"
  source_code_hash  = data.aws_s3_object.lambda_zip[0].etag

  environment {
    variables = {
      DEPLOYMENT_ENV     = "lambda"
      DB_HOST            = var.db_host
      DB_USER            = var.db_username
      DB_PASSWORD        = var.db_password
      DB_NAME            = var.db_name
      DB_PORT            = var.db_port
      DB_MIN_CONNECTIONS = var.db_min_connections != 0 ? var.db_min_connections : local.env_config.db_min_connections
      DB_MAX_CONNECTIONS = var.db_max_connections != 0 ? var.db_max_connections : local.env_config.db_max_connections
      JWT_SECRET_KEY     = var.jwt_secret_key
    }
  }

  tags = {
    Name = "${var.project_name}-api-${local.environment}"
  }
}

# Lambda Function URL (for direct HTTP access)
resource "aws_lambda_function_url" "api" {
  count              = var.deployment_type == "lambda" ? 1 : 0
  function_name      = aws_lambda_function.api[0].function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    max_age           = 86400
  }
}

# CloudWatch Log Group for Lambda
resource "aws_cloudwatch_log_group" "lambda" {
  count             = var.deployment_type == "lambda" ? 1 : 0
  name              = "/aws/lambda/${aws_lambda_function.api[0].function_name}"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-lambda-logs-${local.environment}"
  }
}
