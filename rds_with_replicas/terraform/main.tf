terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.16.0"
    }
  }
}

variable "region" {
  default = "eu-west-1"
}
  


provider "aws" {
    region = var.region
    profile = "cdk"
}
# Create a VPC
resource "aws_vpc" "myvpc" {
  cidr_block = "10.10.0.0/16"
  tags = {
    Name = "myvpc"
  }
}

#Create public subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.myvpc.id
  cidr_block              = "10.10.0.0/24"
  map_public_ip_on_launch = true
  tags = {
    Name = "public_subnet"
  }
}

#Create private subnet
resource "aws_subnet" "private_subnet" {
  vpc_id                  = aws_vpc.myvpc.id
  cidr_block              = "10.10.2.0/24"
  map_public_ip_on_launch = false
  tags = {
    Name = "private_subnet"
  }
}


resource "aws_db_subnet_group" "rds-subnet-group" {
  name       = "rds-subnet-group"
  subnet_ids = [
    aws_subnet.public_subnet.id,
    aws_subnet.private_subnet.id
  ]

  tags = {
    Name = "rds-subnet-group"
  }
}


resource "aws_db_instance" "rds-instance" {
    allocated_storage = 20
    db_subnet_group_name = aws_db_subnet_group.rds-subnet-group.name
    db_name = "rds-instance"
    engine = "mysql"
    engine_version = "8.0"
    auto_minor_version_upgrade = true
    instance_class = "db.t2.micro"
    username = "admin"
    password = "admin"
    skip_final_snapshot = true
    multi_az = true
    backup_retention_period = 7
    backup_window = "04:00-06:00"
    storage_encrypted = true
}

resource "aws_db_instance" "rds-read-replica"{
    replicate_source_db = aws_db_instance.rds-instance.id
    instance_class = "db.t2.micro"
}
