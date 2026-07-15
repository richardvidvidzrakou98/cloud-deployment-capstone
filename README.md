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
