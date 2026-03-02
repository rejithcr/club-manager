output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "s3_bucket_name" {
  description = "The name of the S3 bucket hosting the frontend"
  value       = aws_s3_bucket.frontend.id
}

output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = aws_lb.api_alb.dns_name
}

output "route53_zone_name_servers" {
  description = "Name servers for the created Route 53 zone"
  value       = aws_route53_zone.main.name_servers
}
