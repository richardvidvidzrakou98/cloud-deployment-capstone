#!/bin/bash
set -e

echo "Destroying Terraform infrastructure..."
terraform destroy

echo "Infrastructure destroyed!"
