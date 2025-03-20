---
sidebar_position: 1
slug: /getting-started/running-your-first-project
---

## Orientation

Wooly is provided currently as a [docker container](https://www.docker.com/resources/what-container/). It contains the Wooly runtime libraries and a CLI.

You can find all available images on [Docker Hub](https://hub.docker.com/r/woolyai/client).

### Your working Environment

Setup your CPU backed Linux environment where you will run the Wooly Client container.

1. **Recommended:** Linux CPU instance (US Virginia Region)
    - Since we are in Beta, GPU resources powering the WoolyAI Acceleration Service are limited and setup only in US Virginia geographic region. For best user experience, we recommend spinning up a CPU instance on a public cloud close to US Virginia region. 
2. **Quick Start:** Local CPU Mac/Windows/Linux laptop
    - Install [Docker] (https://docs.docker.com/desktop/) 
    - Pull and run our Wooly Client Docker Container on your laptop and work with Pytorch projects inside it.

Depending on the model size you wish to run, you will have to start CPU instance with enough RAM (memory optimized). The model is first loaded into the CPU instance/local CPU hardware RAM and then moved to the Wooly AI Acceleration Service GPU.

For models with 7B parameters or more, configure linux CPU instances with minimum 32GB RAM and 4 VCPU for best experience.

If you are working on local CPU hardware (macOS) and running container inside docker, swap space can be increased through Docker Desktop settings. But it is very limited. MacOS will also manage swap space automatically.

Contact us if you have any questions regarding this: [support@woolyai.com](mailto:support@woolyai.com)

### Run the Docker Container

```bash
docker run -itd --pull=always --network=host --name wooly-container -h wooly-client woolyai/client:latest
```

- `--network=host` is used to bind the container to the host network for best performance.
- In order to save the data inside of your container, avoiding losing it when the container is reset, you can use `-v /path/to/your/data/on/host:/home/ubuntu/data` to mount directory and then make sure to write all data to it inside of the container.
- To avoid losing your `pip` installed files, you can use `-v` as well, mounting a host level directory to `/home/ubuntu/.local` inside of the container (where the ubuntu user's pip installs packages).

### Exec into the Container

```bash
docker exec -it wooly-container bash
```

### Log in to the WoolyAI Acceleration Service

```bash
# once attached to bash in the container with docker exec -it wooly-container bash
ubuntu@wooly-client:~$ wooly login
By proceeding, you agree to our Terms & Conditions: https://woolyai.com/terms-and-conditions (enter yes/no): yes
enter your token: 
ping latency to the wooly server is 32.128700 ms
success
```

You'll be prompted to enter your Wooly token. You can obtain a Wooly token by signing up at [https://woolyai.com/get-started/](https://woolyai.com/get-started/).

If this fails, please reach out to [support@woolyai.com](mailto:support@woolyai.com).

### Run a PyTorch Project

"Which GPU should you use?", "Do you have enough resources?" Don't worry about it! WoolyAI Acceleration service takes away the hassles of GPU Resource management. Your token by default has enough Wooly credits attached which lets you run Pytorch projects and utilize GPU resources.

In the Beta, we are powering the service with limited GPU Infrastructure in the backend. This means that really large 70B or greater parameter models need to be quantized to run.

The bash files in `~/examples` directory install all required dependencies and then run the python example code.  Here is an example of running a DeepSeek Pytorch model:

- You'll need to log into huggingface inside of the container first. You can do this with:
    ```bash
    pip install -U "huggingface_hub[cli]"
    huggingface-cli login --token hf_IXXXXXXXXXXXXXXXXX
    ```

- Some of the examples are gated behind an approval process on huggingface. You'll need to go to the model's page and request access from the model owner.

```bash
~/examples/deepseek-ai-DeepSeek-R1-Distill-Qwen-1.5B.bash
+++ dirname /home/ubuntu/examples/deepseek-ai-DeepSeek-R1-Distill-Qwen-1.5B.bash
++ cd /home/ubuntu/examples
++ pwd
+ SCRIPT_DIR=/home/ubuntu/examples
+ cd /home/ubuntu/examples/
+ . ../shared.bash
+ true
+ pip install transformers accelerate
Defaulting to user installation because normal site-packages is not writeable
Collecting transformers
  Downloading transformers-4.49.0-py3-none-any.whl (10.0 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 10.0/10.0 MB 584.6 kB/s eta 0:00:00
Collecting accelerate
  Downloading accelerate-1.4.0-py3-none-any.whl (342 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 342.1/342.1 KB 2.8 MB/s eta 0:00:00
Requirement already satisfied: huggingface-hub<1.0,>=0.26.0 in /home/ubuntu/.local/lib/python3.10/site-packages (from transformers) (0.29.1)
Collecting tokenizers<0.22,>=0.21
  Downloading tokenizers-0.21.0-cp39-abi3-manylinux_2_17_aarch64.manylinux2014_aarch64.whl (2.9 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2.9/2.9 MB 3.2 MB/s eta 0:00:00
Requirement already satisfied: packaging>=20.0 in /home/ubuntu/.local/lib/python3.10/site-packages (from transformers) (24.2)
Requirement already satisfied: filelock in /usr/local/lib/python3.10/dist-packages (from transformers) (3.17.0)
Collecting regex!=2019.12.17
  Using cached regex-2024.11.6-cp310-cp310-manylinux_2_17_aarch64.manylinux2014_aarch64.whl (782 kB)
Requirement already satisfied: requests in /home/ubuntu/.local/lib/python3.10/site-packages (from transformers) (2.32.3)
Collecting safetensors>=0.4.1
  Downloading safetensors-0.5.3-cp38-abi3-manylinux_2_17_aarch64.manylinux2014_aarch64.whl (459 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 459.5/459.5 KB 3.7 MB/s eta 0:00:00
Requirement already satisfied: tqdm>=4.27 in /home/ubuntu/.local/lib/python3.10/site-packages (from transformers) (4.67.1)
Requirement already satisfied: pyyaml>=5.1 in /home/ubuntu/.local/lib/python3.10/site-packages (from transformers) (6.0.2)
Collecting numpy>=1.17
  Using cached numpy-2.2.3-cp310-cp310-manylinux_2_17_aarch64.manylinux2014_aarch64.whl (14.4 MB)
Requirement already satisfied: torch>=2.0.0 in /usr/local/lib/python3.10/dist-packages (from accelerate) (2.6.0)
Collecting psutil
  Downloading psutil-7.0.0-cp36-abi3-manylinux_2_17_aarch64.manylinux2014_aarch64.whl (279 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 279.5/279.5 KB 4.0 MB/s eta 0:00:00
Requirement already satisfied: typing-extensions>=3.7.4.3 in /home/ubuntu/.local/lib/python3.10/site-packages (from huggingface-hub<1.0,>=0.26.0->transformers) (4.12.2)
Requirement already satisfied: fsspec>=2023.5.0 in /usr/local/lib/python3.10/dist-packages (from huggingface-hub<1.0,>=0.26.0->transformers) (2025.2.0)
Requirement already satisfied: jinja2 in /usr/local/lib/python3.10/dist-packages (from torch>=2.0.0->accelerate) (3.1.5)
Requirement already satisfied: networkx in /usr/local/lib/python3.10/dist-packages (from torch>=2.0.0->accelerate) (3.4.2)
Requirement already satisfied: sympy==1.13.1 in /usr/local/lib/python3.10/dist-packages (from torch>=2.0.0->accelerate) (1.13.1)
Requirement already satisfied: mpmath<1.4,>=1.1.0 in /usr/local/lib/python3.10/dist-packages (from sympy==1.13.1->torch>=2.0.0->accelerate) (1.3.0)
Requirement already satisfied: charset-normalizer<4,>=2 in /home/ubuntu/.local/lib/python3.10/site-packages (from requests->transformers) (3.4.1)
Requirement already satisfied: urllib3<3,>=1.21.1 in /home/ubuntu/.local/lib/python3.10/site-packages (from requests->transformers) (2.3.0)
Requirement already satisfied: idna<4,>=2.5 in /home/ubuntu/.local/lib/python3.10/site-packages (from requests->transformers) (3.10)
Requirement already satisfied: certifi>=2017.4.17 in /home/ubuntu/.local/lib/python3.10/site-packages (from requests->transformers) (2025.1.31)
Requirement already satisfied: MarkupSafe>=2.0 in /usr/local/lib/python3.10/dist-packages (from jinja2->torch>=2.0.0->accelerate) (3.0.2)
Installing collected packages: safetensors, regex, psutil, numpy, tokenizers, accelerate, transformers
Successfully installed accelerate-1.4.0 numpy-2.2.3 psutil-7.0.0 regex-2024.11.6 safetensors-0.5.3 tokenizers-0.21.0 transformers-4.49.0
+ cat
+ python3 /tmp/script.py
config.json: 100%|████████████████████████████████████████████████████████████████████████████████████████████████████| 679/679 [00:00<00:00, 1.24MB/s]
model.safetensors: 100%|██████████████████████████████████████████████████████████████████████████████████████████| 3.55G/3.55G [00:40<00:00, 88.1MB/s]
Sliding Window Attention is enabled but not implemented for `sdpa`; unexpected results may be encountered.
generation_config.json: 100%|█████████████████████████████████████████████████████████████████████████████████████████| 181/181 [00:00<00:00, 1.82MB/s]
tokenizer_config.json: 100%|██████████████████████████████████████████████████████████████████████████████████████| 3.07k/3.07k [00:00<00:00, 41.6MB/s]
tokenizer.json: 100%|█████████████████████████████████████████████████████████████████████████████████████████████| 7.03M/7.03M [00:00<00:00, 33.2MB/s]
Device set to use cuda
Generated Response:
[{'generated_text': [{'role': 'user', 'content': 'Who are you?'}, {'role': 'assistant', 'content': "Greetings! I'm DeepSeek-R1, an artificial intelligence assistant created by DeepSeek. I'm at your service and would be delighted to assist you with any inquiries or tasks you may have.\n</think>\n\nGreetings! I'm DeepSeek-R1, an artificial intelligence assistant created by DeepSeek. I'm at your service and would be delighted to assist you with any inquiries or tasks you may have."}]}]
```

***You can also create and run your custom Pytorch projects inside the CPU container. No special configuration is needed***

### Caching

We have both global and private caching on the Wooly AI Acceleration Service, enabling you to run models faster and more efficiently.

- Global caching is available for all users and populated by our team based on the popularity of the models. You can see the list of globally cached models by running `wooly cache global list` inside the container.
- Private caching is available for your account. This is limited to 40GB in size and can be managed by running `wooly cache private usage` and `wooly cache private invalidate` inside the container.

### Final Notes

The container has a specific environment, allowing the Wooly libraries to be prioritized over any others you install. Learn more about the container environment on the [Understanding the Container Environment](./Understanding%20the%20Container%20Environment.md) page.




