#!/bin/bash

# EC2 user_data script - runs once on first boot (via cloud-init).
# Installs nginx, pulls the site content from S3, and stands up a
# health check endpoint for the ALB target group.

set -e

# Refresh package metadata and install nginx (Amazon Linux 2023 uses dnf)
dnf update -y
dnf install -y nginx

# Start nginx now, before touching any content.
systemctl enable nginx
systemctl start nginx

# Wipe nginx's default document root (default index.html, 404/50x pages,
# sample images, etc.) 
rm -rf /usr/share/nginx/html/*

# Pull the site (html/css/js/images) from S3, preserving folder structure
# so relative paths in the HTML (css/styles.css, js/main.js, images/...)
# resolve exactly as they do locally.
for i in 1 2 3 4 5; do
  if aws s3 sync "s3://${asset_bucket}" /usr/share/nginx/html/ --region "${region}"; then
    break
  fi
  echo "s3 sync attempt $i failed, retrying in 10s..."
  sleep 10
done

# Swap the {{ASSET_BASE_URL}} placeholder (left in the source HTML) for
# the real public S3 bucket URL
find /usr/share/nginx/html -type f -name "*.html" \
  -exec sed -i "s|{{ASSET_BASE_URL}}|${asset_base_url}|g" {} +

# Simple health check endpoint for the ALB target group. Written after
# the sync so a later re-sync/re-run can't ever delete it.
cat > /usr/share/nginx/html/health <<'EOF'
OK
EOF

systemctl restart nginx