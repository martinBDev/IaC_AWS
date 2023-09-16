# EC2 instances deployed in different AZs within same region

## Problem
My friend Nilo has just opened the wolrd's largest bakery, in his natal city. He has some services related to financials runing on two on premise computers. As his city is suffering several earthquakes every year, he wants to migrate to the cloud, so even if an earthquake destroys his bakery, he can still have access to his financial data.

## Solution
We can deploy two machines in the nearest region to Nilo's natal city. As certain places in the region suffer earthquakes, it is a good idea to deploy the machines in different availability zones.

## Diagram
In the followong simple diagram we can review where the machines are deployed:

[<img src="https://github.com/martinBDev/IaC_AWS/blob/main/ec2_different_azs/plan.png" alt="Plan" width="500"/>](https://github.com/martinBDev/IaC_AWS/blob/main/ec2_different_azs/plan.png)