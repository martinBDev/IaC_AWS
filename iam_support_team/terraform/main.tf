terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>5.16.0"
    }
  }
}

variable "region"{
    type = string
    default = "eu-west-1"
}

provider "aws" {
    region = var.region
    profile = "cdk"
}


resource "aws_iam_group" "SupportEngineers" {
    name = "SupportEngineers"
}

resource "aws_iam_group_policy" "SupportEngineersEC2Policy"{
    name = "SupportEngineersEC2Policy"
    group = aws_iam_group.SupportEngineers.name
    policy = file("./EC2Policy.json")
}

resource "aws_iam_group_policy" "SupportEngineersRDSPolicy"{
    name = "SupportEngineersRDSPolicy"
    group = aws_iam_group.SupportEngineers.name
    policy = file("./RDSPolicy.json")
}