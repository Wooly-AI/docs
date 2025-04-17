---
sidebar_position: 3
---

For the Wooly Client Container, we provide a docker image that includes the Wooly runtime libraries and a CLI. Think of this container as **drop-in replacement for your Pytorch CUDA environment with CUDA abstration capability**.

You will enter your container as the `ubuntu` user. It does have `sudo` access, but we recommend you do not use it for anything outside of installing `apt` packages. 

**Please do not overwrite the python3 installation with a newer version.**

### Python

The container has Python 3.10 installed at `/usr/bin/python3`.

We set `PYTHONPATH` inside of the container to prioritize the Wooly libraries. Here is an example: `PYTHONPATH=/usr/local/lib/python3.10/dist-packages/:/home/ubuntu/.local/lib/python3.10/site-packages/`. This allows you to install any other packages into `.local` (with the `ubuntu` user and `pip install`) and not overwrite the Wooly libraries needed for things to work properly.

**Please, do not change the order or modify packages under `/usr/local/lib/python3.10/dist-packages/`.**

Note: For stable diffusion webui, you will need to uninstall the `numpy` 2.x that we install by default so that the webui.sh can install the 1.x version needed. We install `packaging` `wheel` `setuptools` `pyyaml` `numpy` and `typing_extensions` by default. These are installed into `.local` so you can change them as needed.

### The Wooly CLI

The wooly binary is available by typing `wooly` in the container shell.

```bash
Wooly-AI CLI | Version 0.1.0
Usage:
  wooly login - log in to the wooly server
  wooly credits - show available credits
  wooly cache global list - list globally cached models
  wooly cache global on|off - enable/disable global cache
  wooly cache private usage - private cache usage
  wooly cache private invalidate - invalidate private cache
  wooly cache private on|off - enable/disable private cache
  wooly ping - test latency to the wooly server
  wooly version - show client version
  wooly help - show this help message
```

Important commands:

- `wooly login` - This will prompt you to enter your Wooly token and then ensure you can connect to the Wooly server.
  
- `wooly credits` - This will show you how many wooly credits you have left on your account. When you run models, Wooly credits are deducted against your actual GPU core and RAM usage.

- `wooly cache global list` - This will list all the models that are cached globally on the Wooly server in the Acceleration service backend. We cache some popular models in the global cache to reduce bandwidth usage transferring these models from the CPU RAM to the Wooly service GPU over the network.

    ```
    ubuntu@wooly-client:~$ wooly cache global list
    mistralai/Mistral-7B-Instruct-v0.3
    deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B
    deepseek-ai/deepseek-coder-1.3b-instruct
    databricks/dolly-v2-3b
    databricks/dolly-v2-7b
    llava-hf/llava-1.5-7b-hf
    meta-llama/Llama-3.2-3B-Instruct
    openai/whisper-large-v3
    sentence-transformers/all-MiniLM-L6-v2
    ```
  
- `wooly cache global on|off` - This will enable or disable your container's use of the global cache.
  
- `wooly cache private usage` - This will show you how much private cache you are using in MB. Every user is provided with 40GB of private cache where the models are cached on a first come first basis, if the private cache is enabled. When a user executes a model that is already cached in the private cache, then the service first looks for that model in the private cache first before transferring from the CPU instance to Wooly service GPU backend.
  
- `wooly cache private invalidate` - This will invalidate/flush the private cache. By default you'll have a limit of 40GB.
  
- `wooly cache private on|off` - This will enable or disable private caching of the models you run on your container.
  
- `wooly ping` - This will test the latency to the Wooly server.
  
- `wooly version` - This will show the version of the Wooly CLI.




