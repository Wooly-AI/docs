---
slug: /usage-guides/slurm
title: Slurm
---

# Slurm usage guide

This is the minimum setup to run Wooly on Slurm.

- Slurm controls placement and VRAM accounting.
- WoolyAI Server controls runtime GPU sharing.
- Admins configure nodes once; users submit normal `sbatch` jobs with Wooly opt-in.

Use `woolyai_vram`, node features + `--constraint`, and `wooly-client-config.toml` (optional `GPUS`) for capacity planning. Do **not** treat `CUDA_VISIBLE_DEVICES` as Wooly server-side assignment.

## Prerequisites

- Slurm with GPU scheduling configured for your site.
- NVIDIA drivers on GPU nodes.
- Docker (or equivalent runtime) for WoolyAI Server.
- WoolyAI license + server image. See [Set up the WoolyAI Server](/server/setup).

Recommended: keep Wooly nodes in dedicated partitions or dedicated node features.

## 1. Configure `woolyai_vram` GRES

For Wooly queues, use a VRAM pool (`woolyai_vram`) instead of exclusive per-device `gpu` GRES.

**Admin**

1. Add `woolyai_vram` to `GresTypes` in `slurm.conf`:

   ```text
   GresTypes=gpu,woolyai_vram
   ```

2. On each Wooly node, define the pool in `gres.conf`:

   ```text
   AutoDetect=nvml
   Name=woolyai_vram Count=120000
   ```

   - `Count` is total schedulable MiB on that node.
  
3. Run `slurmd -C` and merge reported `Gres=` values into `NodeName=` lines if required by your Slurm version.

  ```text
  NodeName=spark-befc NodeAddr=99.87.000.00 State=UNKNOWN CPUs=20 Boards=1 SocketsPerBoard=1 CoresPerSocket=20 ThreadsPerCore=1 RealMemory=124610 Gres=woolyai_vram:120000
  NodeName=spark-1977 NodeAddr=99.87.000.00 State=UNKNOWN CPUs=20 Boards=1 SocketsPerBoard=1 CoresPerSocket=20 ThreadsPerCore=1 RealMemory=124610 Gres=woolyai_vram:120000
  ```

4. Reload Slurm:

   ```bash
   scontrol reconfigure
   ```

   Restart `slurmd` if needed.

**Users**

- Request VRAM with `--gres=woolyai_vram:<MiB>` (example: `--gres=woolyai_vram:40000`).
- Do **not** set `WOOLYAI_RESERVED_VRAM_MIB` manually; TaskProlog should derive it from the allocation.

### Require minimum host GPU count (optional)

If a workload needs at least N physical GPUs on the host (for example NCCL) without exclusive `--gres=gpu:N`:

- Admins define features such as `woolyai_gpu_count_1`, `woolyai_gpu_count_2`.
- Users set `#SBATCH --constraint=woolyai_gpu_count_2` and still request `--gres=woolyai_vram:...`.

## 2. Run WoolyAI Server on each Wooly GPU node

On every Wooly node:

1. Deploy WoolyAI Server per [Set up the WoolyAI Server](/server/setup).
2. Expose all GPUs Slurm should make available to Wooly (or your approved subset) via Docker `--gpus` or equivalent.
3. Ensure host batch jobs can reach the server address/port from `woolyai-server-config.toml` (for example host networking or published ports).

Run the server as a persistent node service (daemon/systemd), not inside each `sbatch` job, unless your site intentionally uses per-job server lifecycle.

## 3. Install Wooly client libraries on each Wooly GPU node

Admins install once on each Wooly node before users run jobs.

1. Follow [Install WoolyAI Client Libraries](/client/setup) on the node through creation of `wooly-client-config.toml` (no Slurm-side Docker client container required).
2. Recommended paths:
   - libs: `/usr/local/lib/woolyai`
   - config: `/usr/local/etc/`

## 4. Inject environment with `TaskProlog`

Use `TaskProlog` to inject Wooly env vars only for opted-in jobs.

Key behavior:
- `TaskProlog` runs for every task step.
- Slurm applies only stdout lines formatted as `export NAME=value`.
- Plain `export` in the script shell is not enough.
- Send logs/errors to stderr.

Users opt in with:

```bash
#SBATCH --export=ALL,USE_WOOLY=1
```

Users still request `--gres=woolyai_vram:<MiB>`; TaskProlog maps that allocation to `WOOLYAI_RESERVED_VRAM_MIB`.

1. Install a root-owned script (example path):

   ```text
   /usr/local/bin/woolyai-task-prolog.sh
   ```

   ```bash
   chmod 755 /usr/local/bin/woolyai-task-prolog.sh
   ```

2. Set `TaskProlog` in `slurm.conf` with a full path:

   ```text
   TaskProlog=/usr/local/bin/woolyai-task-prolog.sh
   ```

   If only some nodes are Wooly nodes, apply this only there.

3. Example script:

```bash
#!/usr/bin/env bash
set -eo pipefail

if [[ "${USE_WOOLY:-}" != "1" ]]; then
  exit 0
fi

if [[ -z "${SLURM_JOB_ID:-}" ]] || ! command -v scontrol >/dev/null 2>&1; then
  echo "ERROR: cannot resolve woolyai_vram allocation (missing SLURM_JOB_ID or scontrol)." >&2
  exit 1
fi

allocated_job_line=$(scontrol show job "${SLURM_JOB_ID}" -o 2>/dev/null || true)
requested_woolyai_vram_mib=""
if [[ "${allocated_job_line}" =~ AllocTRES=[^[:space:]]*gres/woolyai_vram[:=]([0-9]+) ]]; then
  requested_woolyai_vram_mib="${BASH_REMATCH[1]}"
elif [[ "${allocated_job_line}" =~ TresPerNode=[^[:space:]]*gres/woolyai_vram[:=]([0-9]+) ]]; then
  requested_woolyai_vram_mib="${BASH_REMATCH[1]}"
fi

if [[ -z "${requested_woolyai_vram_mib}" ]]; then
  echo "ERROR: woolyai_vram allocation not found for job ${SLURM_JOB_ID}; refusing to run without WOOLYAI_RESERVED_VRAM_MIB." >&2
  exit 1
fi

echo "export WOOLYAI_RESERVED_VRAM_MIB=${requested_woolyai_vram_mib}"
echo "export WOOLYAI_DEBUG=${WOOLYAI_DEBUG:-}"
echo "export WOOLYAI_CLIENT_CONFIG=/usr/local/etc/wooly-client-config.toml"
echo "export LD_PRELOAD=/usr/local/lib/libpreload_dlopen.so"
echo "export LIB_WOOLY_PATH=/usr/local/lib"
```

4. Reload/restart `slurmd` after TaskProlog changes.

Reference: [Slurm Prolog and Epilog Guide](https://slurm.schedmd.com/prolog_epilog.html).

If your site does not use TaskProlog, use modules or SPANK to inject the same required vars:
- `WOOLYAI_RESERVED_VRAM_MIB`
- `WOOLYAI_CLIENT_CONFIG`
- `LD_PRELOAD`
- `LIB_WOOLY_PATH`

## Example batch script

```bash
#!/bin/bash
#SBATCH --job-name=wooly-test
#SBATCH --partition=dgx
#SBATCH --nodelist=spark-befc
#SBATCH --export=ALL,USE_WOOLY=1,WOOLYAI_DEBUG=1
#SBATCH --nodes=1
#SBATCH --ntasks=1
# Requires woolyai_vram in GresTypes + gres.conf on the node; see automation/guides/slurm/README.md
#SBATCH --gres=woolyai_vram:40000
# Optional: multi-GPU host (NCCL), if admins set Feature=woolyai_gpu_count_2 on those nodes
# #SBATCH --constraint=woolyai_gpu_count_2
#SBATCH --time=01:00:00
#SBATCH --output=/tmp/slurm-gpu-test-%j.out

# Submit from a cluster login node, e.g.:
#   sbatch /path/to/test-wooly.sbatch
#
# TaskProlog should set WOOLYAI_RESERVED_VRAM_MIB from the allocated woolyai_vram GRES
# (see docs Usage Guides / Slurm). Do not pass WOOLYAI_RESERVED_VRAM_MIB in --export.

set -euo pipefail

python3 -m venv woolyai-venv || true
source woolyai-venv/bin/activate
pip install --index-url https://download.pytorch.org/whl/cu129 'torch>=2.6'
pip install numpy

# wooly-client-config.toml GPUS (optional) targets server GPU indices.

echo "=== Wooly + Slurm GPU sanity check ==="
echo "Job ID:        ${SLURM_JOB_ID:-}"
echo "Node:          ${SLURMD_NODENAME:-}"
echo "Partition:     ${SLURM_JOB_PARTITION:-}"
echo "CPUs on node:  ${SLURM_CPUS_ON_NODE:-}"
echo "USE_WOOLY:     ${USE_WOOLY:-unset}"
echo "WOOLYAI_RESERVED_VRAM_MIB: ${WOOLYAI_RESERVED_VRAM_MIB:-unset}"
echo "================================================"

if ! command -v nvidia-smi >/dev/null 2>&1; then
  echo "ERROR: nvidia-smi not found. Install NVIDIA drivers on compute nodes or use a GPU image."
  exit 1
fi

python3 <<'PY'
import torch
import math

print(f"Number of GPUs available: {torch.cuda.device_count()}")
for i in range(torch.cuda.device_count()):
    print(f"GPU {i}: {torch.cuda.get_device_name(i)}")


def add(dtype):
    device = torch.device("cuda:0")
    x = torch.ones(5, device=device, dtype=dtype)
    y = torch.ones(5, device=device, dtype=dtype)
    r = x + y
    print(x)
    print(torch.abs(r))


add(torch.float)
add(torch.bfloat16)
add(torch.half)
PY
```

With TaskProlog in place, job scripts do not need to set `LD_PRELOAD`, `LIB_WOOLY_PATH`, or `WOOLYAI_CLIENT_CONFIG`.

If jobs run in Apptainer/Singularity, ensure those same libs/config are visible inside the container (baked in or bind-mounted). Do not install client libs during job runtime.

### Slurm cgroups/device policy note

Wooly server-side assignment is not based on `CUDA_VISIBLE_DEVICES`.

Slurm may still enforce device cgroups depending on partition policy and classic `gpu` GRES usage. Document this policy for Wooly nodes separately from `woolyai_vram` scheduling.

### Optional integrations

- Cluster `Prolog`/`Epilog` (not `TaskProlog`) for root-level node checks, logging, or cleanup.
- WoolyAI Controller routing (`CONTROLLER_URL` and related client fields) per [client setup](/client/setup).
