# EC2 instance configuration
# AMI Data Source
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Launch Template
resource "aws_launch_template" "app" {
  name_prefix   = "${var.project_name}-lt-"
  image_id      = var.ami_id != "" ? var.ami_id : data.aws_ami.amazon_linux_2.id
  instance_type = var.instance_type
  key_name      = var.key_name

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.app.id]
    subnet_id                   = aws_subnet.private[0].id
  }

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    project_name = var.project_name
    git_repo_url = var.git_repo_url
    git_branch   = var.git_branch
    bucket_name  = var.static_bucket_name
  }))

  iam_instance_profile {
    name = aws_iam_instance_profile.app.name
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.project_name}-ec2"
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Individual EC2 Instances
resource "aws_instance" "app" {
  count         = var.instance_count
  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }
  subnet_id                   = aws_subnet.private[count.index % length(aws_subnet.private)].id
  iam_instance_profile        = aws_iam_instance_profile.app.name
  vpc_security_group_ids      = [aws_security_group.app.id]
  associate_public_ip_address = false
  tags = {
    Name = "${var.project_name}-ec2-${count.index + 1}"
  }
}

# Attach instances to target groups
resource "aws_lb_target_group_attachment" "frontend" {
  count            = var.instance_count
  target_group_arn = aws_lb_target_group.frontend.arn
  target_id        = aws_instance.app[count.index].id
  port             = 3000
}

resource "aws_lb_target_group_attachment" "api" {
  count            = var.instance_count
  target_group_arn = aws_lb_target_group.api.arn
  target_id        = aws_instance.app[count.index].id
  port             = 4000
}