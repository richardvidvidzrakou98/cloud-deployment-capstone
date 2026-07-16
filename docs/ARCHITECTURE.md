# AgroLink Ghana — Cloud Deployment Architecture Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Infrastructure Components](#3-infrastructure-components)
4. [Networking & VPC](#4-networking--vpc)
5. [EC2 Instances & Application Setup](#5-ec2-instances--application-setup)
6. [Target Groups](#6-target-groups)
7. [Application Load Balancer (ALB)](#7-application-load-balancer-alb)
8. [ALB Listener Rules & HTTP → HTTPS Redirect](#8-alb-listener-rules--http--https-redirect)
9. [Security Groups & Open Ports](#9-security-groups--open-ports)
10. [SSL/TLS Certificate (ACM)](#10-ssltls-certificate-acm)
11. [S3 Static Assets](#11-s3-static-assets)
12. [CloudFront — Known Issue](#12-cloudfront--known-issue)
13. [CI/CD Pipeline](#13-cicd-pipeline)
14. [ALB Health Checks](#14-alb-health-checks)
15. [Full HTTPS Flow](#15-full-https-flow)
16. [Deployment Checklist](#16-deployment-checklist)

---

## 1. Project Overview

**AgroLink Ghana** (deployed as **Akuafo Market**) is a React-based e-commerce platform for agricultural products in Ghana. It is deployed on AWS using a multi-tier architecture with two separate Node.js processes per EC2 instance — a TanStack Start SSR frontend and an Express.js API backend — managed by PM2 and exposed through an Application Load Balancer.

| Item | Value |
|------|-------|
| Domain | `akuafomarket.vidzrakou.com` |
| DNS Provider | Hostinger |
| AWS Region | `us-east-1` |
| ALB Name | `hypervisor-webapp-alb` |
| S3 Bucket | `azubi-hypervisor-static-bucket` |

---

## 2. Architecture Diagram

```
                        ┌─────────────────────────────┐
                        │         User Browser         │
                        └──────────────┬──────────────┘
                                       │ HTTPS (443)
                                       │ akuafomarket.vidzrakou.com
                                       ▼
                        ┌─────────────────────────────┐
                        │     Hostinger DNS (CNAME)    │
                        │  akuafomarket → ALB DNS      │
                        └──────────────┬──────────────┘
                                       │
                                       ▼
                        ┌─────────────────────────────┐
                        │   hypervisor-webapp-alb      │
                        │   Application Load Balancer  │
                        │                             │
                        │  Listener HTTP:80            │
                        │  └─► Redirect to HTTPS:443  │
                        │                             │
                        │  Listener HTTPS:443          │
                        │  ├─► /api/* → api-tg:4000   │
                        │  └─► /*    → webapp-tg:3000 │
                        └──────┬──────────────┬───────┘
                               │              │
               ┌───────────────┘              └───────────────┐
               ▼                                              ▼
  ┌────────────────────────┐                ┌────────────────────────┐
  │     EC2 Instance 1     │                │     EC2 Instance 2     │
  │   ip-10-0-1-63         │                │   ip-10-0-x-xx         │
  │                        │                │                        │
  │  PM2                   │                │  PM2                   │
  │  ├─ agrolink-frontend  │                │  ├─ agrolink-frontend  │
  │  │  port 3000 (SSR)    │                │  │  port 3000 (SSR)    │
  │  └─ agrolink-api       │                │  └─ agrolink-api       │
  │     port 4000 (API)    │                │     port 4000 (API)    │
  └────────────────────────┘                └────────────────────────┘

                        ┌─────────────────────────────┐
                        │   S3: azubi-hypervisor-      │
                        │   static-bucket              │
                        │   /assets/*.jpg              │
                        │   (product images)           │
                        └─────────────────────────────┘
                               ▲
                               │ Direct browser fetch
                               │ (full S3 URL in API response)
```

---

## 3. Infrastructure Components

| Component | Name / Value | Purpose |
|-----------|-------------|---------|
| EC2 Instance 1 | `ip-10-0-1-63` | Runs frontend + API |
| EC2 Instance 2 | `ip-10-0-x-xx` | Runs frontend + API (HA) |
| ALB | `hypervisor-webapp-alb` | Distributes traffic |
| Target Group (Frontend) | `hypervisor-tg` | Routes `/*` to port 3000 |
| Target Group (API) | `hypervisor-api-tg` | Routes `/api/*` to port 4000 |
| S3 Bucket | `azubi-hypervisor-static-bucket` | Stores product images |
| ACM Certificate | `akuafomarket.vidzrakou.com` | HTTPS/TLS termination |
| DNS | Hostinger CNAME | Points domain to ALB |

---

## 4. Networking & VPC

- **VPC**: `vpc-01e4f009507c2bc3f`
- EC2 instances are deployed in **private subnets** — they are not directly accessible from the internet
- The ALB is deployed in **public subnets** — it is the only internet-facing entry point
- All traffic from the internet must pass through the ALB before reaching EC2

```
Internet
   │
   ▼
Public Subnets (ALB)
   │
   ▼
Private Subnets (EC2 instances)
```

---

## 5. EC2 Instances & Application Setup

Each EC2 instance runs **Amazon Linux 2** with the following setup:

### Software Installed
- Node.js v22.x
- PM2 (global process manager)

### Application Directory
```
~/agrolink/
├── .output/
│   └── server/
│       └── index.mjs       # TanStack Start SSR server (frontend)
├── api/
│   ├── server.js           # Express.js API server
│   ├── data/
│   │   └── products.json   # Product data (image URLs point to S3)
│   └── routes/
├── ecosystem.config.cjs    # PM2 process configuration
└── logs/
    ├── frontend-out.log
    ├── frontend-error.log
    ├── api-out.log
    └── api-error.log
```

### PM2 Processes

| PM2 Name | Script | Port | Mode |
|----------|--------|------|------|
| `agrolink-frontend` | `.output/server/index.mjs` | 3000 | fork |
| `agrolink-api` | `api/server.js` | 4000 | cluster |

PM2 is configured to auto-restart on crash and start on system reboot via `pm2 startup` + `pm2 save`.

### Useful PM2 Commands
```bash
pm2 list                          # View all processes
pm2 logs agrolink-frontend        # Frontend logs
pm2 logs agrolink-api             # API logs
pm2 restart agrolink-frontend     # Restart frontend
pm2 restart agrolink-api          # Restart API
```

---

## 6. Target Groups

### hypervisor-tg (Frontend)

| Setting | Value |
|---------|-------|
| Target Type | Instance |
| Protocol:Port | HTTP:3000 |
| Health Check Path | `/` |
| Health Check Port | Traffic port (3000) |
| Healthy Threshold | 5 consecutive successes |
| Unhealthy Threshold | 2 consecutive failures |
| Interval | 30 seconds |
| Success Codes | 200 |

### hypervisor-api-tg (API)

| Setting | Value |
|---------|-------|
| Target Type | Instance |
| Protocol:Port | HTTP:4000 |
| Health Check Path | `/health` |
| Health Check Port | Traffic port (4000) |
| Healthy Threshold | 5 consecutive successes |
| Unhealthy Threshold | 2 consecutive failures |
| Interval | 30 seconds |
| Success Codes | 200 |

Both target groups have **both EC2 instances registered** to ensure high availability.

---

## 7. Application Load Balancer (ALB)

| Setting | Value |
|---------|-------|
| Name | `hypervisor-webapp-alb` |
| Scheme | Internet-facing |
| IP Address Type | IPv4 |
| VPC | `vpc-01e4f009507c2bc3f` |
| Subnets | Public subnets (multi-AZ) |
| Security Group | ALB security group |

The ALB is the single entry point for all web traffic. It terminates HTTPS, inspects the request path, and routes to the appropriate target group.

---

## 8. ALB Listener Rules & HTTP → HTTPS Redirect

### HTTP:80 Listener — Redirect to HTTPS

| Setting | Value |
|---------|-------|
| Action | Redirect |
| Redirect to | HTTPS:443 |
| Status Code | 301 (Permanent) |

Any request to `http://akuafomarket.vidzrakou.com` is permanently redirected to `https://akuafomarket.vidzrakou.com`.

### HTTPS:443 Listener — Path-Based Routing

Rules are evaluated in priority order:

| Priority | Condition | Action | Target Group |
|----------|-----------|--------|--------------|
| 1 | Path is `/api/*` | Forward | `hypervisor-api-tg` (port 4000) |
| Default | All other requests `/*` | Forward | `hypervisor-tg` (port 3000) |

This means:
- `https://akuafomarket.vidzrakou.com/` → EC2 port 3000 (React SSR frontend)
- `https://akuafomarket.vidzrakou.com/api/products` → EC2 port 4000 (Express API)

---

## 9. Security Groups & Open Ports

### ALB Security Group

| Direction | Type | Protocol | Port | Source | Purpose |
|-----------|------|----------|------|--------|---------|
| Inbound | HTTP | TCP | 80 | 0.0.0.0/0 | Accept HTTP from internet |
| Inbound | HTTPS | TCP | 443 | 0.0.0.0/0 | Accept HTTPS from internet |
| Outbound | Custom TCP | TCP | 3000 | EC2 Security Group | Forward to frontend |
| Outbound | Custom TCP | TCP | 4000 | EC2 Security Group | Forward to API |

### EC2 Security Group

| Direction | Type | Protocol | Port | Source | Purpose |
|-----------|------|----------|------|--------|---------|
| Inbound | SSH | TCP | 22 | Your IP / GitHub Actions | Deployment access |
| Inbound | Custom TCP | TCP | 3000 | ALB Security Group | Frontend traffic from ALB only |
| Inbound | Custom TCP | TCP | 4000 | ALB Security Group | API traffic from ALB only |
| Outbound | All traffic | All | All | 0.0.0.0/0 | Outbound internet access |

> **Important:** EC2 ports 3000 and 4000 are restricted to the ALB security group only. They are not directly accessible from the internet. All traffic must pass through the ALB.

---

## 10. SSL/TLS Certificate (ACM)

| Setting | Value |
|---------|-------|
| Domain | `akuafomarket.vidzrakou.com` |
| Issuer | AWS Certificate Manager (ACM) |
| Validation Method | DNS validation |
| Status | Issued |
| Attached To | ALB HTTPS:443 listener |

### DNS Validation Record (added in Hostinger)
A CNAME record was added to the Hostinger DNS zone for `vidzrakou.com` as required by ACM to prove domain ownership.

### Domain Pointing (Hostinger DNS)

| Type | Name | Value |
|------|------|-------|
| CNAME | `akuafomarket` | `hypervisor-webapp-alb-1557917068.us-east-1.elb.amazonaws.com` |

---

## 11. S3 Static Assets

| Setting | Value |
|---------|-------|
| Bucket Name | `azubi-hypervisor-static-bucket` |
| Region | `us-east-1` |
| Assets Path | `assets/` |

Product images are stored in S3 and served directly to the browser. The API returns full S3 URLs in the product data:

```json
{
  "image": "https://azubi-hypervisor-static-bucket.s3.amazonaws.com/assets/prod-cassava.jpg"
}
```

The browser fetches images directly from S3 — this offloads static asset delivery from EC2 and the ALB entirely.

### Assets Stored
```
assets/
├── prod-cassava.jpg
├── prod-tomato.jpg
├── prod-maize.jpg
├── prod-plantain.jpg
├── prod-yam.jpg
├── prod-pepper.jpg
├── prod-cocoa.jpg
└── prod-okra.jpg
```

---

## 12. CloudFront — Known Issue

CloudFront was planned as a CDN layer in front of the ALB and S3 to provide:
- Global edge caching for faster content delivery
- HTTPS termination at the edge
- Protection by restricting EC2 to only accept traffic from CloudFront IP ranges (using AWS-managed prefix list `com.amazonaws.global.cloudfront.origin-facing`)

### Intended Architecture (with CloudFront)
```
Browser → CloudFront → ALB → EC2
Browser → CloudFront → S3 (static assets)
```

### Current Status
CloudFront configuration was **not completed** due to an AWS account-level restriction encountered during setup. The application is currently deployed without CloudFront.

### Impact
- The application is fully functional via the ALB directly
- Images are served from S3 without CDN caching
- EC2 security groups currently accept traffic from the ALB security group rather than CloudFront prefix lists

### Recommended Future Action
Once the AWS account issue is resolved, the following steps should be completed:

1. Create a CloudFront distribution with:
   - Origin: ALB DNS name (for dynamic content)
   - Origin: S3 bucket (for static assets)
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Cache policy: CachingOptimized for `/assets/*`, CachingDisabled for `/api/*`

2. Update EC2 security group inbound rules:
   - Replace ALB source with AWS-managed prefix list for CloudFront
   - This ensures EC2 only accepts traffic that passed through CloudFront

3. Update DNS CNAME in Hostinger to point to the CloudFront domain instead of the ALB

---

## 13. CI/CD Pipeline

The deployment is automated via GitHub Actions (`.github/workflows/app-deploy.yml`).

### Trigger
- Push to `main` branch with changes in `app/` directory
- Manual trigger via GitHub Actions UI

### Pipeline Steps

```
1. Checkout code
2. Setup Node.js 22
3. Install dependencies (npm ci)
4. Build application (npm run build → generates .output/server/index.mjs)
5. Upload static assets to S3 (app/public/assets → s3://azubi-hypervisor-static-bucket/assets)
6. Create deployment package (.output/ + api/ + ecosystem.config.cjs → agrolink-app.tar.gz)
7. SCP tarball to EC2 Instance 1
8. SCP tarball to EC2 Instance 2
9. SSH EC2 Instance 1 → extract → npm ci (API deps) → pm2 restart
10. SSH EC2 Instance 2 → extract → npm ci (API deps) → pm2 restart
11. Invalidate CloudFront cache (skipped — CloudFront not configured)
```

### GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM access key for S3 uploads |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `AWS_REGION` | `us-east-1` |
| `AWS_S3_BUCKET` | `azubi-hypervisor-static-bucket` |
| `EC2_HOST_1` | Public IP of EC2 Instance 1 |
| `EC2_HOST_2` | Public IP of EC2 Instance 2 |
| `EC2_USER` | `ec2-user` |
| `EC2_SSH_KEY` | Private key (.pem) for SSH access |
| `VITE_API_URL` | `https://akuafomarket.vidzrakou.com` |
| `CLOUDFRONT_DISTRIBUTION_ID` | Not active (CloudFront pending) |

---

## 14. ALB Health Checks

Health checks confirm EC2 instances are healthy before the ALB routes traffic to them.

### Verifying Health Check Status

**AWS Console:**
EC2 → Target Groups → select target group → **Targets tab**

Both instances should show **Healthy** status.

**From EC2 via curl:**
```bash
# Frontend health check
curl -I http://localhost:3000
# Expected: HTTP/1.1 200 OK

# API health check
curl http://localhost:4000/health
# Expected: {"status":"ok","timestamp":"..."}

# Test via ALB
curl -I https://akuafomarket.vidzrakou.com
# Expected: HTTP/1.1 200 OK

curl https://akuafomarket.vidzrakou.com/api/products
# Expected: {"success":true,"count":8,"data":[...]}
```

### Health Check Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Instances Unhealthy | App not running on correct port | `pm2 list` — check status |
| 504 Gateway Timeout | Security group blocking ALB → EC2 | Add inbound rule for port from ALB SG |
| 502 Bad Gateway | App crashed or wrong port | `pm2 logs` — check errors |
| Connection Refused | App not started | `pm2 start ecosystem.config.cjs` |

---

## 15. Full HTTPS Flow

### Current Flow (without CloudFront)

```
1. User visits https://akuafomarket.vidzrakou.com

2. Hostinger DNS resolves CNAME:
   akuafomarket.vidzrakou.com
   → hypervisor-webapp-alb-1557917068.us-east-1.elb.amazonaws.com

3. ALB receives HTTPS:443 request
   - TLS terminated at ALB using ACM certificate
   - Request decrypted

4. ALB evaluates listener rules:
   - Path /api/* → forward to hypervisor-api-tg → EC2:4000
   - Path /*     → forward to hypervisor-tg     → EC2:3000

5. EC2 processes request:
   - Port 3000: TanStack Start SSR renders React page → returns HTML
   - Port 4000: Express API queries products.json → returns JSON

6. Browser receives HTML, renders page, makes API calls to /api/products

7. Browser fetches product images directly from S3:
   https://azubi-hypervisor-static-bucket.s3.amazonaws.com/assets/prod-*.jpg
```

### Intended Flow (with CloudFront — pending)

```
1. User visits https://akuafomarket.vidzrakou.com
2. DNS resolves to CloudFront distribution
3. CloudFront checks edge cache:
   - Cache HIT  → return cached response immediately
   - Cache MISS → forward to ALB origin
4. ALB routes to EC2 (same as above)
5. Static assets (/assets/*) served from CloudFront → S3 origin
```

---

## 16. Deployment Checklist

### Infrastructure
- [x] VPC with public and private subnets
- [x] 2 EC2 instances running Amazon Linux 2
- [x] Node.js 22 installed on both instances
- [x] PM2 installed and configured on both instances
- [x] S3 bucket created with product images uploaded
- [x] ACM certificate issued for `akuafomarket.vidzrakou.com`
- [x] ALB created (internet-facing, multi-AZ)
- [x] Target group `hypervisor-tg` (port 3000) — both instances healthy
- [x] Target group `hypervisor-api-tg` (port 4000) — both instances healthy
- [x] ALB HTTP:80 listener → redirect to HTTPS:443
- [x] ALB HTTPS:443 listener → path-based routing rules configured
- [x] Security groups configured (EC2 ports 3000/4000 restricted to ALB SG)
- [x] Hostinger CNAME pointing to ALB
- [ ] CloudFront distribution (pending — account issue)
- [ ] EC2 security groups restricted to CloudFront prefix list (pending)

### Application
- [x] Frontend builds successfully (`npm run build` → `.output/server/index.mjs`)
- [x] PM2 running `agrolink-frontend` on port 3000
- [x] PM2 running `agrolink-api` on port 4000
- [x] Product images served from S3
- [x] API returning product data via `https://akuafomarket.vidzrakou.com/api/products`
- [x] Frontend accessible via `https://akuafomarket.vidzrakou.com`

### CI/CD
- [x] GitHub Actions workflow configured
- [x] All GitHub secrets set
- [x] Workflow builds and deploys to both EC2 instances on push to `main`
- [x] Static assets uploaded to S3 on each deployment
