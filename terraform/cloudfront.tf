# CloudFront distribution configuration

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "static" {
  comment = "Access identity for S3 static assets"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "static" {
  enabled = true

  origin {
    domain_name = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id   = "s3-static-origin"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.static.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    target_origin_id       = "s3-static-origin"
    viewer_protocol_policy = "https-only"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 3600
    default_ttl = 86400
    max_ttl     = 31536000
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name = "${var.project_name}-static-cdn"
  }
}
