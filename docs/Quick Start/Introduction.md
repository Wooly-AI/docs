---
sidebar_position: 1
slug: /
---

## What is Wooly?

At WoolyAI, we’ve built a technology stack that decouples kernel execution from CUDA by introducing our own abstraction layer. Within this layer, kernels are compiled into a Wooly Instruction Set. At runtime, when a kernel is launched, it is transferred in Wooly Instruction Set format over the network from a CPU host to a Wooly Server running on the GPU. The Wooly Server dynamically recompiles these kernels and manages the execution to achieve max GPU utilization, concurrent workload isolation and cross compatibility with hardware vendors before converting them to pass to target GPU hardware runtime(Currently Nvidia). Wooly abstraction layer is in principle similar to an Operating System which sits on top of the hardware and enables the most efficient, and reliable execution of multiple workloads.

Instead of hard-partitioning GPUs or overpaying for unused GPU reserved/hold time, Wooly Abstraction Layer manages execution of multiple user workloads on GPU similar to how an Operating System manages execution of multiple applications. 
This allows for:
1. Efficient allocation of GPU memory and processing resources to every running workload
2. Maximum GPU utilization at all times
3. Flexible GPU memory and processing cycles allocation at runtime to meet pre configured SLA
4. Tracking of Workload Resource-usage metrics
We are calling this Unbound GPU Execution Era.

__Note - Currently supports Pytorch applications only. Support for other non-Pytorch applications using CUDA like Ollama and more are coming soon.__

__Get Started with WoolyAI Acceleration Service today!__

WoolyAI Acceleration Service is our GPU Cloud service built on top of our abstraction layer for CUDA - **WoolyStack**.

1. [Sign up for WoolyAI, and we'll send you a token.](https://woolyai.com/get-started/)
2. [Deploy the Wooly Client Container.](./Running%20Your%20First%20Project.md)
3. [Login to the WoolyAI GPU Acceleration service using your token from inside the container.](./Running%20Your%20First%20Project.md#log-in-to-the-woolyai-acceleration-service)
4. Configure your custom Pytorch training/finetuning environment inside the container and execute it. It will automatically use the WoolyAI GPU Acceleration Service.
    - [Explore projects from the examples directory.](./Running%20Your%20First%20Project.md#run-a-pytorch-project)
    - [Get familiar with the container environment.](./Understanding%20the%20Container%20Environment.md)
    



