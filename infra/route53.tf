resource "aws_route53_zone" "main" {
  name = var.domain_name
}

resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.api_alb.dns_name
    zone_id                = aws_lb.api_alb.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53domains_registered_domain" "domain" {
  domain_name = aws_route53_zone.main.name

  dynamic "name_server" {
    for_each = aws_route53_zone.main.name_servers
    content {
      name = name_server.value
    }
  }
}