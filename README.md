# AgroLink Ghana - Cloud Deployment Capstone

A modern e-commerce platform for agricultural products in Ghana, deployed using AWS infrastructure with Terraform.

## Project Overview

AgroLink Ghana is a React-based e-commerce application built with TanStack Start, TypeScript, and Vite. The application is deployed on AWS using a robust cloud infrastructure managed through Infrastructure as Code (Terraform).

## Project Structure

```
cloud-deployment-capstone/

├── terraform/
│   ├── main.tf                 # Main Terraform configuration
│   ├── provider.tf             # AWS provider configuration
│   ├── variables.tf            # Variable definitions
│   ├── outputs.tf              # Output values
│   ├── terraform.tfvars        # Variable values
│   ├── networking.tf           # VPC, subnets, and networking resources
│   ├── ec2.tf                  # EC2 instances configuration
│   ├── alb.tf                  # Application Load Balancer
│   ├── cloudfront.tf           # CloudFront distribution
│   ├── s3.tf                   # S3 buckets
│   ├── acm.tf                  # SSL/TLS certificates
│   ├── iam.tf                  # IAM roles and policies
│   └── security_groups.tf      # Security group rules
│
├── app/                        # AgroLink Ghana application
│   ├── src/
│   │   ├── routes/            # Application routes
│   │   │   ├── index.tsx      # Home page
│   │   │   ├── products.tsx   # Products listing
│   │   │   ├── cart.tsx       # Shopping cart
│   │   │   ├── checkout.tsx   # Checkout process
│   │   │   ├── about.tsx      # About page
│   │   │   └── contact.tsx    # Contact page
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility libraries
│   │   └── assets/            # Static assets
│   ├── public/                # Public assets
│   ├── package.json           # Dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── tsconfig.json          # TypeScript configuration
│
├── docs/
│   ├── diagrams/              # Architecture diagrams
│   └── screenshots/           # Application screenshots
│
└── README.md
```

## Technology Stack

### Frontend Application

- **Framework**: React with TanStack Start
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query
- **Routing**: TanStack Router

### AWS Infrastructure

- **Compute**: EC2 instances
- **Load Balancing**: Application Load Balancer (ALB)
- **CDN**: CloudFront
- **Storage**: S3
- **Networking**: VPC with public/private subnets
- **Security**: SSL/TLS certificates via ACM, Security Groups
- **IAM**: Role-based access control

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager
- AWS CLI configured with appropriate credentials
- Terraform (v1.0 or higher)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cloud-deployment-capstone
   ```

2. **Install application dependencies**

   ```bash
   cd app
   npm install
   # or if using bun
   bun install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   bun run build
   ```

### Infrastructure Deployment

1. **Navigate to the terraform directory**

   ```bash
   cd terraform
   ```

2. **Initialize Terraform**

   ```bash
   terraform init
   ```

3. **Review and update `terraform.tfvars`**
   - Configure your AWS region
   - Set domain names if applicable
   - Adjust instance types and sizing

4. **Plan the deployment**

   ```bash
   terraform plan
   ```

5. **Apply the infrastructure**

   ```bash
   terraform apply
   ```

6. **Note the outputs**
   - Application Load Balancer DNS
   - CloudFront distribution domain
   - S3 bucket names

## Application Features

- **Product Catalog**: Browse agricultural products
- **Shopping Cart**: Add products and manage quantities
- **Checkout**: Complete purchase process
- **Product Details**: View detailed information about products
- **About & Contact**: Learn more about AgroLink Ghana

## AWS Architecture

The application is deployed using a multi-tier architecture:

1. **CloudFront**: CDN for global content delivery
2. **Application Load Balancer**: Distributes traffic across EC2 instances
3. **EC2 Instances**: Host the React application
4. **S3**: Storage for static assets
5. **VPC**: Isolated network environment with public and private subnets

## AWS Architecture

The application is deployed using a secure, scalable AWS architecture:

- Amazon CloudFront – Global CDN for caching and fast content delivery.
- Application Load Balancer (ALB) – Distributes incoming traffic across EC2 instances.
- Amazon EC2 – Hosts the AgroLink Ghana React application.
- Amazon S3 – Stores static assets.
- AWS Certificate Manager (ACM) – Provides SSL/TLS certificates.
- Security Groups – Control inbound and outbound traffic.
- IAM – Manages secure access to AWS resources.
- VPC – Provides network isolation with public and private subnets.

## CloudFront Configuration

The application uses Amazon CloudFront as a Content Delivery Network (CDN) to improve performance, reduce latency, and provide secure access to the application.

### Features

- Global content delivery through CloudFront edge locations.
- Improved application performance by caching static content.
- CloudFront serves as the public entry point for user requests.
- Requests are forwarded to the Application Load Balancer (ALB) origin.

### Benefits

- Faster page load times.
- Reduced load on backend EC2 instances.
- Improved availability and scalability.

## Security Configuration

The AWS infrastructure follows security best practices to protect application resources.

### Security Groups

- Only required inbound traffic is allowed.
- HTTP (80) traffic is redirected to HTTPS.
- HTTPS (443) traffic is allowed for secure communication.
- EC2 instances receive traffic only from the Application Load Balancer.

### IAM

- IAM roles and policies provide least-privilege access to AWS resources.
- Permissions are assigned based on operational requirements.

### Network Security

- Resources are deployed inside a Virtual Private Cloud (VPC).
- Public and private subnets separate internet-facing and internal resources.

## HTTPS Configuration

Secure communication is enabled using AWS Certificate Manager (ACM).

### SSL/TLS

- SSL/TLS certificates are managed through AWS Certificate Manager (ACM).
- CloudFront and the Application Load Balancer use HTTPS for encrypted communication.

### Benefits

- Encrypts data transmitted between users and the application.
- Protects sensitive information during checkout and user interactions.
- Improves user trust and follows AWS security best practices.


## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is part of a cloud deployment capstone project.

## About AgroLink Ghana

AgroLink Ghana is an e-commerce platform designed to connect farmers and agricultural suppliers with customers across Ghana, making quality agricultural products accessible to everyone.
