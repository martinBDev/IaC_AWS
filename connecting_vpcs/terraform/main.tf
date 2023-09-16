terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.16.0"
    }
  }
}

provider "aws" {
    profile = "cdk"
  region = "eu-west-1"
}

//Get current account ID
data "aws_caller_identity" "current" {}


//get latest amazon linux ami

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners = ["amazon"]
  filter {
    name = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

//CREATE THE THREE SERVERS FOR EACH VPC
resource "aws_instance" "marketing_server" {
  ami           = data.aws_ami.amazon_linux.id
  subnet_id = aws_subnet.marketing_subnet.id
  instance_type = "t2.micro"
  tags = {
    Name = "MarketingServer"
  }
}

resource "aws_instance" "developer_server" {
  ami           = data.aws_ami.amazon_linux.id
  subnet_id = aws_subnet.developer_subnet.id
  instance_type = "t2.micro"
  tags = {
    Name = "DeveloperServer"
  }
}

resource "aws_instance" "financial_server" {
  ami           = data.aws_ami.amazon_linux.id
  subnet_id = aws_subnet.financial_subnet.id
  instance_type = "t2.micro"
  tags = {
    Name = "FinancialServer"
  }
}