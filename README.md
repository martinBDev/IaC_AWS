
# AWS Infrastructure as Code (IaC)
This repo will store several AWS Architectures or Patterns implemented as IaC, for the sake of practicing my IaC capabilities. For each small project, two solutions will be implemented: one using Terraform and another one with AWS CDK (for Typescript).
 
 
 <img src="https://scalefactory.com/blog/2021/04/30/hashicorp-terraform-release-key-rotation/Terraform.png" alt="Terraform Logo" width="200"/> <img src="https://d2908q01vomqb2.cloudfront.net/7719a1c782a1ba91c031a682a0a2f8658209adbf/2021/01/15/cdk-logo6-1260x476.png" alt="AWS CDK Logo" width="350"/>  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png" alt="TS Logo" width="150"/>

## Projects
For each folder in this repo you will find:
- A 'Readme.md' file explaining the initial problem and the expected solution.
- The design of the solution, in a 'plan.png' file.
- Two folders:
    - The Terraform solution.
    - The CDK solution, implemented in Typescript.
 
### Project List
| LINK | TERRAFORM |	AWS CDK	| README |
|--|--|--|--|
| [Static Web Hosting using S3 Buckets](https://github.com/martinBDev/IaC_AWS/tree/main/static_web_hosting) | :white_check_mark:Done|:white_check_mark:Done| :white_check_mark:Done|
| [EC2 instances deployed in different AZs within same region](https://github.com/martinBDev/IaC_AWS/tree/main/ec2_different_azs) | :white_check_mark:Done|:white_check_mark:Done|:white_check_mark:Done|
| [Web and DB servers. Provisioning and isolation](https://github.com/martinBDev/IaC_AWS/tree/main/internet_access) | :white_check_mark:Done|:white_check_mark:Done|:white_check_mark:Done|
| [Peer Connectio between several VPCs](https://github.com/martinBDev/IaC_AWS/tree/main/connecting_vpcs) |  :white_check_mark:Done|:white_check_mark:Done|:white_check_mark:Done|
| [RDS With Standby and Read Replica](https://github.com/martinBDev/IaC_AWS/tree/main/rds_with_replicas) |  :hammer_and_wrench:Working on it...|:hammer_and_wrench:Working on it...|:hammer_and_wrench:Working on it...|
| [IAM Roles for Support Engineering Team](https://github.com/martinBDev/IaC_AWS/tree/main/iam_support_team) |  :hammer_and_wrench:Working on it...|:hammer_and_wrench:Working on it...|:hammer_and_wrench:Working on it...|

All this exercises are based on [AWS Cloud Quest: Cloud Practitioner](https://pages.awscloud.com/global_traincert_twitch-cloud-quest-CP.html) certification.
 By the way, i'm certified:
 
[<img src="https://images.credly.com/images/2784d0d8-327c-406f-971e-9f0e15097003/image.png" alt="Badge" width="250"/>](https://www.credly.com/badges/6a20699d-5c86-4f4b-ad0c-cb36d47554fe/public_url)
