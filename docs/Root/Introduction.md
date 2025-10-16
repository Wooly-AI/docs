---
sidebar_position: 1
slug: /
---

## What is WoolyAI?

WoolyAI is a GPU Hypervisor providing several key features to optimize ML GPUs usage for Enterprise and Cloud environments. Key benefits of using WoolyAI are:

#### Developer Experience

1. **One Container To Rule Them All**: The WoolyAI Client container can be used with existing pytorch projects without any changes to the code. This is useful for kubernetes deployments, simplifying the configuration and maintenance drastically.
1. **No GPU Required**: Access high-end heavy-weight GPUs from lightweight (non-GPU) local machines. Researchers can run PyTorch, vLLM, or CUDA code on their laptop, desktop, or CPU-only VMs with no local GPU.
1. **Elmininate driver/toolkit mismatch headaches**: You'll no longer need to install NVIDIA drivers, CUDA versions on your dev environment to match with the GPU server runtime stack.
1. **Tight controler over security and governance**: Developer machines don't need GPU drivers or device files since execution happens on the WoolyAI Server, remotely. Think of a "thin client" model.
1. **Lower Infrastructure Costs**: WoolyAI is hardware-agnostic and can run on both NVIDIA and AMD GPUs, providing flexibility to choose the cheapest (or whatever is even available) hardware.

#### Maximizing GPU Utilization

1. **True GPU Concurrency**: Runs multiple workloads in a single GPU context without [time-slicing](../glossary#time-slicing) overhead, unlike traditional static partitioning ([MIG](../glossary#mig-multi-instance-gpu)/[MPS](../glossary#mps-multi-process-service)) that create rigid, underutilized segments.
1. **Dynamic Resource Allocation**: Real-time redistribution of GPU cores and VRAM based on active kernel processes, priority levels, and actual usage patterns -- not fixed quotas.
1. **100% GPU Utilization**: Eliminates idle cycles by continuously analyzing and optimizing resource distribution, ensuring no GPU compute or memory sits unused

### Architecture

![High Level WoolyAI Architecture](../../static/img/isoflow-high-level-controller.png)
High Level WoolyAI Architecture diagram showing the three main components: The WoolyAI Client, The WoolyAI Server, and The WoolyAI Controller.

It has three main components:

1. **The WoolyAI Client** is a docker container you can run anywhere, even machines without a GPU, supporting remote GPU execution to the WoolyAI Server.
1. **The WoolyAI Server** performs JIT compilation for cross-vendor CUDA execution, allowing hardware-agnostic support for multiple GPU vendors (currently NVIDIA and AMD).
    - Handles fully dynamic and usage-aware GPU resource allocation for maximum GPU utilization at all times.
<!--Wooly “ML Contexts” = We can run concurrent KERNEL processes in a single “Context” on the GPU. Inside of the Context we dynamically handle GPU compute and VRAM per process. Non-wooly a single process runs in a single context.-->
1. **The WoolyAI Controller** is a web interface and orchestrator, allowing you to manage and distribute workloads from Clients to WoolyAI Servers/GPU hosts based on GPU availability.

### What is the WoolyAI Client?

The WoolyAI Client is a docker container you can run on GPU-less/CPU-only machines. It can be connected to the WoolyAI Controller, and when a GPU workload is started, the WoolyAI Controller will return the URL/IP of a WoolyAI Server that can execute the workload.

### What is the WoolyAI Server?

The WoolyAI Server is container you'll run on your GPU host. It receives the Wooly Instruction Set from the WoolyAI Client and performs JIT compilation for cross-vendor CUDA execution. It also handles dynamic GPU resource allocation, maximizing per-GPU usage at all times.

You'll connect your WoolyAI Server to the WoolyAI Controller. At that point, the Controller will be able to distribute workloads to the WoolyAI Server based on GPU availability. 

Utilization benefits are therefore twofold:

1. The best WoolyAI Server is selected for the incoming workload by the WoolyAI Controller.
2. The workloads are dynamically allocating resources once running on a WoolyAI Server.

### What is the WoolyAI Controller?

The WoolyAI Controller is a web interface and orchestrator. WoolyAI Servers are joined to the Controller. Clients can connect to the Controller to request an available GPU host when a GPU workload is started locally.

---