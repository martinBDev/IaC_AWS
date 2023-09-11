
#create security group: allows inbound MYSQL traffic (from web server) and SSH (anywhere)
resource "aws_security_group" "db_server_sg" {
  name        = "db_server_sg"
  description = "Allow inbound MYSQL traffic from web server and SSH from anywhere"
  vpc_id      = aws_vpc.myvpc.id

  //allow all ping requests, so we can check connectivity
  ingress {
    description     = "Allow ping"
    from_port       = -1
    to_port         = -1
    protocol        = "icmp"
    security_groups = [aws_security_group.web_server_sg.id]
  }


  ingress {
    description     = "MYSQL/Aurora"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.web_server_sg.id]
  }

  ingress{
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    security_groups = [aws_security_group.web_server_sg.id]
  }



  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "db_server_sg"
  }
}

resource "aws_instance" "db_server" {

  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.private_subnet.id
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.db_server_sg.id]
  user_data              = data.template_file.db_setup.rendered
  tags = {
    Name = "db_Server"
  }
}

