terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>5.16.0"
    }
  }
}

variable "region" {
  type = string
}

provider "aws" {
  region  = var.region
  profile = "cdk"
}


# Generate new private key
resource "tls_private_key" "my_key" {
  algorithm = "RSA"
}
# Generate a key-pair with above key
resource "aws_key_pair" "deployer" {
  key_name   = "efs-key"
  public_key = tls_private_key.my_key.public_key_openssh
}
# Saving Key Pair for ssh login for Client if needed
resource "local_file" "mykey_pem" {
  content  = tls_private_key.my_key.private_key_openssh
  filename = "${path.module}/mykey.pem"
}
