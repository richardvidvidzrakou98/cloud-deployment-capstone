resource "aws_s3_bucket" "assets" {
  bucket = var.bucket_name

  tags = {
    Name = "${var.project_name}-static-assets"
  }
}

# Modern ACL approach: bucket owner enforced (ACLs disabled), public read is
# granted via bucket policy instead of ACLs, which is the AWS-recommended pattern.
resource "aws_s3_bucket_ownership_controls" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Public access block: we need to allow public bucket policies since these are
# public static assets (images/css/js) served directly via public URL.
resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read" {
  bucket = aws_s3_bucket.assets.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.assets.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.assets]
}

resource "aws_s3_bucket_cors_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Disabled"
  }
}

# Upload the local app/ static assets (css, js, images) so they're available
# via their public S3 URL, e.g. https://<bucket>.s3.<region>.amazonaws.com/style.css
resource "aws_s3_object" "assets" {
  for_each = fileset(var.assets_dir, "**")
  # for_each = { for f in fileset(var.assets_dir, "**") : f => f if !endswith(f, ".html") }

  bucket       = aws_s3_bucket.assets.id
  key          = each.value
  source       = "${var.assets_dir}/${each.value}"
  etag         = filemd5("${var.assets_dir}/${each.value}")
  content_type = lookup(var.mime_types, regex("[^.]+$", each.value), "application/octet-stream")

  depends_on = [aws_s3_bucket_policy.public_read]
}
