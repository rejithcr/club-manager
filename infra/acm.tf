# -----------------------------------------------------------------------
# CloudFront ACM Certificate (us-east-1)
# This certificate was created manually and imported into Terraform.
# It covers sportsclubsmanager.com and *.sportsclubsmanager.com.
# -----------------------------------------------------------------------
resource "aws_acm_certificate" "cloudfront_cert" {
  provider          = aws.us_east_1
  domain_name       = var.domain_name
  validation_method = "DNS"
  subject_alternative_names = ["*.${var.domain_name}"]
  lifecycle {
    create_before_destroy = true
  }
}

# -----------------------------------------------------------------------
# ALB ACM Certificate (ap-south-1)
# Create an ACM certificate in the default region (ap-south-1) for the ALB
resource "aws_acm_certificate" "alb_cert" {
  domain_name       = var.domain_name
  validation_method = "DNS"
  
  # Optional: Subject Alternative Names if needed (e.g., api., www., or wildcard)
  subject_alternative_names = ["*.${var.domain_name}"]

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "${var.domain_name}-alb-cert"
  }
}

# Create DNS records for ACM validation
resource "aws_route53_record" "alb_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.alb_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}

# Wait for validation to complete before the certificate can be used
resource "aws_acm_certificate_validation" "alb_cert" {
  certificate_arn         = aws_acm_certificate.alb_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.alb_cert_validation : record.fqdn]
}
