output "alb_dns_name" {
  description = "Public DNS name of the ALB -- open this in a browser to test"
  value       = module.alb.alb_dns_name
}

output "ec2_instance_public_ips" {
  value = module.ec2.instance_public_ips
}

output "s3_assets_bucket" {
  value = module.s3_assets.bucket_name
}

output "s3_assets_public_base_url" {
  value = module.s3_assets.public_base_url
}
