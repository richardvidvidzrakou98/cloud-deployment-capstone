variable "region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix used for tagging and resource naming"
  type        = string
  default     = "hypervisor-webapp"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for the public subnets (one per AZ)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "azs" {
  description = "Availability zones to deploy subnets into"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "instance_type" {
  description = "EC2 instance type for the web servers"
  type        = string
  default     = "t3.micro"
}

variable "instance_count" {
  description = "Number of EC2 instances to launch behind the ALB"
  type        = number
  default     = 2
}

variable "key_name" {
  description = "Existing EC2 key pair name for SSH access (leave empty to disable SSH key)"
  type        = string
  default     = ""
}

variable "ssh_cidr" {
  description = "CIDR allowed to SSH into instances. Leave empty to disable SSH ingress entirely"
  type        = string
  default     = ""
}

variable "allow_direct_public_http" {
  description = "If true, also allow HTTP/HTTPS to EC2 instances directly from 0.0.0.0/0, in addition to from the ALB. Best practice is to leave this false and only allow traffic from the ALB security group."
  type        = bool
  default     = false
}

variable "certificate_arn" {
  description = "ACM certificate ARN for the ALB HTTPS listener. Leave empty to skip HTTPS/redirect (HTTP listener will forward directly to the target group instead)."
  type        = string
  default     = ""
}

variable "health_check_path" {
  description = "Path the ALB target group uses for health checks"
  type        = string
  default     = "/health"
}

variable "bucket_name" {
  description = "Globally-unique name for the S3 bucket that will hold static assets (images/css/js). Leave empty to auto-generate one."
  type        = string
  default     = ""
}
