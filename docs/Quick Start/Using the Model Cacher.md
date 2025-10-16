---
sidebar_position: 2
slug: /using-the-model-cacher
---

# WoolyAI GPU VRAM Model Cacher (GPU VRAM DeDup feature)

The Model Cacher is a tool that allows you to cache models on the GPU VRAM running the Wooly Server so that any Wooly Client kernel executions that load the identical model,s can share the cached model.
This eliminates duplicate consumption of GPU VRAM for identical models, making it available to load more models and execute more jobs.

### Prerequisites

- A Wooly Server
- Python installed on the Wooly Server host machine

### Setup

1. Download the latest version of the Model Cacher from the [WoolyAI GitHub Releases](https://github.com/WoolyAI/model-cacher/releases).
1. Install the wheel file using `pip install <path to the wheel file>`.

### Usage

The model cacher may need to be modified to match the model you are trying to cache. This is done post-install, under the `~/.local/lib/python3.10/site-packages/woolyai_model_cacher/cli.py` (path may vary).

```
def compute_hashes_from_source(source: str, dtype_name: Optional[str]) -> list[str]:
    import torch

    torch_dtype = _resolve_torch_dtype(dtype_name)
    kwargs = {"torch_dtype": torch_dtype} if torch_dtype is not None else {}
    model = AutoModelForCausalLM.from_pretrained(source, **kwargs) <----------- This line
```


```bash
$ woolyai-model-cacher --help
usage: woolyai-model-cacher [-h] [--root ROOT] {list,add,delete} ...

Manage per-model chunk SHA1 hashes for WoolyAI models.

positional arguments:
  {list,add,delete}
    list             list models and number of hashes
    add              compute & store hashes (overwrites)
    delete           delete whole model file or all models

options:
  -h, --help         show this help message and exit
  --root ROOT        override storage dir (e.g. ./.wooly/shared_mem or
                     /etc/wooly/shared_mem)
```

### List cached models

```bash
woolyai-model-cacher list
```

### Add a model (compute and store hashes)

```bash
woolyai-model-cacher add --source <huggingface-model-id-or-local-path>
woolyai-model-cacher add --source meta-llama/Llama-2-7b-hf --dtype float16
```

### Delete a cached model

```bash
woolyai-model-cacher delete --model <model-name>
woolyai-model-cacher delete --all  # delete all cached models
```

### Specify a custom location for the model cache

```bash
woolyai-model-cacher --root <custom-root-directory> add --source <huggingface-model-id-or-local-path>
```