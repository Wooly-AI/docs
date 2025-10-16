---
sidebar_position: 1
slug: /
---

## What is Wooly?

Wooly is a GPU Hypervisor providing several key features to optimize ML GPUs usage. Key benefits of using Wooly are:

#### Developer Benefits

1. Access high-end heavy-weight GPUs from lightweight (non-GPU) local machines. Researchers can run PyTorch, vLLM, or CUDA code on their laptop, desktop, or CPU-only VMs with no local GPU.
2. Elmininate driver/toolkit mismatch headaches. You'll no longer need to install NVIDIA drivers, CUDA versions on your dev environment to match with the GPU server runtime stack.
3. Tight controler over security and governance. Developer machines don't need GPU drivers or device files since execution happens on the Wooly Server, remotely. Think of a "thin client" model.

#### Maximizing GPU Utilization

1. 


It has three main components:

1. **The Wooly Client** is a docker container you can run anywhere, even machines without a GPU, supporting remote GPU execution to the Wooly Server.
1. **The Wooly Server** performs JIT compilation for cross-vendor CUDA execution, allowing hardware-agnostic support for multiple GPU vendors (currently NVIDIA and AMD).
    - Handles fully dynamic and usage-aware GPU resource allocation for maximum GPU utilization at all times.
<!--Wooly “ML Contexts” = We can run concurrent KERNEL processes in a single “Context” on the GPU. Inside of the Context we dynamically handle GPU compute and VRAM per process. Non-wooly a single process runs in a single context.-->
1. **The Wooly Controller** is a web interface and orchestrator, allowing you to manage and distribute workloads from Clients to Wooly Servers/GPU hosts based on GPU availability.

### What is the Wooly Client?

The Wooly Client is a docker container you can run on GPU-less/CPU-only machines. It can be connected to the Wooly Controller, and when a GPU workload is started, the Wooly Controller will return the URL/IP of a Wooly Server that can execute the workload.

### What is the Wooly Server?

The Wooly Server is container you'll run on your GPU host. It receives the Wooly Instruction Set from the Wooly Client and performs JIT compilation for cross-vendor CUDA execution. It also handles dynamic GPU resource allocation, maximizing per-GPU usage at all times.

You'll connect your Wooly Server to the Wooly Controller. At that point, the Controller will be able to distribute workloads to the Wooly Server based on GPU availability. 

Utilization benefits are therefore twofold:

1. The best Wooly Server is selected for the incoming workload by the Wooly Controller.
2. The workloads are dynamically allocating resources once running on a Wooly Server.

### What is the Wooly Controller?

The Wooly Controller is a web interface and orchestrator. Wooly Servers are joined to the Controller. Clients can connect to the Controller to request an available GPU host when a GPU workload is started locally.

![Wooly Architecture](../../static/img/isoflow-high-level-controller.png)
