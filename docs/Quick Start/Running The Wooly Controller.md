---
sidebar_position: 2
slug: /running-the-woolyai-controller
---

The WoolyAI Controller is a web interface and orchestrator. It is responsible for managing and distributing client execution requests to the GPU nodes running WoolyAI Server based on real-time GPU utilization.

It has three components:

- The WoolyAI Controller (API and Web UI)
- The WoolyAI Controller NATS Server (Message Broker)
- The WoolyAI Controller Database (ETCD)

### Prerequisites

- A host machine/VM to run the controller on. No GPU required.
- Docker or Kubernetes to run the controller in.

### Setup on Docker

For Docker, we provide a docker-compose.yml file that you can use to run the controller. You can download it [here](https://downloads.woolyai.com/controller/latest/docker-compose.yml). Inside of this yaml, you'll find each service making up the controller and how to configure them.

### Setup on Kubernetes

For Kubernetes, we provide a deployment.yml file that you can use to run the controller. You can download it [here](https://downloads.woolyai.com/controller/latest/deployment.yaml). Inside of this yaml, you'll find each service making up the controller and how to configure them.

### Overview

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

This is where you can see all the groups that exist for the GPU Nodes runing WoolyAI Servers.

## FAQ

- There is no need to go into the container.
- If you only have a single GPU host with one GPU, you don't need to install the Controller. Controller is used to orchestrate client requests load across multiple GPU nodes(Node cluster)
