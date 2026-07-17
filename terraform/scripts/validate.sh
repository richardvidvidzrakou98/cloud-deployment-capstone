#!/bin/bash
set -e

echo "Initializing Terraform..."
terraform init

echo "Validating Terraform configuration..."
terraform validate

echo "Formatting Terraform files..."
terraform fmt -check

echo "Validation complete!"
