# IAM Roles for Support Engineering Team

## Problem
The City Stock Exchange is about to create a new Support Engineers team. This new teem needs acces to all EC2 machines, but are not allow to create, update or delete any resource.

## Solution
The best solution will be to create a new IAM Group, attach a managed EC2 read-only access policy to it and then add each singular support engineer user to that IAM Group.

## Diagram
In the followong simple diagram we can review how these policies work:

[<img src="https://github.com/martinBDev/IaC_AWS/blob/main/iam_support_team/plan.png" alt="Plan" width="500"/>](https://github.com/martinBDev/IaC_AWS/blob/main/iam_support_team/plan.png)