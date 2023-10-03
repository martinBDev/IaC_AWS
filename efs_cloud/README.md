# File System in the Cloud using Amazon EFS

## Problem
A pet modeling agency already have a web app deployed in three diferent AZs (EC2 instances). Every time they perform a change in any part of the code, they have to update that same file in the other machines. The want a solution so they only have to update once the code.

## Solution
As they already have three EC2 instances in differente AZs, it would be a good solution to set up Amazon Elastic File System and mount it in each instance, so the share the same file system.

## Diagram
In the followong simple diagram we can review where how the EFS is mounted:

[<img src="https://github.com/martinBDev/IaC_AWS/blob/main/efs_cloud/plan.png" alt="Plan" width="500"/>](https://github.com/martinBDev/IaC_AWS/blob/main/efs_cloud/plan.png)