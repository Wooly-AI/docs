---
sidebar_position: 1
slug: /
---

## What is Wooly?

WoolyAI technology is a game-changing CUDA abstraction layer that sits at the intersection of software and GPU hardware and completely disrupts how GPU resources are consumed. We decouple the Kernel Shader execution from CUDA into a Wooly Abstraction layer. In this abstraction layer, Shaders are compiled into a Wooly Instruction Set. At runtime, Kernel Shader launch events initiate transfer of Shader over the network from a CPU host to a GPU host where they are recompiled and their execution is managed to achieve max GPU resource utilization, isolation between workloads and cross compatibility with hardware vendors before being converted to be passed on to the respective GPU hardware runtime and drivers. Wooly abstraction layer is in principle similar to an Operating System which sits on top of the hardware and enables the most efficient, and reliable execution of multiple workloads.

Instead of hard-partitioning GPUs or overpaying for unused GPU reserved/hold time, Wooly Abstraction Layer manages execution of multiple user workloads on GPU similar to how an Operating System manages execution of multiple applications. 
This allows for:
1. Efficient allocation of GPU memory and processing resources to every running workload
2. Maximum GPU utilization at all times
3. Flexible GPU memory and processing cycles allocation at runtime to meet pre configured SLA
4. Tracking of Workload Resource-usage metrics
We are calling this Unbound GPU Execution Era.
__Note - Currently support Pytorch applications only. Support for other non-Pytorch applications like Ollama and more are coming soon.__

__Get Started with WoolyAI Acceleration Service today!__

WoolyAI Acceleration Service is our GPU Cloud service built on top of our CUDA abstraction layer - WoolyStack.

1. [Sign up for WoolyAI and wait for us to send you a token.](https://woolyai.com/get-started/)
2. [Deploy the Wooly Client Container.](./Running%20Your%20First%20Project.md)
3. [Run your first project from the examples directory.](./Running%20Your%20First%20Project.md#run-a-pytorch-project)
4. [Get familiar with the container environment.](./Understanding%20the%20Container%20Environment.md)



