---
slug: /client/vram-overcommit
---

VRAM Overcommit is a feature that allows you to overcommit the VRAM of the GPU. This is useful to place more jobs per GPU and reduce GPU idle cycles.

All existing GPU orchestration solutions today treat VRAM as a hard placement constraint. If a job declares it needs 40 GB of VRAM, the scheduler looks for a GPU with at least that much free memory, and if it does not find one, the job waits or gets placed elsewhere. Even if compute can be shared through MIG or other schemes, placement still tends to be blocked by reserved VRAM.
This leads to a lot of wasted opportunities, because in real workloads not all the memory is equally hot at all times, not all model state is touched continously, jobs are bursty and can be idle between requests. So, some memory can be moved and reclaimed temporarily.

The **vram overcommit** with **smart swapping** manages memory at runtime intelligently. This is done by monitoring active usage by different processes, reclaiming memory from inactive process, swapping cold VRAM state out/in and keeping important process resident based on priorities.


## How to use vram overcommit

1. Set the `WOOLYAI_VRAM_OVERCOMMIT` environment variable to `true` in the WoolyAI Client configuration file.

```bash
WOOLYAI_VRAM_OVERCOMMIT = 1
```

---
