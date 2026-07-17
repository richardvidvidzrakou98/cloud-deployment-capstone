output "bucket_name" {
  value = aws_s3_bucket.assets.id
}

output "bucket_arn" {
  value = aws_s3_bucket.assets.arn
}

output "bucket_regional_domain_name" {
  value = aws_s3_bucket.assets.bucket_regional_domain_name
}

output "public_base_url" {
  description = "Base public URL to prefix static asset filenames with"
  value       = "https://${aws_s3_bucket.assets.bucket_regional_domain_name}"
}
