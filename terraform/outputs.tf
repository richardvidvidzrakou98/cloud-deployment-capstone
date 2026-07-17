# Output definitions
output "alb_dns_name" {
  description = "ALB DNS name - Use this for your GitHub secrets"
  value       = aws_lb.main.dns_name
}

output "alb_arn" {
  description = "ALB ARN"
  value       = aws_lb.main.arn
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.static.id
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "acm_certificate_arn" {
  description = "ACM Certificate ARN"
  value       = aws_acm_certificate.main.arn
}

output "acm_dns_validation_records" {
  description = "DNS validation records - Add these to your domain's DNS provider"
  value       = aws_acm_certificate.main.domain_validation_options
}