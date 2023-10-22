import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';

export class EfsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const currentRegion = cdk.Stack.of(this).region;
    const azs = [currentRegion + 'a', currentRegion + 'b', currentRegion + 'c']

    //Create VPC 
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      natGateways: 0,
      availabilityZones: azs,
    });

    const securityGroup = new ec2.SecurityGroup(this, 'efs-sg', {
      vpc: vpc,
      description: 'Allow ssh, http and NFS access to efs instances',
      allowAllOutbound: true,
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'allow http access from the world');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(2049), 'allow NFS access from the world');


    const fileSystem = new efs.FileSystem(this, 'MyEfsFileSystem', {
      vpc: vpc,
      lifecyclePolicy: efs.LifecyclePolicy.AFTER_14_DAYS, // files are not transitioned to infrequent access (IA) storage by default
      performanceMode: efs.PerformanceMode.GENERAL_PURPOSE, // default
      outOfInfrequentAccessPolicy: efs.OutOfInfrequentAccessPolicy.AFTER_1_ACCESS, // files are not transitioned back from (infrequent access) IA to primary storage by default
    });

    

    

    azs.forEach((az, index) => {


      //CREATE EC2 INSTANCES FOR EACH AVAILABILITY ZONE
      const instance = new ec2.Instance(this,'instance_'+index, {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc: vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
          availabilityZones: [az]
        },
        securityGroup: securityGroup,
        availabilityZone: az,
        //Create a keypair from the AWS console and replace the keyName value with the name of your keypair
        keyName: 'CDK',
      });

      fileSystem.connections.allowDefaultPortFrom(instance)

      instance.userData.addCommands(
        "yum check-update -y",    // Ubuntu: apt-get -y update
        "yum upgrade -y",                                 // Ubuntu: apt-get -y upgrade
        "yum install -y amazon-efs-utils",                
        "file_system_id_1=" + fileSystem.fileSystemId,
        "efs_mount_point_1=/mnt/efs",
        "sudo mkdir -p \"${efs_mount_point_1}\"",
        "sudo mount -t efs -o tls \"${file_system_id_1}:\" \"${efs_mount_point_1}\"",
        "sudo chmod go+rw \"${efs_mount_point_1}\"",
        "sudo cd /efs",
        "sudo echo set-up > set-up.log",
      );

      

    });


  }
}
