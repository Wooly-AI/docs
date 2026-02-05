---
slug: /client/setup
---

### Prerequisites

- A Wooly Controller URL (optional; you can use a direct connection to the GPU node running the WoolyAI Server).
- Docker installed on the machine where you will run you containers. It must have a GPU available to mount into the container.

### Setup

1. Download the latest version of the WoolyAI libraries from [https://github.com/Wooly-AI/woolyai-client-libraries/releases](https://github.com/Wooly-AI/woolyai-client-libraries/releases).

2. Create a directory for the client files to be stored in: `mkdir woolyai-libraries`

3. Alongside of the `woolyai-libraries` directory, create a `client-config.toml` file:

    ```bash
    # PRIO: The priority the task gets on the server (default: 0, which is the highest priority)
    ## Assign a priority from 0 to 4 for execution on a shared GPU pool. WoolyAI server uses the PRIO value to determine priority while allocating GPU compute core and VRAM resources for when there are concurrent jobs running on the same GPU.
    # PRIO = 0
    
    # GPU_COUNT: (Multi-GPU mode) Count of GPUs to execute the client's task across (default: 1)
    # GPU_COUNT = 2
    
    ###################
    # Controller config
    ###################
    
    # Note: If using the controller, you need to disable ADDRESS and PORT in the config
    
    # CONTROLLER_URL: The URL of the controller
    ## When CONTROLLER_URL is commented out, the client will go directly to the server and not use a controller
    ## NOTE CONTROLLER ONLY: Without REQUIRED_VRAM, you'll see "controller assignment failed: failed to parse response JSON: [json.exception.parse_error.101] parse error at line 1, column 5: syntax error while parsing value - invalid literal; last read: '400 B'; expected end of input"
    # CONTROLLER_URL=http://127.0.0.1:8080
    
    # CONTROLLER_NODE_GROUP_IDS: The IDs of the node groups to use for the client
    # CONTROLLER_NODE_GROUP_IDS = nvidia,fast-networking
    
    # REQUIRED_VRAM (required): Required VRAM for the client in MB
    # REQUIRED_VRAM = 50000
    
    # GPU_MODE: This determines if this client request needs exclusive use of the GPU or not (default: Shared)
    ## Do not confuse with Multi-GPU mode (GPU_COUNT). This is to tell the controller whether to allow other tasks to be assigned alongside of it on the same GPU.
    # GPU_MODE = Exclusive
    
    ########################
    # Controller-less config
    ########################
    
    # ADDRESS: The direct server address to use for the client
    ADDRESS = 127.0.0.1
    # PORT: The server port to use for the client
    PORT = 443
    # SSL: The SSL mode to use for the client
    SSL = DISABLE
    
    # GPUS: The GPUs to use for the client on the server
    ## When GPUS is commented out, the client will use a single gpu #0
    # GPUS = 0,1,2
    ```

4. Update the ADDRESS and PORT if necessary. Keep it default if you are running on the same machine as the WoolyAI Server.

3. Start your container, and make sure the folder is mounted properly

    ```bash
    # run the container
    docker run -dit \
        --restart unless-stopped \
        --network=host \
        --pull always \
        --name woolyai-container \
        --gpus all \
        -v "$(pwd)/woolyai-libraries":"/woolyai" \
        -v "$(pwd)/client-config.toml":"/root/.config/wooly/config" \
        nvidia/cuda:12.9.1-cudnn-devel-ubuntu24.04
    ```

4. Exec into the container and set the environment variables for WoolyAI:
    ```bash
    docker exec -it woolyai-container bash
    ```

    ```bash
    export DEBIAN_FRONTEND="noninteractive"
    apt update && apt install -y vim python3 python3-pip
    
    mkdir -p /etc/pip.conf.d
    echo '[global]' > /etc/pip.conf
    echo 'break-system-packages = true' >> /etc/pip.conf
    pip install --index-url https://download.pytorch.org/whl/cu129 'torch>=2.6'
    pip install numpy

    # These exports are required to enable WoolyAI. Otherwise you will be hitting the main server GPU.
    export LD_PRELOAD="/woolyai/libpreload_dlopen.so"
    export LIB_WOOLY_PATH="/woolyai/"
    ```

5. Create a test script (`test.py`):

    ```python
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
    ```

6. Run the test:

    ```bash
    python3 test.py
    Number of GPUs available: 1
    GPU 0: NVIDIA GH200 480GB (WOOLY)
    tensor([1., 1., 1., 1., 1.], device='cuda:0')
    tensor([2., 2., 2., 2., 2.], device='cuda:0')
    tensor([1., 1., 1., 1., 1.], device='cuda:0', dtype=torch.bfloat16)
    tensor([2., 2., 2., 2., 2.], device='cuda:0', dtype=torch.bfloat16)
    tensor([1., 1., 1., 1., 1.], device='cuda:0', dtype=torch.float16)
    tensor([2., 2., 2., 2., 2.], device='cuda:0', dtype=torch.float16)
    ```


## Notes

- When running Client Container on remotely connected CPU only machines and with kernels executing on remote GPU, the model weights are transferred over the network to the GPU VRAM and also the commands(kernel) to run on model weights.
- Set the PRIO flag in the config file to assign a priority from 0 (highest priority) to 4 (lowest priority) for execution on a shared GPU pool. WoolyAI server uses the PRIO value to determine priority while allocating GPU compute core and VRAM resources for when there are concurrent jobs running on the same GPU. WoolyAI Controller uses PRIO value to schedule the Client request across GPU nodes.

