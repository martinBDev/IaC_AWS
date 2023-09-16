resource "aws_vpc_peering_connection" "developer_to_fiancial" {
  peer_owner_id = data.aws_caller_identity.current.account_id
  peer_vpc_id   = aws_vpc.financial_vpc.id
  vpc_id        = aws_vpc.developer_vpc.id
  tags = {
    Name = "Developer<->Financial"
  }
}

resource "aws_vpc_peering_connection" "marketing_to_financial" {
  peer_owner_id = data.aws_caller_identity.current.account_id
  peer_vpc_id   = aws_vpc.financial_vpc.id
  vpc_id        = aws_vpc.marketing_vpc.id
  tags = {
    Name = "Marketing<->Financial"
  }
}
  
resource "aws_route_table" "developer_route_table" {
  vpc_id = aws_vpc.developer_vpc.id
  

  route {
    cidr_block = aws_vpc.developer_vpc.cidr_block
    gateway_id = "local"
  }

  route {
    cidr_block        = aws_vpc.financial_vpc.cidr_block
    gateway_id = aws_vpc_peering_connection.developer_to_fiancial.id
  }

  tags = {
    Name = "Developer route table"
  }
}

resource "aws_route_table" "marketing_route_table" {
  vpc_id = aws_vpc.marketing_vpc.id
  

  route {
    cidr_block = aws_vpc.marketing_vpc.cidr_block
    gateway_id = "local"
  }

  route {
    cidr_block        = aws_vpc.financial_vpc.cidr_block
    gateway_id = aws_vpc_peering_connection.marketing_to_financial.id
  }

  tags = {
    Name = "Marketing route table"
  }
}

resource "aws_route_table_association" "marketing_association" {
  subnet_id      = aws_subnet.marketing_subnet.id
  route_table_id = aws_route_table.marketing_route_table.id
}

resource "aws_route_table_association" "developer_association" {
  subnet_id      = aws_subnet.developer_subnet.id
  route_table_id = aws_route_table.developer_route_table.id
}