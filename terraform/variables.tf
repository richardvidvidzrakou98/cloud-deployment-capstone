# Variable definitions
variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDRs"
  type        = list(string)
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
}

variable "instance_count" {
  description = "Number of instances"
  type        = number
}

variable "key_name" {
  description = "EC2 key pair name"
  type        = string
}

variable "allowed_ssh_cidrs" {
  description = "IPs allowed for SSH"
  type        = list(string)
}

variable "static_bucket_name" {
  description = "S3 bucket name"
  type        = string
}

variable "git_repo_url" {
  description = "Git repository URL"
  type        = string
}

variable "git_branch" {
  description = "Git branch"
  type        = string
  default     = "main"
}

variable "domain_name" {
  description = "Domain for SSL certificate"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "agrolink-ghana"
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}

variable "ami_id" {
  description = "Custom AMI ID (leave empty to use latest Amazon Linux 2)"
  type        = string
  default     = ""
}