# Application Deployment Setup Guide

This guide explains how to configure GitHub Actions for automated deployment of the AgroLink Ghana application to your existing AWS infrastructure.

## Prerequisites

Your AWS infrastructure should already have:

- 2 EC2 instances running (with public IPs)
- Application Load Balancer configured
- S3 bucket for static assets
- CloudFront distribution (optional)
- SSH key pair for EC2 access

---

## Required GitHub Secrets

Go to your repository: **Settings → Secrets and variables → Actions → New repository secret**

### AWS Credentials

| Secret Name             | Description                             | How to Get                                                           |
| ----------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | AWS IAM access key                      | AWS Console → IAM → Users → Security credentials → Create access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key                      | Generated with access key above                                      |
| `AWS_REGION`            | AWS region where resources are deployed | e.g., `us-east-1`, `eu-west-1`, or check EC2 console                 |

### S3 Configuration

| Secret Name     | Description                      | How to Get                          |
| --------------- | -------------------------------- | ----------------------------------- |
| `AWS_S3_BUCKET` | S3 bucket name for static assets | AWS Console → S3 → Copy bucket name |

### EC2 Configuration

| Secret Name   | Description                    | How to Get                                               |
| ------------- | ------------------------------ | -------------------------------------------------------- |
| `EC2_HOST_1`  | IP or DNS of EC2 instance 1    | AWS Console → EC2 → Instances → Copy Public IPv4 address |
| `EC2_HOST_2`  | IP or DNS of EC2 instance 2    | AWS Console → EC2 → Instances → Copy Public IPv4 address |
| `EC2_USER`    | SSH username for EC2 instances | `ubuntu` (Ubuntu) or `ec2-user` (Amazon Linux)           |
| `EC2_SSH_KEY` | Private SSH key (.pem file)    | Copy entire contents of your `.pem` key file             |

### CloudFront Configuration (Optional)

| Secret Name                  | Description                | How to Get                                      |
| ---------------------------- | -------------------------- | ----------------------------------------------- |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID | AWS Console → CloudFront → Copy distribution ID |

### Application Configuration

| Secret Name    | Description        | Example                                                                 |
| -------------- | ------------------ | ----------------------------------------------------------------------- |
| `VITE_API_URL` | Production API URL | `https://yourdomain.com/api` or `http://your-alb-dns.amazonaws.com/api` |

---

## Getting Your Infrastructure Details

### 1. AWS Credentials (IAM Access Key)

```bash
# From AWS Console:
# 1. Go to IAM → Users → Select/Create deployment user
# 2. Security credentials tab → Create access key
# 3. Choose "Application running outside AWS"
# 4. Copy Access Key ID and Secret Access Key
```

**Required IAM Permissions:**

- S3: `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`
- CloudFront: `cloudfront:CreateInvalidation` (if using CloudFront)

### 2. EC2 Instance IPs

```bash
# From AWS Console:
# EC2 → Instances → Select instance → Copy "Public IPv4 address"

# Or use AWS CLI:
aws ec2 describe-instances --filters "Name=tag:Name,Values=agrolink-*" \
  --query 'Reservations[*].Instances[*].[PublicIpAddress]' --output text
```

### 3. SSH Private Key

```bash
# Use the .pem file you downloaded when creating the EC2 key pair
# Copy the ENTIRE contents including:
# -----BEGIN RSA PRIVATE KEY-----
# ... key content ...
# -----END RSA PRIVATE KEY-----

# To view your key file:
cat /path/to/your-key.pem
```

⚠️ **Important:** Paste the key exactly as-is, including header/footer lines and all line breaks.

### 4. S3 Bucket Name

```bash
# From AWS Console: S3 → Buckets → Copy bucket name

# Or use AWS CLI:
aws s3 ls
```

### 5. CloudFront Distribution ID (if applicable)

```bash
# From AWS Console: CloudFront → Distributions → Copy ID

# Or use AWS CLI:
aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,DomainName]' --output table
```

---

## Deployment Workflow

The `app-deploy.yml` workflow automatically:

**Triggers when:**

- You push code changes to `main` branch in the `app/` folder
- You manually trigger it from GitHub Actions UI

**Deployment steps:**

1. ✅ Builds the React application (TanStack Start SSR)
2. ✅ Uploads static assets (images, JS, CSS) to S3
3. ✅ Creates a deployment package (.tar.gz)
4. ✅ Deploys to EC2 instance 1
5. ✅ Deploys to EC2 instance 2
6. ✅ Restarts PM2 processes (frontend + API)
7. ✅ Invalidates CloudFront cache (optional)

---

## One-Time EC2 Setup

Before your first deployment, **SSH into EACH EC2 instance** and run:

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# Update system and install Node.js
sudo apt update
sudo apt install -y nodejs npm

# Install PM2 globally
sudo npm install -g pm2

# Configure PM2 to start on boot
pm2 startup
# Copy and run the command it outputs (starts with 'sudo env PATH=...')

# Create application directory
mkdir -p ~/agrolink

# Create logs directory for PM2
mkdir -p ~/agrolink/logs

# Exit
exit
```

Repeat for the second EC2 instance.

---

## Testing the Deployment

### 1. Manual Trigger (Recommended for First Test)

1. Go to GitHub → **Actions** tab
2. Select **"Application Deployment"** workflow
3. Click **"Run workflow"**
4. Select `main` branch
5. Click **"Run workflow"** button
6. Watch the deployment progress

### 2. Automatic Trigger (via Code Push)

```bash
# Make a small change to trigger deployment
cd app
echo "# Deployment test" >> README.md
git add .
git commit -m "test: trigger app deployment workflow"
git push origin main

# Then watch: GitHub → Actions tab
```

### 3. Monitor Deployment

- Go to **GitHub → Actions** tab
- Click on the running workflow
- Expand each step to see logs
- Look for "✅ Application deployed successfully"

---

## Verify Deployment

After successful deployment:

### 1. Check EC2 Instances

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@<EC2_IP>

# Check PM2 processes
pm2 list
# Should show: agrolink-frontend (port 3000) and agrolink-api (port 4000)

# Check PM2 logs
pm2 logs

# Check application files
ls -la ~/agrolink/
```

### 2. Test Application

```bash
# From EC2 instance, test locally
curl http://localhost:3000  # Frontend
curl http://localhost:4000/api/products  # API

# From your computer, test via ALB
curl http://<ALB-DNS-NAME>
```

### 3. Check S3 Assets

```bash
# Verify static assets were uploaded
aws s3 ls s3://<YOUR-BUCKET-NAME>/assets/
```

---

## Troubleshooting

---

## Troubleshooting

### Issue: SSH Connection Failed

**Error:** `Permission denied (publickey)` or connection timeout

**Solutions:**

```bash
# 1. Verify EC2 security group allows SSH from GitHub Actions
# In AWS Console: EC2 → Security Groups → Inbound rules
# Add: Type=SSH, Port=22, Source=0.0.0.0/0 (or GitHub Actions IP ranges)

# 2. Test SSH key locally first
ssh -i your-key.pem ubuntu@<EC2_IP>

# 3. Verify correct username (ubuntu vs ec2-user)
# Ubuntu AMI: ubuntu
# Amazon Linux: ec2-user

# 4. Check key format in GitHub secret (include headers)
-----BEGIN RSA PRIVATE KEY-----
... key content ...
-----END RSA PRIVATE KEY-----
```

### Issue: S3 Upload Failed

**Error:** `Access Denied` or bucket not found

**Solutions:**

```bash
# 1. Verify bucket exists
aws s3 ls s3://<BUCKET_NAME>

# 2. Check IAM permissions for access key
# Required: s3:PutObject, s3:DeleteObject, s3:ListBucket

# 3. Verify bucket region matches AWS_REGION secret

# 4. Check bucket name is correct (no spaces, lowercase)
```

### Issue: PM2 Process Not Starting

**Error:** `pm2: command not found`

**Solutions:**

```bash
# SSH into EC2 and install PM2
sudo npm install -g pm2

# Verify installation
pm2 --version

# If still not found, check PATH
echo $PATH
# Should include /usr/local/bin or /usr/bin
```

### Issue: Build Failed

**Error:** Build errors during workflow

**Solutions:**

```bash
# 1. Test build locally first
cd app
npm ci
npm run build

# 2. Check Node.js version
node --version
# Should be 18.x or higher

# 3. Verify all dependencies in package.json
npm install

# 4. Check environment variables in workflow
```

### Issue: Application Not Accessible via ALB

**Error:** 502 Bad Gateway or connection refused

**Solutions:**

```bash
# 1. Verify PM2 processes are running
ssh -i your-key.pem ubuntu@<EC2_IP>
pm2 list
# Should show both agrolink-frontend and agrolink-api

# 2. Check if apps are listening on correct ports
sudo netstat -tulpn | grep LISTEN
# Should show port 3000 (frontend) and 4000 (API)

# 3. Verify ALB target group health
# AWS Console → EC2 → Target Groups → Check instance health

# 4. Check security groups
# EC2 security group should allow:
# - Port 3000 from ALB security group (frontend)
# - Port 4000 from ALB security group (API)
```

### Issue: Static Assets Not Loading (404 on images)

**Error:** Images/CSS/JS return 404

**Solutions:**

```bash
# 1. Verify S3 upload completed
aws s3 ls s3://<BUCKET_NAME>/assets/ --recursive

# 2. Check bucket is public or CloudFront is configured

# 3. Verify paths in products.json match S3 structure
# Should be: /assets/prod-*.jpg

# 4. Clear CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <DIST_ID> \
  --paths "/*"
```

---

## Deployment Checklist

Use this checklist for your first deployment:

- [ ] All 11 GitHub secrets configured
- [ ] EC2 instances have Node.js and PM2 installed
- [ ] EC2 security groups allow:
  - SSH (port 22) for deployment
  - HTTP (port 3000) from ALB
  - HTTP (port 4000) from ALB
- [ ] S3 bucket exists and is accessible
- [ ] SSH key tested manually from local machine
- [ ] ALB configured with target groups pointing to EC2 instances
- [ ] Application builds successfully locally (`npm run build`)

---

## Post-Deployment Verification

After successful deployment, verify everything works:

### 1. Check PM2 Status

```bash
ssh -i your-key.pem ubuntu@<EC2_IP>
pm2 list
pm2 logs agrolink-frontend --lines 20
pm2 logs agrolink-api --lines 20
```

### 2. Test Endpoints

```bash
# Test frontend (SSR)
curl http://<EC2_IP>:3000

# Test API
curl http://<EC2_IP>:4000/api/products

# Test via ALB
curl http://<ALB_DNS_NAME>
```

### 3. Check S3 Assets

```bash
aws s3 ls s3://<BUCKET_NAME>/assets/
# Should see: prod-cassava.jpg, prod-tomato.jpg, etc.
```

### 4. Access Application

Open in browser:

- Direct: `http://<ALB_DNS_NAME>`
- CloudFront: `https://<CLOUDFRONT_DOMAIN>`

---

## Continuous Deployment Workflow

Once set up, your deployment flow is:

```bash
# 1. Make code changes locally
cd app
# ... edit files ...

# 2. Test locally
npm run dev:all
# Verify changes work

# 3. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin main

# 4. GitHub Actions automatically:
#    - Builds application
#    - Deploys to both EC2 instances
#    - Uploads assets to S3
#    - Restarts services
#    - Invalidates CloudFront

# 5. Verify deployment
# Check GitHub Actions → workflow status
# Test application via ALB/CloudFront URL
```

---

## Need Help?

Common resources:

- **GitHub Actions Logs**: Repository → Actions → Select workflow run
- **PM2 Logs**: SSH to EC2 → `pm2 logs`
- **EC2 Instance**: Check CloudWatch logs or SSH for debugging
- **S3 Bucket**: Verify uploads via AWS Console or CLI

Remember: The infrastructure (EC2, ALB, S3) is already set up. This workflow only deploys your application code!
