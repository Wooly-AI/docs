---
sidebar_position: 2
slug: /using-the-vram-model-cache
---

import CodeBlock from '@theme/CodeBlock';

The WoolyAI GPU VRAM Model Cache (GPU VRAM DeDup feature) CLI is a tool that allows you to cache models on the WoolyAI Server's GPU VRAM, so that any WoolyAI Client kernel executions that load the identical models can share the cached model. This eliminates duplicate consumption of GPU VRAM for identical models, making it available to load more models and execute more jobs.

### Prerequisites

- A WoolyAI Server
- Python installed on the WoolyAI Server host machine

### Setup

1. Download the latest version of the Model Cacher from the [WoolyAI Downloads]([https://github.com/WoolyAI/model-cacher/releases](https://downloads.woolyai.com/#vram-model-cache/)).
1. Install the wheel file using `pip install <path to the wheel file>`.

### Usage

The model cacher may need to be modified to match the model you are trying to cache. This is done post-install, under the `~/.local/lib/python3.10/site-packages/woolyai_model_cacher/cli.py` (path may vary).

<CodeBlock language="python" metastring="{6}" showLineNumbers={true}>
{`def compute_hashes_from_source(source: str, dtype_name: Optional[str]) -> list[str]:
    import torch

    torch_dtype = _resolve_torch_dtype(dtype_name)
    kwargs = {"torch_dtype": torch_dtype} if torch_dtype is not None else {}
    model = AutoModelForCausalLM.from_pretrained(source, **kwargs)`}
</CodeBlock>

```bash
$ woolyai-vram-model-cache --help
usage: woolyai-vram-model-cache [-h] [--root ROOT] {list,add,delete} ...

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
woolyai-vram-model-cache list
```

### Add a model (compute and store hashes)

```bash
woolyai-vram-model-cache add --source <huggingface-model-id-or-local-path>
woolyai-vram-model-cache add --source meta-llama/Llama-2-7b-hf --dtype float16
```

### Delete a cached model

```bash
woolyai-vram-model-cache delete --model <model-name>
woolyai-vram-model-cache delete --all  # delete all cached models
```

### Specify a custom location for the model cache

```bash
woolyai-vram-model-cache --root <custom-root-directory> add --source <huggingface-model-id-or-local-path>
```
