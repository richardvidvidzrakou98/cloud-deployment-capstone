#!/bin/bash
set -e

PROJECT_NAME="${project_name}"
GIT_REPO_URL="${git_repo_url}"
GIT_BRANCH="${git_branch}"
BUCKET_NAME="${bucket_name}"
APP_DIR="/var/www/$${project_name}"

# Update system
yum update -y
yum install -y git nginx

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install PM2
npm install -g pm2

# Clone application
mkdir -p $${APP_DIR}
cd $${APP_DIR}
git clone $${GIT_REPO_URL} app
cd app
git checkout $${GIT_BRANCH}

# Install and build
npm install
npm run build
npm install -g serve

# Configure Nginx
cat > /etc/nginx/conf.d/$${PROJECT_NAME}.conf <<EOF
server {
    listen 3000;
    root $${APP_DIR}/app/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
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

# Start app with PM2
cd $${APP_DIR}/app
pm2 start npm --name "$${PROJECT_NAME}" -- run serve
pm2 save
pm2 startup

echo "Deployment complete!"