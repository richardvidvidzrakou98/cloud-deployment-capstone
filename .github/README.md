# GitHub Actions Workflows

## Overview

This directory contains the CI/CD workflow for deploying the AgroLink Ghana application to your existing AWS infrastructure.

## Workflows

### 📦 Application Deployment (`app-deploy.yml`)

**Purpose:** Automates deployment of the React SSR application and Express.js API to EC2 instances.

**Triggers:**

- Push to `main` branch with changes in `app/` folder
- Manual workflow dispatch

**What it does:**

1. Builds the TanStack Start application
2. Uploads static assets to S3
3. Deploys to both EC2 instances
4. Restarts PM2 processes
5. Optionally invalidates CloudFront cache

**Setup Required:** See [CI-CD-SETUP.md](CI-CD-SETUP.md) for complete configuration instructions.

## Quick Start

1. **Configure GitHub Secrets** (11 required)
   - Go to: Repository → Settings → Secrets → Actions
   - See [CI-CD-SETUP.md](CI-CD-SETUP.md) for the full list

2. **Prepare EC2 Instances** (one-time)

   ```bash
   sudo apt update && sudo apt install -y nodejs npm
   sudo npm install -g pm2
   pm2 startup
   mkdir -p ~/agrolink/logs
   ```

3. **Test Deployment**
   - Go to: Actions → Application Deployment → Run workflow
   - Or push changes to `app/` folder on main branch

## Infrastructure Note

The AWS infrastructure (EC2, ALB, S3, CloudFront) is already provisioned and managed separately. These workflows **only deploy the application code** to the existing infrastructure.

## Documentation

- [CI-CD-SETUP.md](CI-CD-SETUP.md) - Complete setup guide
- [app-deploy.yml](workflows/app-deploy.yml) - Application deployment workflow
