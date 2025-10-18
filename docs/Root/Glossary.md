---
sidebar_position: 100
slug: /glossary
---

## GPU Concurrency Approaches

### Time slicing

Each workload gets the GPU for a fixed time window (e.g., workload A runs for 100ms, then workload B runs for 100ms, back to A, etc.). The GPU switches between them.

### MIG (Multi-Instance GPU)

Physically partitions the GPU into fixed segments (e.g., split an A100 into 4 smaller "GPUs"). Each segment is locked to that size even if it's not fully used.

### MPS (Multi-Process Service)

NVIDIA's CUDA Multi-Process Service (MPS) enables multiple co-operative processes to share GPU compute resources. While primarily designed for MPI applications that work together, MPS has also been adopted for sharing GPU resources between independent applications, though this introduces certain limitations. MPS lacks error isolation between clients, meaning issues in one client can affect others. Although streaming multiprocessors (SMs) can be optionally capped to a percentage per MPS client, the underlying scheduling hardware remains shared across all clients. Additionally, memory bandwidth, cache, and memory capacity are shared resources among all MPS clients.

It also has configuration requirements that make it a bit cumbersome to use and adapt.

### WoolyAI's Solution for GPU Concurrency

Wooly runs all workloads in the same GPU context (think of it like a shared workspace). No switching between contexts means no overhead from saving/loading state. The GPU can truly execute multiple things at once, not just pretend to by rapidly switching.

## Wooly Instruction Set (WIS)

The Wooly Instruction Set are created by the WoolyAI Client and sent to the WoolyAI Server for execution. They are a set of instructions that the WoolyAI Server can understand and execute on the GPU, no matter the GPU vendor or architecture.