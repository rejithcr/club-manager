output "api" {
  value       = "https://${data.aws_api_gateway_rest_api.api.id}.execute-api.${var.region}.amazonaws.com"
  sensitive   = true
  description = "API URL"
  depends_on  = []
}
