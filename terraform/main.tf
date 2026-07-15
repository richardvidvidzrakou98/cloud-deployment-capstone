locals {
  # Auto-generate a globally-unique bucket name if the user didn't set one
  bucket_name = var.bucket_name != "" ? var.bucket_name : "${var.project_name}-assets-${data.aws_caller_identity.current.account_id}"
}

data "aws_caller_identity" "current" {}

module "vpc" {
  source = "./modules/vpc"

  project_name        = var.project_name
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  azs                 = var.azs
}

module "security_group" {
  source = "./modules/security_group"

  project_name              = var.project_name
  vpc_id                    = module.vpc.vpc_id
  ssh_cidr                  = var.ssh_cidr
  allow_direct_public_http  = var.allow_direct_public_http
}

module "s3_assets" {
  source = "./modules/s3"

  project_name = var.project_name
  bucket_name  = local.bucket_name
  assets_dir   = "${path.module}/../app"
}

module "ec2" {
  source = "./modules/ec2"

  project_name       = var.project_name
  instance_type      = var.instance_type
  instance_count     = var.instance_count
  public_subnet_ids  = module.vpc.public_subnet_ids
  security_group_id  = module.security_group.ec2_sg_id
  key_name           = var.key_name
  asset_bucket      = module.s3_assets.bucket_name
  asset_bucket_arn  = module.s3_assets.bucket_arn
  region            = var.region
  asset_base_url    = module.s3_assets.public_base_url


}

module "alb" {
  source = "./modules/alb"

  project_name       = var.project_name
  vpc_id             = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
  alb_sg_id          = module.security_group.alb_sg_id
  instance_ids       = module.ec2.instance_ids
  certificate_arn    = var.certificate_arn
  health_check_path  = var.health_check_path
}
