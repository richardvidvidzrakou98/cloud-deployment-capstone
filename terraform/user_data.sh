#!/bin/bash
set -e

PROJECT_NAME="${project_name}"
APP_DIR="/var/www/$${project_name}"

# Update system (Amazon Linux 2023 uses dnf)
dnf update -y
dnf install -y git nginx

# Install Node.js 22.x
curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
dnf install -y nodejs

# Install PM2
npm install -g pm2

# Create app directory
mkdir -p $${APP_DIR}

# Configure Nginx
cat > /etc/nginx/conf.d/$${PROJECT_NAME}.conf <<EOF
server {
    listen 3000;
    root $${APP_DIR}/app/.output/public;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

systemctl enable nginx
systemctl restart nginx

echo "Environment setup complete - ready for GitHub workflow deployment"