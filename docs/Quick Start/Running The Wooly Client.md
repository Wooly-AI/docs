---
sidebar_position: 2
slug: /running-the-woolyai-client
---

### Prerequisites

- A Wooly Controller URL (optional if your environment only consist of one GPU).
    - A direct connection to the GPU node running the WoolyAI Server is possible.
- Docker installed on the machine where you will run the Wooly client ML container.
- A fast connection to the GPU nodes running the WoolyAI Server. Typically, you'll want to run client containers on the same network as the GPU nodes running the WoolyAI Servers.
- Decide if you need Pytorch 2.7 or 2.9. You can find the supported versions on our [dockerhub](https://hub.docker.com/r/woolyai/client/tags).

***Note-*** vLLM, Ollama and other inference servers can't currently run inside the WoolyAI Client ML container. We are adding support for these soon. Contact us if this is a blocker for you to start your trial.

***Note-*** When you run your Pytorch project for the first time, there is compilation that happens to compile the CUDA kernels into hardware-agnostic Wooly Instruction set(IR). You wil notice a delay in execution. This is only a one-time delay.

### Setup

1. Create a directory for the client data on the host. If not using `-u root` to exec into the container, the directory must be either owned by 1005:1005 or have permissions 777.

    ```bash
    mkdir woolyai-client-data
    chown 1005:1005 woolyai-client-data # or chmod 777 if you cannot use 1005
    ```

2. Create the client config `client-config.toml` to mount into the container, or, edit the existing default config file at `~/.config/wooly/config` inside the container.

    ```bash
    cat <<EOF > client-config.toml
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
    EOF
    ```

4. Update the ADDRESS and PORT if necessary. Keep it default if you are running on the same machine as the WoolyAI Server.

3. Start the Client Container from the data directory.

    ```bash
    # remove any existing container with the same name
    docker rm -f "$(whoami)-woolyai-client" || true

    cd woolyai-client-data

    # If needed, add: -v "$(pwd)/../client-config.toml:/home/ubuntu/.config/wooly/config:ro" \

    # run the container
    docker run -dit \
        --restart unless-stopped \
        --workdir /host \
        --network=host \
        --pull always \
        --shm-size=2g \
        --name "$(whoami)-woolyai-client" \
        -v "$(pwd)":"/host" \
        "woolyai/client:pytorch2.9-latest"

    # access the container
    ## -u root is also available, otherwise the default user/group is ubuntu (1005:1005)
    docker exec -it "$(whoami)-woolyai-client" bash
    ```
4. You can start running your Pytorch projects inside this container. ***You don't need to install Pytorch. The container comes with Pytorch***. Install your dependencies, bring your pytorch scripts and execute them without any changes.

## FAQ

- Run your existing Pytorch scripts, Jupyter Notebook and other ML workloads inside the WoolyAI Client Container
- ***Multi GPU execution*** is supported. Edit the GPU_COUNT variable in the client config in your container for distributed execution across GPUs.
- Run Client containers on CPU only machines or on machines with GPU.
- When running Client Container on remotely connected CPU only machines and with kernels executing on remote GPU, the model weights are transferred over the network to the GPU VRAM and also the commands(kernel) to run on model weights.
- Set the PRIO flag in the config file to assign a priority from 0 (highest priority) to 4 (lowest priority) for execution on a shared GPU pool. WoolyAI server uses the PRIO value to determine priority while allocating GPU compute core and VRAM resources for when there are concurrent jobs running on the same GPU. WoolyAI Controller uses PRIO value to schedule the Client request across GPU nodes.

