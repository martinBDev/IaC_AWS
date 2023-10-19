resource "aws_vpc" "myvpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "MyVPC"
  }
}

resource "aws_internet_gateway" "my-igw" {
  vpc_id = "${aws_vpc.myvpc.id}"
  tags = {
    Name = "MyIGW"
  }
}

resource "aws_route_table" "my-rt"{
  vpc_id = "${aws_vpc.myvpc.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my-igw.id
  }

  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
  }
}

resource "aws_subnet" "subnet1" {
  vpc_id            = aws_vpc.myvpc.id
  availability_zone = "${var.region}a"
  cidr_block        = "10.0.0.0/24"
}

resource "aws_subnet" "subnet2" {
  vpc_id            = aws_vpc.myvpc.id
  availability_zone = "${var.region}b"
  cidr_block        = "10.0.1.0/24"
}

resource "aws_subnet" "subnet3" {
  vpc_id            = aws_vpc.myvpc.id
  availability_zone = "${var.region}c"
  cidr_block        = "10.0.2.0/24"
}

#Security group allowing SSH, HTTP and EFS inbound traffic
resource "aws_security_group" "ec2_security_group" {
  name        = "ec2_security_group"
  description = "Allow SSH ,HTTP and EFS inbound traffic"
  vpc_id      = aws_vpc.myvpc.id
  ingress {
    description = "SSH from VPC"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "EFS mount target"
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "HTTP from VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

variable "azs" {
  type = list(string)
}

locals {

  subnets = [aws_subnet.subnet1.id, aws_subnet.subnet2.id, aws_subnet.subnet3.id]
}

resource "aws_instance" "ec2_instances" {
  count                       = length(local.subnets)
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t2.micro"
  subnet_id                   = local.subnets[count.index]
  key_name                    = aws_key_pair.deployer.key_name
  associate_public_ip_address = true
  security_groups             = [aws_security_group.ec2_security_group.id]
  user_data = <<EOF
sudo yum install amazon-efs-utils -y -q
sudo mkdir efs",
sudo mount -t efs -o tls ${aws_efs_file_system.efs.id}:/ efs
sudo cd /efs
sudo echo set-up > set-up.log
  EOF
  tags = {
    Name = "ec2_instance_${count.index}"
  }
}


