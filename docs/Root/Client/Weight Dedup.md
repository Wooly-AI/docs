---
slug: /client/weight-dedup
---

WoolyAI Model Weight Dedup reduces GPU memory waste by allowing multiple workloads on the same GPU node to share a single VRAM copy of identical model weights.

In conventional GPU environments, each inference process or container typically loads its own copy of model weights into VRAM. When the same base model is used by multiple workloads, this duplicates memory usage and reduces the number of jobs that can be placed on the GPU.
WoolyAI Model Weight Dedup allows multiple workloads running on the same GPU server to share a single physical VRAM copy of identical model weights. Instead of storing duplicate copies for each process, WoolyAI detects that the base weights are the same and maps them once into GPU memory, while each workload keeps its own private runtime state such as KV cache, activations, request context, and any mutable model-specific data.

WoolyAI server module running on GPU nodes detects when multiple workloads are using the same compatible base model weights and keeps one shared read-only copy in the GPU VRAM. Each workload continues to maintain its own private runtime state, including KV cache, activations, request state, and other mutable data.

If three workloads each load the same 24 GB base model, a traditional setup may consume about 72 GB of VRAM for weights alone. With WoolyAI Model Weight Dedup, those workloads can share one 24 GB copy of the base model, reducing memory usage and leaving more VRAM available for active execution state.

**What is shared**
Base model weights
Read-only weight tensors

**What is not shared**
KV cache
Activations
Optimizer state
Temporary buffers
Per-request runtime state
Fine-tuned deltas or mutable overlays

## When to use weight dedup
Multiple inference stacks serving the same base model

Multi-team environments with repeated model families

LoRA-style deployments where the base model is shared and only lightweight task-specific state differs
  
## How to use weight dedup
**note** - Don't tunr on this feature for jobs that update mode weights like tuning, pre and post training.
1. Set the `WOOLYAI_WEIGHTS_DEDUP` environment variable to `true` in the WoolyAI Client/job configuration file to enable this job to use shared weights if it's already loaded in the VRAM.

---
