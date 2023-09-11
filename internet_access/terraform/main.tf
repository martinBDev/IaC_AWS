terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.16.0"
    }
  }
}

variable "region" {
  type    = string
  default = "eu-west-1"
}

provider "aws" {
  profile = "cdk"
  region  = var.region
}



data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

//Created with ssh-keygen (no passphrase), the public key is used to connect to the instance
resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = file("C:/Users/usuario/.ssh/terraform.pub")
}

//cloud-init file to provision the instance with httpd service
data "template_file" "user_data" {
  template = file("./web_server_setup.yaml")
}

data "template_file" "db_setup" {
  template = file("./db_setup.yaml")
}



