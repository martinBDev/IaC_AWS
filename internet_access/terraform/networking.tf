

resource "aws_internet_gateway" "internet_gw" {
  vpc_id = aws_vpc.myvpc.id
}


resource "aws_route_table" "route_table" {
  vpc_id = aws_vpc.myvpc.id

  route {
    cidr_block = "10.10.0.0/16"
    gateway_id = "local"
  }

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gw.id
  }

  tags = {
    Name = "route_table"
  }

  depends_on = [
    aws_internet_gateway.internet_gw
  ]
}

resource "aws_route_table_association" "assoc_a" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.route_table.id
}

