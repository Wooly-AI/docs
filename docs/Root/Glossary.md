---
sidebar_position: 100
slug: /glossary
---

## GPU Concurrency

### Time slicing

Each workload gets the GPU for a fixed time window (e.g., workload A runs for 100ms, then workload B runs for 100ms, back to A, etc.). The GPU switches between them.

### MIG (Multi-Instance GPU)

Physically partitions the GPU into fixed segments (e.g., split an A100 into 4 smaller "GPUs"). Each segment is locked to that size even if it's not fully used.

### MPS (Multi-Process Service)

Tools or services that utilize Multi-process service (MPS) features of Nvidia are constrained due to MPS challenges in the areas of error containment and execution resource provisioning for Quality of Service (QoS). This prevents true efficient utilization of GOU across heterogeneous concurrent workloads with QOS management. Better than time slicing but still has limitations in how it shares resources.

These methods create rigid boundaries. If workload A only needs 30% of its allocated resources, the other 70% sits idle—workload B can't use it.

### WoolyAI's Solution for GPU Concurrency

Wooly runs all workloads in the same GPU context (think of it like a shared workspace). No switching between contexts means no overhead from saving/loading state. The GPU can truly execute multiple things at once, not just pretend to by rapidly switching.