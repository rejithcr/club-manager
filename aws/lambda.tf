resource "aws_lambda_function_url" "api_url" {
    function_name      = aws_lambda_function.lambda.function_name
    authorization_type = "NONE"

    cors {
         allow_credentials = true
         allow_origins     = ["*"]
         allow_methods     = ["*"]
         allow_headers     = ["date", "keep-alive"]
         expose_headers    = ["keep-alive", "date"]
         max_age           = 86400
        }
}


resource "aws_lambda_function" "lambda" {
    filename      = "../main.zip"
    function_name = "ccm-api"
    role          = aws_iam_role.role.arn
    handler       = "main.handler"
    runtime       = "python3.13"

    source_code_hash = filebase64sha256("../main.zip")
}

# IAM 
data "aws_iam_policy_document" "assume_role" {
      statement {
          effect = "Allow"
          principals {
               type        = "Service"
               identifiers = ["lambda.amazonaws.com"]
          }
          actions = ["sts:AssumeRole"]
     }
 }

 resource "aws_iam_role" "role" {
 
   name               = "ccm-lambda-role"
   assume_role_policy = data.aws_iam_policy_document.assume_role.json
   
 }

