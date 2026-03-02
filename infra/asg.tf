data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

resource "aws_launch_template" "api_lt" {
  name_prefix   = "${var.domain_name}-api-lt-"
  image_id      = data.aws_ami.amazon_linux_2023.id
  instance_type = "t2.micro"
  key_name      = "ccm"

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_profile.name
  }

  vpc_security_group_ids = [aws_security_group.api_sg.id]

  user_data = filebase64("${path.module}/user_data.sh")

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.domain_name}-api"
    }
  }
}

resource "aws_autoscaling_group" "api_asg" {
  name                = "${var.domain_name}-asg"
  vpc_zone_identifier = data.aws_subnets.default.ids
  target_group_arns   = [aws_lb_target_group.api_tg.arn]

  min_size         = 1
  max_size         = 1
  desired_capacity = 1

  launch_template {
    id      = aws_launch_template.api_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.domain_name}-api"
    propagate_at_launch = true
  }

  # Set to 0 to disable waiting for capacity, ALB health checks will manage instance readiness
  wait_for_capacity_timeout = "0"
}
