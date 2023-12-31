terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.16.0"
    }
  }
}

variable "region" {
    type=string
}

provider "aws" {
  region = var.region
  profile = "cdk"
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners = ["amazon"]
  filter {
    name = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

variable "azs" {
  type = list(string)
}

resource "aws_instance" "ec2_instance_a" {
  ami = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"
  availability_zone = "${var.region}a"
  tags = {
    Name = "ec2_instance"
  }
}

resource "aws_instance" "ec2_instance_b" {
  ami = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"
  availability_zone = "${var.region}b"
  tags = {
    Name = "ec2_instance"
  }
}

