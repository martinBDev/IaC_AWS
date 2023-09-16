
//CREATE THE THREE VPCs

//MARKETING VPC
resource "aws_vpc" "marketing_vpc" {
  cidr_block = "10.10.0.0/16"
  tags = {
    Name = "MarketingVPC"
  }
}

resource "aws_subnet" "marketing_subnet" {
  vpc_id     = aws_vpc.marketing_vpc.id
    cidr_block = "10.10.0.0/16"
}


//DEVELOPER VPC

resource "aws_vpc" "developer_vpc" {
    cidr_block = "192.168.0.0/20"
    tags = {
      Name = "DeveloperVPC"
    }
}

resource "aws_subnet" "developer_subnet" {
  vpc_id     = aws_vpc.developer_vpc.id
  
  cidr_block = "192.168.0.0/20"
}

//FINANCIAL VPC

resource "aws_vpc" "financial_vpc" {
    cidr_block = "172.31.0.0/16"
    tags = {
      Name = "FinancialVPC"
    }
}

resource "aws_subnet" "financial_subnet" {
  vpc_id     = aws_vpc.financial_vpc.id
  cidr_block = "172.31.0.0/16"
  
}