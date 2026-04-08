---
slug: /client/vram-overcommit
---

VRAM Overcommit is a feature that allows you to overcommit the VRAM of the GPU. This is useful to place more jobs per GPU and reduce GPU idle cycles.

All existing GPU orchestration solutions today treat VRAM as a hard placement constraint. If a job declares it needs 40 GB of VRAM, the scheduler looks for a GPU with at least that much free memory, and if it does not find one, the job waits or gets placed elsewhere. Even if compute can be shared through MIG or other schemes, placement still tends to be blocked by reserved VRAM.
This leads to a lot of wasted opportunities, because in real workloads not all the memory is equally hot at all times, not all model state is touched continously, jobs are bursty and can be idle between requests. So, some memory can be moved and reclaimed temporarily.

WoolyAI uses a node-level **vram-overcommit-percent** policy to place more workloads per GPU than physical VRAM alone would allow. The WoolyAI Operator or Controller uses this policy at scheduling time, while WoolyAI’s **smart swapping** manages memory residency at runtime to preserve SLA behavior and avoid OOM errors.

## How to use vram overcommit
VRAM Overcommit variable can be set for a GPU node. It is indicated as **vram-overcommit-percent**.

## Smart Swapping
WoolyAI Smart Swapping proactively frees VRAM before large allocation paths to reduce the risk of allocation failure and preserve Priority driven behavior across workloads.
The default setting for all jobs running through WoolyAI software on GPUS is swappable(WOOLYAI_SWAP_FROM_VRAM=1). This means Wooly server can swap cold VRAM state associated with the jobs out/in based on multiple factors like inactive time and priority.

### How Smart Swapping works
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

1. Set the `WOOLYAI_SWAP_FROM_VRAM` environment variable to `false` in the WoolyAI Client configuration file if you want to make the job unswappable.

```bash
WOOLYAI_SWAP_FROM_VRAM = 0
```

---
