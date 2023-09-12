import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Buffer } from 'buffer';

export class InternetAccessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //CREATE VPC with 2 subnets (public and private)
    const myVpc = new ec2.Vpc(this, 'MyVpc', {
      cidr: '10.10.0.0/16',
      maxAzs: 1,
      createInternetGateway: false,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],

  });

  //Create security group for web server
  const web_server_sg = new ec2.SecurityGroup(this, 'web_server_sg', {
    vpc: myVpc,
    description: 'Allow access to web server from anywhere',
    securityGroupName: 'web_server_sg',
    allowAllOutbound: true,
  });

  //Allow access from anywhere TO SSH and HTTP
  web_server_sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'allow http access from the world');
  web_server_sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow SSH access from the world');
  

  //Create security group for db server
  const db_server_sg = new ec2.SecurityGroup(this, 'db_server_sg', {
    vpc: myVpc,
    description: 'Allow access to db server from web server',
    securityGroupName: 'db_server_sg',
    allowAllOutbound: true,
  });
  //Allow access from web server
  db_server_sg.addIngressRule(web_server_sg, ec2.Port.tcp(3306), 'allow mysql access from web server');
  db_server_sg.addIngressRule(web_server_sg, ec2.Port.tcp(22), 'allow SSH access from web server');
  //ICMP is needed for ping
  db_server_sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.icmpPing(), 'allow ICMP access from web server');


  //CREATE INTERNET GATEWAY AND ATTACH IT TO VPC
  const internet_gateway = new ec2.CfnInternetGateway(this, 'internet_gateway', {
    tags: [{ key: 'Name', value: 'internet_gateway' }],
  });
  const internet_gateway_attachment = new ec2.CfnVPCGatewayAttachment(this, 'internet_gateway_attachment', {
    vpcId: myVpc.vpcId,
    internetGatewayId: internet_gateway.ref,
  });

  


  //CREATE ROUTE TABLE AND ADD ROUTES
  const route_table = new ec2.CfnRouteTable(this, 'route_table', {
    vpcId: myVpc.vpcId,
    tags: [{ key: 'Name', value: 'route_table' }],
  });

  //Add route to LOCAL NETWORK
  /**
   * THIS RULE IS AUTOMATICALLY ADDED BY CDK
   * 
   * new ec2.CfnRoute(this, 'route_to_local', {
    routeTableId: route_table.ref,
    destinationCidrBlock: '10.10.0.0/16',
    gatewayId: 'local',
  });
   */
  
  //Add route to internet gateway
  new ec2.CfnRoute(this, 'route_to_internet', {
    routeTableId: route_table.ref,
    destinationCidrBlock: '0.0.0.0/0',
    gatewayId: internet_gateway.ref,
  });

  //Associate route table with public subnet
  new ec2.CfnSubnetRouteTableAssociation(this, 'route_table_association', {
    routeTableId: route_table.ref,
    subnetId: myVpc.publicSubnets[0].subnetId,
  });


  //Create public and private servers
  const web_server = new ec2.CfnInstance(this, 'web_server', {
    instanceType: 't2.micro',
    imageId: new ec2.AmazonLinuxImage().getImage(this).imageId,
    subnetId: myVpc.publicSubnets[0].subnetId,
    securityGroupIds: [web_server_sg.securityGroupId],
    //user data to install apache
    userData: cdk.Fn.base64(
      `#!/bin/bash 
sudo yum install -y httpd
sudo systemctl start httpd
sudo systemctl enable httpd`
    ),
    tags: [{ key: 'Name', value: 'web_server' }],
  });

  new cdk.CfnOutput(this, 'user_data', { 
    value: web_server.userData as string,
  });

  const db_server = new ec2.CfnInstance(this, 'db_server', {
    instanceType: 't2.micro',
    imageId: new ec2.AmazonLinuxImage().getImage(this).imageId,
    subnetId: myVpc.privateSubnets[0].subnetId,
    securityGroupIds: [db_server_sg.securityGroupId],
    tags: [{ key: 'Name', value: 'db_server' }],
  });


  new cdk.CfnOutput(this, 'web_server_public_ip', {
    value: web_server.attrPublicIp,
  });

  new cdk.CfnOutput(this, 'db_server_private_ip', {
    value: db_server.attrPrivateIp,
  });


}}
