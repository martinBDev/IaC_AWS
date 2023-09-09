import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { CfnOutput } from 'aws-cdk-lib';
import { BucketPolicy } from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //CREATE A BUCKET
    const bucket = new Bucket(this, 'StaticWebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      //SINCE APRIL 2023, AWS WILL BLOCK PUBLIC ACCESS TO BUCKETS BY DEFAULT
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL
    });

    //UPLOAD FILES TO BUCKET
    const upload = new BucketDeployment(this, 'UploadFiles', {
      sources: [Source.asset('../web')],
      destinationBucket: bucket,
    });

   

    //OUTPUT THE BUCKET URL
    new CfnOutput(this, 'BucketUrl', {
      value: bucket.bucketWebsiteUrl,
    });
  }
}
