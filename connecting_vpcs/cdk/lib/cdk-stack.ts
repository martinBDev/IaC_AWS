import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class ConnectingVPCsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //create the three VPCs
    
    const marketingVPC = new ec2.Vpc(this, 'MarketingVPC', {
      ipAddresses : ec2.IpAddresses.cidr('10.10.0.0/16'),
      maxAzs: 1,
      createInternetGateway: false,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ]
    });

    const developerVPC = new ec2.Vpc(this, 'DeveloperVPC', {
      cidr: '192.168.0.0/16',
      maxAzs: 1,
      createInternetGateway: false,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ]
    });

    const financialVPC = new ec2.Vpc(this, 'FinancialVPC', {
      cidr: '172.31.0.0/16',
      maxAzs: 1,
      createInternetGateway: false,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ]
    });

    //Create a security group allowing all inbound and outbound traffic
    const all_traffic_marketingVPC = new ec2.SecurityGroup(this, 'AllTrafficMarketing', {
      vpc: marketingVPC,
      allowAllOutbound: true,
      securityGroupName: 'MarketingSG',
    });
    all_traffic_marketingVPC.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic(), 'allow all traffic');

    const all_traffic_developerVPC = new ec2.SecurityGroup(this, 'AllTrafficDevs', {
      vpc: developerVPC,
      allowAllOutbound: true,
      securityGroupName: 'DeveloperSG',
    });
    all_traffic_developerVPC.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic(), 'allow all traffic');


    const all_traffic_financialVPC = new ec2.SecurityGroup(this, 'AllTrafficFinancial', {
      vpc: financialVPC,
      allowAllOutbound: true,
      securityGroupName: 'FinancialSG',
    });
    all_traffic_financialVPC.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic(), 'allow all traffic');

   
    const vpcs_to_sg_map = new Map<ec2.IVpc, ec2.ISecurityGroup>([
      [marketingVPC, all_traffic_marketingVPC],
      [developerVPC, all_traffic_developerVPC],
      [financialVPC, all_traffic_financialVPC],
    ]);

    //Three EC2 instances in each VPC
    vpcs_to_sg_map.forEach((sg, vpc) => {

      new ec2.Instance(this, `${vpc}Instance`, {
        vpc: vpc,
        vpcSubnets: {
          subnets: vpc.publicSubnets,
        },
        instanceType: new ec2.InstanceType('t2.micro'),
        machineImage: new ec2.AmazonLinuxImage(),
        securityGroup: sg,
        instanceName: `${vpc}Instance`,
      });

    });

    //Create a peering connection marketing <-> financial and developer <-> financial

    const marketing_to_financial = new ec2.CfnVPCPeeringConnection(this, 'MarketingToFinancial', {
      peerVpcId: financialVPC.vpcId,
      vpcId: marketingVPC.vpcId,
      tags: [{
        key: 'Name',
        value: 'MarketingToFinancial',
      }],
    });

    const developer_to_financial = new ec2.CfnVPCPeeringConnection(this, 'DeveloperToFinancial', {
      peerVpcId: financialVPC.vpcId,
      vpcId: developerVPC.vpcId,
      tags: [{
        key: 'Name',
        value: 'DeveloperToFinancial',
      }],
    });


    //Create a route table for developer and marketing VPCs
    const marketing_route_table = new ec2.CfnRouteTable(this, 'MarketingRouteTable', {
      vpcId: marketingVPC.vpcId,
      tags: [{
        key: 'Name',
        value: 'MarketingRouteTable',
      }],
    });
    const marketing_route_table_association = new ec2.CfnSubnetRouteTableAssociation(this, 'MarketingRouteTableAssociation', {
      routeTableId: marketing_route_table.ref,
      subnetId: marketingVPC.publicSubnets[0].subnetId,
    });
    
    const developer_route_table = new ec2.CfnRouteTable(this, 'DeveloperRouteTable', {
      vpcId: developerVPC.vpcId,
      tags: [{
        key: 'Name',
        value: 'DeveloperRouteTable',
      }],
    });
    const developer_route_table_association = new ec2.CfnSubnetRouteTableAssociation(this, 'DeveloperRouteTableAssociation', {
      routeTableId: developer_route_table.ref,
      subnetId: developerVPC.publicSubnets[0].subnetId,
    });


    //Create a route for each VPC to the other VPCs
    const developer_to_financial_route = new ec2.CfnRoute(this, 'DeveloperToFinancialRoute', {
      routeTableId: developer_route_table.ref,
      destinationCidrBlock: financialVPC.vpcCidrBlock,
      vpcPeeringConnectionId: developer_to_financial.ref,
    });

    const marketing_to_financial_route = new ec2.CfnRoute(this, 'MarketingToFinancialRoute', {
      routeTableId: marketing_route_table.ref,
      destinationCidrBlock: financialVPC.vpcCidrBlock,
      vpcPeeringConnectionId: marketing_to_financial.ref,
    });

    //Financial VPC has no route table since we don't want to allow Financials Department to access the other VPCs

  }
}
