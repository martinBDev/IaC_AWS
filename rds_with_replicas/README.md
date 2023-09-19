# RDS With Standby and Read Replica

## Problem
A company focusing on sales wants to migrate their relational database (MySQL) to AWS. As they have clients worldwide, they need a fault-tolerant and scalable database, so they can offer 24/7 service.

The company also performs several data analyses with their clients' data so they can predict future purchases and recommend products to each client individually. These analyses do not modify the data, they can be seen as 'read-only' operations.

## Solution
The best option would be to create a DB instance using Amazon Relational Database Service (Amazon RDS), since it allows us to use MariaDB, MySQL, Oracle, etc.

In order to make it fault-tolerant, we can deploy an RDS instance in one particular AZ and a 'standby replica' in another AZ. Every time a write operation is performed on the original instance, it will be replicated on the standby instance (synchronous replication). If either of these operations fails, both are rolled back. If there is any kind of failover affecting the original instance, the standby replica will be used without downtime, as it is an exact copy of the original DB.

Now, we need to take into account what the company suggested about data analysis: these read operations would take place on the original RDS instance. These operations will interfere with real clients' operations, causing bottlenecks and downtimes. A good option is to enable a 'read replica'. This replica will be updated asynchronously, and every data analysis will be performed on this DB replica instance.

## Diagram
In the following diagram we can see the expected infrastructure:

[<img src="https://github.com/martinBDev/IaC_AWS/blob/main/rds_with_replicas/plan.png" alt="Plan" width="900"/>](https://github.com/martinBDev/IaC_AWS/blob/main/rds_with_replicas/plan.png)