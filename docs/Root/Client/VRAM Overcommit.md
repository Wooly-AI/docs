---
slug: /client/vram-overcommit
---

VRAM Overcommit is a feature that allows you to overcommit the VRAM of the GPU. This is useful to place more jobs per GPU and reduce GPU idle cycles.

All existing GPU orchestration solutions today treat VRAM as a hard placement constraint. If a job declares it needs 40 GB of VRAM, the scheduler looks for a GPU with at least that much free memory, and if it does not find one, the job waits or gets placed elsewhere. Even if compute can be shared through MIG or other schemes, placement still tends to be blocked by reserved VRAM.
This leads to a lot of wasted opportunities, because in real workloads not all the memory is equally hot at all times, not all model state is touched continously, jobs are bursty and can be idle between requests. So, some memory can be moved and reclaimed temporarily.

WoolyAI uses a node-level **vram-overcommit-percent** policy to place more workloads per GPU than physical VRAM alone would allow. The WoolyAI Operator or Controller uses this policy at scheduling time, while WoolyAI’s **smart swapping** manages memory residency at runtime to preserve SLA behavior and avoid OOM errors.

## How to use vram overcommit
VRAM Overcommit variable can be set for a GPU node. It is indicated as **vram-overcommit-percent**.
The default setting for all jobs running through WoolyAI software on GPUS is swappable(WOOLYAI_SWAP_FROM_VRAM=1). This means Wooly server can swap cold VRAM state associated with the jobs out/in based on multiple factors like inactive time and priority.

1. Set the `WOOLYAI_SWAP_FROM_VRAM` environment variable to `false` in the WoolyAI Client configuration file if you want to make it unswappable.

```bash
WOOLYAI_SWAP_FROM_VRAM = 0
```

---
