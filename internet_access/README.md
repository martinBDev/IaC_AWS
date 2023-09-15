# Web and DB servers. Provisioning and isolation

## Problem
The local library wants us to review their servers' structure. At first sight, we see that they have their website and database working on the same local server, and both are publicly accesible.

The web is running on Apache and the database is a MariaDB instance.

## Solution
As the web and the database are different services, with different restrictions, it's a good idea to separate them on two machines.
One of the machines must be accesible from the internet, as it will be serving the website. The other machine, hosting the database, must be only accesible for the website.

To reach our goal, we have to create a VPC with two subnets, a public and a private one. The web server will be deployed onto the public subnet, while the database server will be working from the private subnet.

Each machine will be linked to a security group:
- The web server must allow HTTP connections and SSH connections (in case we want to connect to the instance), from anywhere on the internet.
- The DB server must allow MySQL connectios, only from those instances linked to the previous security group.

A route table will be in charge of redirecting the local traffic within the VPC or redirecting internet traffic to an internet gateway.

As we are really kind developers, we will also install Apache and MariaDB on the servers, so the client can just start working with them. To do so, we will use two methods:
- Userdata: with CDK we can use Userdata to input bin/bash commands to be run once the instance starts.
- Cloud-init: a provisioner used with Terraform via a configuration .yml file.

## Diagram
In the following diagram we can see how simple this deployment is:

[<img src="https://github.com/martinBDev/IaC_AWS/blob/main/internet_access/Plan.png" alt="Plan" width="900"/>](https://github.com/martinBDev/IaC_AWS/blob/main/internet_access/Plan.png)