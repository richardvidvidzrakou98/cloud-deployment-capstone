#!/bin/bash
set -e

echo "Initializing Terraform..."
terraform init

echo "Validating Terraform configuration..."
terraform validate

echo "Planning Terraform changes..."
terraform plan -out=tfplan

echo "Applying Terraform changes..."
terraform apply tfplan

echo "Deployment complete!"
echo "ALB DNS: $(terraform output alb_dns_name)"
