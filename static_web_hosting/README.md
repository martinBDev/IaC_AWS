# Static Web Hosting using S3 Buckets

## Problem:
Los Angeles' lifeguards team published a decade ago a static website where citizens can check sea levels and waves sizes at the beach. Since the number of surfers have increased in the last two years significantly, the web is receiving more visits every day. Due to this encrease of traffic, the website is experiencing downtimes and bottlenecks, as it is runing in a local server inside the town hall's building.

Los Angeles' town hall has asked us to migrate the website to the cloud, so it can answer more requests and scale depending on the traffic.

## Solution
As it is an static website, we can deploy the web to an S3 bucket and enable website hosting, so anyone can access the webpage and chack sea levels and waves sizes.

## Diagram
As the diagram is quite simple, we will use the diagram provided by AWS Cloud Quest:
[Plan](https://github.com/martinBDev/IaC_AWS/blob/main/static_web_hosting/plan.png)