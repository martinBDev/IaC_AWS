
#create security group for web server: allow inbound HTTP traffic and SSH
resource "aws_security_group" "web_server_sg" {
  name        = "web_server_sg"
  description = "Allow inbound HTTP and SSH traffic"
  vpc_id      = aws_vpc.myvpc.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "web_server_sg"
  }
}


#create ec2 instance: to connect to the instance, use the private key generated with ssh-keygen
#ssh -i <where_your_key_is> ec2-user@<public_ip>
resource "aws_instance" "web_server" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public_subnet.id
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.web_server_sg.id]
  user_data              = data.template_file.user_data.rendered

//copy the private key to the instance, so we can connect to the db server
    provisioner "file" {
      source = "C:/Users/usuario/.ssh/terraform"
      destination = "/home/ec2-user/.ssh/terraform"
    }

  tags = {
    Name = "web_server"
  }
}

