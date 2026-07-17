# AWS Certificate Manager configuration
# SSL Certificate
resource "aws_acm_certificate" "main" {
  domain_name       = var.domain_name
  validation_method = "DNS"  # DNS validation - no email needed
  
  tags = {
    Name = "${var.project_name}-cert"
  }
}