import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const rds_vpc = new ec2.Vpc(this, 'rds-vpc', {
      maxAzs: 3,
      createInternetGateway: true,
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      subnetConfiguration: [
        {
          name: 'public',
          cidrMask: 24,
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'private',
          cidrMask: 24,
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    const rds_instance = new rds.DatabaseInstance(this, 'rds-instance', {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      vpc: rds_vpc,
      //Do not specify credentials directly in code
      credentials: rds.Credentials.fromPassword("admin", cdk.SecretValue.unsafePlainText("admin")),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      allocatedStorage: 20,
      multiAz: true, //THIS WILL CREATE A STANDBY REPLICA IN A DIFFERENT AZ
      publiclyAccessible:false,
      backupRetention: cdk.Duration.days(7), //CREATE A BACKUP EVERY WEEK
      preferredBackupWindow: '04:00-06:00', //BACKUP WINDOW
      copyTagsToSnapshot: true, //COPY TAGS TO SNAPSHOT
      storageEncrypted: true, //ENCRYPT STORAGE, default KMS
      enablePerformanceInsights: false,
    });

    

    const read_replica = new rds.DatabaseInstanceReadReplica(this, 'rds-read-replica', {
      sourceDatabaseInstance: rds_instance,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      vpc: rds_vpc,
    });


  }
}
