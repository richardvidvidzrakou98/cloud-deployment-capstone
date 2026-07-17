variable "project_name" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "instance_count" {
  type = number
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "key_name" {
  type    = string
  default = ""
}

variable "asset_bucket" {
  description = "Name of the S3 bucket holding the site's html/css/js/images"
  type        = string
}

variable "asset_bucket_arn" {
  description = "ARN of that bucket, used to scope the EC2 instance role's IAM policy"
  type        = string
}

variable "region" {
  description = "AWS region, passed to the aws s3 sync command in user_data"
  type        = string
}

variable "asset_base_url" {
  description = "Public base URL of the S3 assets bucket, e.g. https://bucket.s3.region.amazonaws.com"
  type        = string
}