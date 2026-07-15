# End-to-End Cloud Solution Deployment

![AWS](https://img.shields.io/badge/AWS-Cloud%20Computing-FF9900?logo=amazonaws&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-Infrastructure%20as%20Code-7B42BC?logo=terraform&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-Educational-blue)

The **End-to-End Cloud Solution Deployment** project demonstrates the design, deployment, and automation of a secure, scalable, and highly available web application on **Amazon Web Services (AWS)**. It showcases cloud architecture, Infrastructure as Code (IaC), security best practices, and DevOps workflows using Terraform and GitHub.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Objectives](#project-objectives)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Solution Architecture](#solution-architecture)
- [AWS Services Used](#aws-services-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Deployment Steps](#deployment-steps)
- [Security Features](#security-features)
- [CI/CD Pipeline](#cicd-pipeline)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributors](#contributors)
- [License](#license)

---

## Project Overview

This project demonstrates how to design, deploy, and manage a **secure**, **scalable**, and **highly available** cloud-based web application using Amazon Web Services (AWS).

The solution addresses common challenges experienced by growing businesses, including:

- Slow application response times
- Limited scalability during periods of high traffic
- Security vulnerabilities
- Manual deployment processes
- Lack of infrastructure automation

To address these challenges, the project leverages **Terraform** for Infrastructure as Code (IaC), **GitHub** for version control and collaboration, and multiple AWS services to deliver a modern, production-style cloud deployment following cloud security and DevOps best practices.

---

## Project Objectives

The objectives of this project are to:

- Design a secure and scalable cloud architecture
- Deploy a web application using AWS Free Tier services
- Automate infrastructure provisioning with Terraform
- Implement secure Identity and Access Management (IAM)
- Improve application availability using an Application Load Balancer (ALB)
- Deliver content globally using Amazon CloudFront
- Store static assets in Amazon S3
- Apply Infrastructure as Code (IaC) principles
- Enable collaboration through GitHub
- Document the deployment process for future maintenance and scalability

---

## Key Features

- Secure AWS cloud infrastructure
- Infrastructure as Code using Terraform
- High availability through Application Load Balancer
- Global content delivery with Amazon CloudFront
- Secure HTTPS communication using AWS Certificate Manager
- Automated infrastructure deployment
- Version-controlled infrastructure with GitHub
- CI/CD workflow using GitHub Actions

---

## Technologies Used

- Amazon Web Services (AWS)
- Terraform
- HTML5
- CSS3
- JavaScript
- Git
- GitHub
- GitHub Actions

---

## Solution Architecture

The application follows a modern cloud architecture designed to maximize security, availability, and scalability.

```text
                 Users
                    │
                    ▼
          Amazon CloudFront
                    │
                    ▼
     Application Load Balancer
                    │
                    ▼
          Amazon EC2 Web Server
                    │
                    ▼
      Amazon S3 (Static Assets)
```

### Architecture Diagram

The following diagram illustrates the overall solution architecture and the interaction between the AWS services used throughout the project.

![End-to-End Cloud Solution Architecture](docs/architecture.png)

The infrastructure is provisioned using **Terraform** and managed through **GitHub**, enabling repeatable deployments, version control, and collaborative development.

---

## AWS Services Used

| AWS Service | Purpose |
|-------------|---------|
| **Amazon EC2** | Hosts the web application |
| **Amazon S3** | Stores static website assets |
| **Amazon CloudFront** | Provides a global Content Delivery Network (CDN) and HTTPS delivery |
| **Application Load Balancer (ALB)** | Distributes incoming application traffic |
| **AWS Certificate Manager (ACM)** | Manages SSL/TLS certificates |
| **AWS Identity and Access Management (IAM)** | Manages user identities and permissions |
| **Amazon VPC** | Provides network isolation |
| **Security Groups** | Controls inbound and outbound network traffic |
| **Terraform** | Automates infrastructure provisioning using Infrastructure as Code |
| **GitHub Actions** | Automates Continuous Integration and Continuous Deployment (CI/CD) |

---

## Project Structure

```text
aws-end-to-end-cloud-solution/

├── terraform/
│   ├── main.tf
│   ├── provider.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── networking.tf
│   ├── ec2.tf
│   ├── alb.tf
│   ├── cloudfront.tf
│   ├── s3.tf
│   ├── acm.tf
│   ├── iam.tf
│   └── security_groups.tf
│
├── app/
│   ├── index.html
│   ├── about.html
│   ├── dashboard.html
│   ├── contact.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── .github/
│   └── workflows/
│       └── terraform.yml
│
├── docs/
│   ├── architecture.png
│   ├── screenshots/
│   └── diagrams/
│
└── README.md
```

---

## Prerequisites

Before deploying the solution, ensure the following tools and accounts are available:

- AWS Free Tier Account
- AWS CLI
- Terraform
- Git
- Visual Studio Code
- GitHub Account
- IAM User with appropriate permissions

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/richardvidvidzrakou98/cloud-deployment-capstone.git
```

### 2. Navigate to the Project Directory

```bash
cd cloud-deployment-capstone
```

### 3. Configure AWS CLI

```bash
aws configure
```

Provide the following information when prompted:

- AWS Access Key ID
- AWS Secret Access Key
- Default AWS Region
- Default Output Format

### 4. Initialize Terraform

```bash
cd terraform
terraform init
```

### 5. Validate the Configuration

```bash
terraform validate
```

### 6. Review the Execution Plan

```bash
terraform plan
```

### 7. Deploy the Infrastructure

```bash
terraform apply
```

When prompted, type:

```text
yes
```

Terraform will provision all AWS resources defined in the project.

---

## Deployment Steps

1. Configure AWS credentials using the AWS CLI.
2. Initialize the Terraform working directory.
3. Validate the Terraform configuration.
4. Review the infrastructure execution plan.
5. Provision the AWS infrastructure.
6. Verify all deployed resources.
7. Upload the web application to the deployed environment.
8. Configure Amazon CloudFront for global content delivery.
9. Configure HTTPS using AWS Certificate Manager.
10. Validate application functionality and accessibility.

---

## Security Features

The solution incorporates several cloud security best practices, including:

- Principle of Least Privilege (IAM)
- HTTPS encryption using AWS Certificate Manager
- Secure Security Group configurations
- Amazon VPC network isolation
- Infrastructure as Code (Terraform)
- Version-controlled infrastructure
- Secure deployment workflow using GitHub

---

## CI/CD Pipeline

The project includes a GitHub Actions workflow that supports infrastructure automation and deployment.

Workflow file:

```text
.github/workflows/terraform.yml
```

The workflow can be extended to support:

- Terraform formatting
- Terraform validation
- Infrastructure planning
- Automated deployment
- Infrastructure testing

---

## Screenshots

Deployment screenshots will be added upon successful completion of the project.

The documentation will include:

- AWS Management Console
- Amazon EC2 Instance
- Amazon S3 Bucket
- Application Load Balancer
- Amazon CloudFront Distribution
- Terraform Deployment Output
- Running Web Application

---

## Future Improvements

Future enhancements may include:

- Auto Scaling Groups
- Amazon Route 53 custom domain integration
- AWS Web Application Firewall (WAF)
- Amazon CloudWatch monitoring and alerting
- Automated backup and disaster recovery
- Blue/Green deployment strategy
- Multi-Region deployment
- Cost monitoring with AWS Budgets

---

## Contributors

- Richard Vidzrakou
- Freda Kemphrey
- Hassanatu
- Humaidu
- Frank Amoako Boafo
- Joel

---

## License

This project was developed as part of the **AWS End-to-End Cloud Solution Deployment Capstone Project** for educational purposes.

---

<div align="center">

**Built with AWS, Terraform, GitHub, and DevOps best practices.**

</div>


