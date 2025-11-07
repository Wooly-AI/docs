---
sidebar_position: 2
slug: /running-the-woolyai-controller
---

The WoolyAI Controller is a web interface and orchestrator(router). It is packaged to run as a docker container on your infrastructure and doesn't need to run on GPU. It is responsible for routing WoolyAI client(ML container) execution requests to the GPU nodes running WoolyAI Server based on real-time GPU utilization.

It has three components:

- The WoolyAI Controller (API and Web UI)
- The WoolyAI Controller NATS Server (Message Broker)
- The WoolyAI Controller Database (ETCD)

### Prerequisites

- A host machine/VM to run the controller on. No GPU required.
- Docker or Kubernetes to run the controller in.
- Running Wooly Client and Wooly Server.

## Setup

:::info
Regardless of the method of setup you choose, you'll need to edit both the Client and Server config files to point to the Controller. You'll find instructions inside of the configs for each.
:::

:::info
Take note of the `nats` ports as they will be used when pointing the Server to the Controller.
:::

### Docker

For Docker, we provide a docker-compose.yml file that you can use to run the controller. You can download it [here](https://downloads.woolyai.com/controller/latest/docker-compose.yml). Inside of this yaml, you'll find each service making up the controller and how to configure them. The defaults we provide should work for most use cases.

### Kubernetes

For Kubernetes, we provide a deployment.yml file that you can use to run the controller. You can download it [here](https://downloads.woolyai.com/controller/latest/deployment.yaml). Inside of this yaml, you'll find each service making up the controller and how to configure them. The defaults we provide should work for most use cases.

## Overview

Once the controller is running, you can access the web interface at `http://localhost:8080` (unless you changed the port in the configuration).

It will display a dashboard with information about the GPU nodes running the WoolyAI Servers, tasks(WoolyAI Client requests), and other metrics we think are important. Along with the Dashboard, you'll find Tasks, Nodes, and Groups. 

#### **Tasks**

![Tasks](/img/controller-tasks.png)

This is where you can see all the WoolyAI Client requests(ML workload executions from inside WoolyAI Client Containers) that are currently running across GPU nodes running WoolyAI Servers. These are created when a WoolyAI Client requests a GPU kernel execution(Pytorch or other ML workload execution inside WoolyAI Client Container).

#### **Nodes**

![Nodes](/img/controller-nodes.png)

This is where you can see all the GPU hosts running WoolyAI Servers that are currently connected to the controller as well as information about them like how many GPUs they have available and how much they are currently being used.

#### **Groups**

![Groups](/img/controller-groups.png)

This is where you can see all the groups that exist for the GPU Nodes runing WoolyAI Servers. You can put GPU nodes running the WoolyAI server in specific groups. Then, your can target specific ML workloads executing inside WoolyAi Client containers to run against a specific group(done through client config). This is relevant when you want a specific job on specific type of GPU.
**Note** Including a node into a group mean only jobs targeted to this group will execute on this node and the node is taken out of the common pool capacity.

### Connecting your WoolyAI Servers and Clients

Once the WoolyAI Controller is running, you can connect your WoolyAI Server and Client to it. This is done by modifying both the Server and Client configs with the Controller URL restarting the containers.

#### Server Config

In the server config, you'll set the `Controller integration` values like `CONTROLLER_NATS_URL`, `NODE_NAME`, etc.

#### Client Config

The client config is much easier. You'll simply set `CONTROLLER_URL` and any other required values in the same section.

Once restarted, check the `docker logs` command for both Server and Client and make sure they were able to communicate.

## FAQ

- There is no need to go into the container.
- If you only have a single GPU host with one GPU, you don't need to install the Controller. Controller is used to route client requests load across multi-GPU setup.
- If you have issue starting, try `docker compose down -v` to delete the volumes and reset the containers from scratch.
