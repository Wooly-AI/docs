---
slug: /client/vram-overcommit
---

VRAM Overcommit is a feature that allows you to overcommit the VRAM of the GPU. This is useful to place more jobs per GPU and reduce GPU idle cycles.

All existing GPU orchestration solutions today treat VRAM as a hard placement constraint. If a job declares it needs 40 GB of VRAM, the scheduler looks for a GPU with at least that much free memory, and if it does not find one, the job waits or gets placed elsewhere. Even if compute can be shared through MIG or other schemes, placement still tends to be blocked by reserved VRAM.

This leads to a lot of wasted opportunities, because in real workloads not all the memory is equally hot at all times, not all model state is touched continously, jobs are bursty and can be idle between requests. So, some memory can be moved and reclaimed temporarily.

## Smart Swapping

WoolyAI Smart Swapping proactively frees VRAM before large allocation paths to reduce the risk of allocation failure and preserve Priority driven behavior across workloads.
The default setting for all jobs running through WoolyAI software on GPUS is swappable (`WOOLYAI_SWAP_FROM_VRAM=1`). This means Wooly server can swap cold VRAM state associated with the jobs out/in based on multiple factors like inactive time and priority.

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

## How to Use VRAM Overcommit

By default, swap is enabled for WoolyAI clients. You can set `WOOLYAI_SWAP_FROM_VRAM` to `0` in the [client configuration](/client/setup) if you want to disable swap for that workload (non-operator deployments).

**Choose one deployment model:** VRAM overcommit is configured differently on **Kubernetes with the WoolyAI GPU Operator** than on **bare metal / Docker with the WoolyAI Controller**. They are separate products.

### WoolyAI GPU Operator (Kubernetes)

Use this path when workloads run as pods scheduled by the WoolyAI GPU Operator stack.

[Operator README (GitHub)](https://github.com/Wooly-AI/woolyai-gpu-operator/blob/main/README.md)

**What the percentage means:** extra schedulable VRAM headroom per GPU (for swappable workloads). For example, `0` = physical VRAM only; `20` ≈ up to 120% of total VRAM; `50` ≈ up to 150%.

**Cluster default overcommit**

- Helm: `controller.clusterOvercommitPercent`
- Or CRD: `ClusterGPUPolicy.spec.defaultVramOvercommitPercent`

**Per-node override**

- CRD: `WoolyNodePolicy.spec.vramOvercommitPercent`
- Or node label: `woolyai.com/vram-overcommit-percent=<value>`

**Per-pod swap (Kubernetes)**

- Annotation: `woolyai.com/swap-from-vram: "true"` (default) or `"false"`
- Keep `woolyai.com/pod-vram` set so the scheduler can evaluate VRAM fit.

Admission injects `WOOLYAI_SWAP_FROM_VRAM` from that annotation—prefer the annotation over manually setting the env var in the pod spec.

The **WoolyAI server** DaemonSet on GPU nodes may also receive **`WOOLYAI_VRAM_OVERCOMMIT_PERCENT`** from the operator (derived from cluster/node policy). Scheduler placement still follows the labels and annotations above.

```yaml
metadata:
  labels:
    gpu-runtime: woolyai
  annotations:
    woolyai.com/pod-vram: "16Gi"
    woolyai.com/swap-from-vram: "false"
```

```bash
helm upgrade woolyai charts/woolyai-gpu-operator \
  --namespace woolyai-system \
  --reuse-values \
  --set controller.clusterOvercommitPercent=30

kubectl label node <gpu-node> woolyai.com/vram-overcommit-percent=50 --overwrite
```

### WoolyAI Controller (non-Kubernetes routing)

Use this path when clients and servers connect to the **standalone WoolyAI Controller** (Docker or Kubernetes deployment from the [controller setup](/controller/setup) guide). Overcommit is stored in the controller and applied when the controller schedules tasks onto registered GPU nodes.

**Global default**

- **Controller container env:** `CONTROLLER_DEFAULT_VRAM_OVERCOMMIT_PERCENT` — default `0`; valid `0`–`1000`. Used only until configuration is first persisted to etcd; see [Controller setup — VRAM overcommit](/controller/setup#vram-overcommit-and-swap-controller).
- `GET /api/v1/config` — read `default_vram_overcommit_percent`
- `PUT /api/v1/config` — set `default_vram_overcommit_percent` (integer `0`–`1000`, which is a percentage)

**Per-node override**

- `PUT /api/v1/nodes/{node_id}/config` with JSON field `overcommit_vram_percent`
- `null` / omit on the node: use the global default; `0` forces no overcommit on that node

**Per-task swap mode**

- When submitting a task, set `noswap`: `0` = swappable (default), `1` = require physical VRAM only (no overcommit headroom for placement)

Full REST examples and UI notes: [Set up the Controller — VRAM overcommit](/controller/setup#vram-overcommit-and-swap-controller).

---
