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
  profile="cdk"
  region=var.region
}

variable "files" {
  description = "List of files to upload to S3"
  type        = list(object({
    location   = string
    to_locate  = string
    name       = string
    content_type = string
  }))
}


resource "aws_s3_bucket" "website_bucket" {
  bucket = "terraform-martinbdev-s3-web"


  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_acl" "bucket_acl" {
    bucket = aws_s3_bucket.website_bucket.id
    acl    = "public-read"
    depends_on = [aws_s3_bucket_ownership_controls.s3_bucket_acl_ownership]
}

resource "aws_s3_bucket_ownership_controls" "s3_bucket_acl_ownership" {
  bucket = aws_s3_bucket.website_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
  depends_on = [aws_s3_bucket_public_access_block.public_access]
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.website_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.website_bucket.id
  policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Sid" : "PublicReadGetObject",
          "Effect" : "Allow",
          "Principal" : "*",
          "Action" : "s3:GetObject",
          "Resource" : [
            "arn:aws:s3:::${aws_s3_bucket.website_bucket.id}/*"
          ]
        }
      ]
    }
  )
  depends_on = [ aws_s3_bucket.website_bucket ]
}

resource "aws_s3_bucket_website_configuration" "hosting" {
  bucket = aws_s3_bucket.website_bucket.id
  index_document {
    suffix = "index.html"
  }
  
}

resource "aws_s3_object" "objects" {
  for_each = { for f in var.files : f.to_locate => f }

  bucket = aws_s3_bucket.website_bucket.id
  key    = each.key
  source = each.value.location
  content_type = each.value.content_type
}


output "s3_url" {
  description = "S3 hosting URL (HTTP)"
  value       = aws_s3_bucket_website_configuration.hosting.website_endpoint
}

