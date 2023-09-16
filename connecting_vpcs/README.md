# Peer Connectio between several VPCs

## Problem
A software company specializing in Android apps has the following problem with its cloud infrastructure: there are currently three isolated VPCs, each with one server:
- Marketing
- Developers
- Financial

Both developers and marketing employees have to access financial data, so they can check their payrolls, taxes, expenses within the company, etc. The current way of accessing this information is raising a ticket to the finance department, which then accesses the requested data and send them to the requester.

This way of working is not efficient, since it makes developers and marketing employees wait for several days for some piece of data, and makes the financial department lose time every time a ticket is raised.

## Solution
Developers have access to their department's VPC and instance, just as marketing and finance departments do with their corresponding resources.

We have to allow both marketing and developer VPCs to access finance's VPC. This can be done by establishing peer connections.
- Between Marketing and Financial.
- Between Developers and Financial.

As peer connections are bidirectional, we have to add route tables to both marketing and developers, so every time an IP within finance VPC is set as a destination, the traffic is routed through the peer connection. Note that we should not allow finance employees to access any other VPC.

## Diagram

[<img src="https://github.com/martinBDev/IaC_AWS/blob/main/connecting_vpcs/Plan.png" alt="Plan" width="700"/>](https://github.com/martinBDev/IaC_AWS/blob/main/connecting_vpcs/Plan.png)