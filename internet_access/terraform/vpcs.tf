
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
