# Notes

## To destroy only ALB, ASG and ACM
```
terraform destroy -target="aws_lb.api_alb" -target="aws_autoscaling_group.api_asg" -target="aws_acm_certificate.alb_cert"
```

## To destroy only CloudFront and S3
```
terraform destroy \
  -target="aws_cloudfront_distribution.frontend" \
  -target="aws_s3_bucket.frontend"
```