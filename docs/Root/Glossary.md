---
sidebar_position: 100
slug: /glossary
---

## WoolyAI Commonly Used Terms

### WoolyAI Server

This is the WoolyAI software that runs on every GPU host/node. Multi-GPU hosts are supported. WoolyAI software runs inside a docker container. WoolyAI server JIT compiles kernels from WoolyAI Client to Native GPU ISA. WoolyAI server also manages allocation of GPU compute core and VRAM at runtime across concurrent kernel process to optimize GPU utilization.

### WoolyAI Client

This is the WoolyAI software that runs user CUDA ML workloads(Pytorch). WoolyAI Client is packaged as docker container and contains WoolyAI runtime libraries and WoolyAI compiled Pytorch. User can execute WoolyAI Client Container on CPU only machine or on the GPU host. User runs their Pytorch projects inside the WoolyAI Client Container.

### WoolyAI Controller

This is the WoolyAI software that provides a web interface and routes WoolyAI Client requests across a cluster of GPUs running the WoolyAI Server. WoolyAI Controller maintains a queue of all incoming WoolyAI Client requests and presents information through a dashboard. WoolyAI Controller runs as a docker container and doesn't require to run on GPU host. WoolyAI Controller connects and collects GPU utilization metrics from the GPU hosts(running the WoolyAI server).

### GPU Auditor
GPU Auditor tool is a software package that we have developed and open sourced to enable users to get insights into existing GPU utilization.

## GPU Concurrency Approaches

### Time slicing

Each workload gets the full GPU for a fixed time window (e.g., workload A runs for 100ms, then workload B runs for 100ms, back to A, etc.). The GPU switches between them.

### MIG (Multi-Instance GPU)

Physically partitions the GPU into fixed segments (e.g., split an A100 into 4 smaller "GPUs"). Each segment is locked to that size even if it's not fully used. MIG doesn't work across all GPUs though.

### MPS (Multi-Process Service)

NVIDIA's CUDA Multi-Process Service (MPS) enables multiple co-operative processes to share GPU compute resources. While primarily designed for MPI applications that work together, MPS has also been adopted for sharing GPU resources between independent applications, though this introduces certain limitations. MPS lacks error isolation between clients, meaning issues in one client can affect others. Although streaming multiprocessors (SMs) can be optionally capped to a percentage per MPS client, the underlying scheduling hardware remains shared across all clients. Additionally, memory bandwidth, cache, and memory capacity are shared resources among all MPS clients.

It also has configuration requirements that make it a bit cumbersome to use and adapt.

### WoolyAI's Solution for GPU Concurrency and Maximizing utilization

Wooly runs all workloads in the same GPU context (think of it like a shared workspace). No switching between contexts means no overhead from saving/loading state. The GPU can truly execute multiple things at once, not just pretend to by rapidly switching. WoolyAI server running on the GOPU hosts(nodes) manages allocation of GPU compute cores and VRAM across multiple workloads at runtime according to priority definied for the workload, to maximize the overall GPU utilization at all times. This results in more workloads per GPU.

## Wooly Instruction Set (WIS)

The Wooly Instruction Set are created by the WoolyAI Client and sent to the WoolyAI Server for execution. They are a set of instructions that the WoolyAI Server can understand and execute on the GPU, no matter the GPU vendor or architecture.
