# Terraform variable values
aws_region           = "us-east-1"
vpc_cidr             = "10.0.0.0/16"
public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.3.0/24", "10.0.4.0/24"]
availability_zones   = ["us-east-1a", "us-east-1b"]
instance_type        = "t3.medium"
instance_count       = 2
key_name             = "hypervisor-key-pair"
allowed_ssh_cidrs    = ["41.155.79.36/32"]
static_bucket_name   = "azubi-hypervisor-static-bucket1"
git_repo_url         = "https://github.com/richardvidvidzrakou98/cloud-deployment-capstone"
git_branch           = "main"
domain_name          = "akuafomarket.vidzrakou.com"