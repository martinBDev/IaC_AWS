import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class EC2instancesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const currentRegion = cdk.Stack.of(this).region;

    //Create VPC 
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      natGateways: 0,
      availabilityZones: [currentRegion + 'a', currentRegion + 'b'],
  });


//CREATE SECURITY GROUP FOR EC2 INSTANCES
  const securityGroup = new ec2.SecurityGroup(this, 'sg', {
      vpc: vpc,
      description: 'Allow ssh access to ec2 instances',
      allowAllOutbound: true,
      disableInlineRules: true,
  });

  securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');

  const machineA = new ec2.Instance(this,'instance_a', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    machineImage: new ec2.AmazonLinuxImage(),
    vpc: vpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PUBLIC,
      availabilityZones: [currentRegion + 'a']
    },
    securityGroup: securityGroup,
    availabilityZone: currentRegion + 'a',
    
  });


  const machineB = new ec2.Instance(this,'instance_b', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    machineImage: new ec2.AmazonLinuxImage(),
    vpc: vpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PUBLIC,
      availabilityZones: [currentRegion + 'b']
    },
    securityGroup: securityGroup,
    availabilityZone: currentRegion + 'b'
  });

  }
}
