---
slug: /client/vram-overcommit
---

VRAM Overcommit is a feature that allows you to overcommit the VRAM of the GPU. This is useful to place more jobs per GPU and reduce GPU idle cycles.

All existing GPU orchestration solutions today treat VRAM as a hard placement constraint. If a job declares it needs 40 GB of VRAM, the scheduler looks for a GPU with at least that much free memory, and if it does not find one, the job waits or gets placed elsewhere. Even if compute can be shared through MIG or other schemes, placement still tends to be blocked by reserved VRAM.

This leads to a lot of wasted opportunities, because in real workloads not all the memory is equally hot at all times, not all model state is touched continously, jobs are bursty and can be idle between requests. So, some memory can be moved and reclaimed temporarily.

### Smart Swapping

WoolyAI Smart Swapping proactively frees VRAM before large allocation paths to reduce the risk of allocation failure and preserve Priority driven behavior across workloads.
The default setting for all jobs running through WoolyAI software on GPUS is swappable (`WOOLYAI_SWAP_FROM_VRAM=1`). This means Wooly server can swap cold VRAM state associated with the jobs out/in based on multiple factors like inactive time and priority.

#### How Smart Swapping works

**Preemptive swapping**
Before attempting a large GPU memory allocation, WoolyAI may trigger **preemptive swap**. This happens before the allocation is allowed to fail, so the runtime can maintain a fixed safety reserve of **2 GiB of VRAM(configurable)** on the node.

**Idle task eligibility**
A workload becomes eligible for swap-out if it has not used the GPU for a configured idle period. In the current policy, a task on `swap0` may be swapped out after **5 minutes of inactivity**.

**Priority-aware swap policy**
WoolyAI uses priority-aware swap selection:

* **Non-P0 tasks** are preferred swap candidates.
* A **P0** task will only preempt another **P0** task if there are no eligible non-P0 tasks available to swap.

This ensures that the highest-priority workloads are protected as much as possible while still allowing the system to recover memory under pressure.

**Fairness in swap selection**
Among eligible swap candidates, WoolyAI applies a **fairness algorithm** to avoid repeatedly selecting the same task when other comparable candidates exist.

* a swapped non-P0 task should not be selected again immediately if other eligible non-P0 tasks have not yet been swapped
* swap pressure is spread across eligible workloads rather than concentrated on a single task

This reduces starvation and helps maintain more predictable behavior across multi-tenant workloads.

## How to Use VRAM Overcommit

By default, the VRAM Overcommit is enabled in every WoolyAI Client. You can set the `WOOLYAI_SWAP_FROM_VRAM` environment variable to `0` in the WoolyAI Client configuration file if you want to disable the VRAM Overcommit.

### WoolyAI GPU Operator

[Official Documentation](https://github.com/Wooly-AI/woolyai-gpu-operator/blob/main/README.md)

WoolyAI uses a node-level **vram-overcommit-percent** policy to place more
workloads per GPU than physical VRAM alone would allow. In practice, the
percentage is extra schedulable headroom per GPU:

- `0` means no extra headroom (strict physical VRAM).
- `20` means scheduler can use up to `120%` of total VRAM for swappable jobs.
- `50` means scheduler can use up to `150%`, and so on.

The operator applies this policy at scheduling time, while WoolyAI Smart
Swapping manages memory residency at runtime.

When running on the WoolyAI GPU Operator, configure this in Kubernetes metadata.

1. Set per-workload swap behavior with pod annotation:
   - `woolyai.com/swap-from-vram: "true"` (default; no need to set it explicitly + swappable)
   - `woolyai.com/swap-from-vram: "false"` (not swappable)
2. Set overcommit policy on nodes with label:
   - `woolyai.com/vram-overcommit-percent=<value>`
3. Keep `woolyai.com/pod-vram` set on the pod so scheduler can evaluate VRAM fit.
4. (Optional, non-operator/manual workflows) You can still use
   `WOOLYAI_SWAP_FROM_VRAM=0|1` on the client side, but in operator-managed pods
   the recommended control is the pod annotation above.

Example pod annotations:

```yaml
metadata:
  labels:
    gpu-runtime: woolyai
  annotations:
    woolyai.com/pod-vram: "16Gi"
    woolyai.com/swap-from-vram: "false"
```

> Note: with the operator, admission injects `WOOLYAI_SWAP_FROM_VRAM` from
> `woolyai.com/swap-from-vram`, so you should set the annotation instead of
> manually adding the env var in pod spec.

### WoolyAI Controller

[Official Documentation](/controller/setup)

WoolyAI Controller is a component that manages the WoolyAI Client. It is responsible for managing the WoolyAI Client and the WoolyAI Server.

WoolyAI Controller uses a node-level **vram-overcommit-percent** policy to place more workloads per GPU than physical VRAM alone would allow. In practice, the percentage is extra schedulable headroom per GPU:

- `0` means no extra headroom (strict physical VRAM).
- `20` means scheduler can use up to `120%` of total VRAM for swappable jobs.
- `50` means scheduler can use up to `150%`, and so on.
---
