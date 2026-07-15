data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

data "aws_iam_policy_document" "assume_ec2" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ec2_s3_read" {
  name               = "${var.project_name}-ec2-s3-read"
  assume_role_policy = data.aws_iam_policy_document.assume_ec2.json
}

# Scoped to only this one bucket - list + read, nothing else.
resource "aws_iam_role_policy" "s3_read" {
  name = "${var.project_name}-ec2-s3-read-policy"
  role = aws_iam_role.ec2_s3_read.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = var.asset_bucket_arn
      },
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = "${var.asset_bucket_arn}/*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_s3_read" {
  name = "${var.project_name}-ec2-s3-read"
  role = aws_iam_role.ec2_s3_read.name
}

resource "aws_instance" "web" {
  count                       = var.instance_count
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.instance_type
  subnet_id                   = element(var.public_subnet_ids, count.index)
  vpc_security_group_ids      = [var.security_group_id]
  associate_public_ip_address = true
  key_name                    = var.key_name != "" ? var.key_name : null
  iam_instance_profile        = aws_iam_instance_profile.ec2_s3_read.name

  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    asset_bucket = var.asset_bucket
    region       = var.region
    asset_base_url = var.asset_base_url

  })

  tags = {
    Name = "${var.project_name}-web-${count.index + 1}"
  }
}