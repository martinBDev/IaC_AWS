import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class IAMSupportTeamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const SupportEngineers = new iam.Group(this, 'SupportEngineers');

    const EC2Policy = new iam.Policy(this, 'SupportEngineersEC2Policy',{
      statements:[
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['ec2:Describe*'],
          resources: ['*'],
        })
      ]
    });

    const RDSPolicy = new iam.Policy(this, 'SupportEngineersRDSPolicy',{
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['rds:Describe*'],
          resources: ['*'],
        })
      ]
    });

    SupportEngineers.attachInlinePolicy(EC2Policy);
    SupportEngineers.attachInlinePolicy(RDSPolicy);

  }
}
