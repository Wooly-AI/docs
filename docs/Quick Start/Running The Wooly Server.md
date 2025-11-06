---
sidebar_position: 2
slug: /running-the-woolyai-server
---

### Prerequisites

- A host machine with a compatible GPU (NVIDIA or AMD currently)
- A license.json file. You can get it from https://woolyai.com/signup/
- Docker installed on the GPU host machine.
- Choose the proper docker image for your GPU vendor:
    - NVIDIA: `woolyai/server:nvidia-latest` (x86_64 & aarch64)
    - AMD: `woolyai/server:amd-latest` (x86_64)

### Setup

1. Create a directory for the server VRAM cache

```bash
mkdir woolyai-server-vram-cache
```

2. Create the server config file: `woolyai-server-config.toml`:
```toml
[SERVER]

LISTEN_ADDR = tcp::443
# Optional SSL endpoint. Uncomment after placing certfile.pem in working dir.
# LISTEN_ADDR = ssl::443
# SSL_CERT_FILE = certfile.pem
# SSL_KEY_FILE = certfile.pem

########################
# Controller integration (leave blank if not using a controller).
########################
## Note: You can comma separate multiple controller URLs
# CONTROLLER_NATS_URL = nats://localhost:4222
# NODE_NAME must be unique across all nodes in the cluster
# NODE_NAME = my-node
# NODE_ID will be auto-generated from NODE_NAME if not set (must be a valid UUID)
# NODE_ID = 159e6f46-9398-11f0-bca3-6b6ea1493108
# NODE_ADDRESS is the address of the node the client will connect to
# NODE_ADDRESS = 127.0.0.1

# Global cache behaviour: OFF, RECORD, or REPLAY (default).
GLOBAL_CACHE_MODE = OFF

# License file location, if you want to use a different location than the default ~/.wooly/license.json
#LICENSE_FILE = /tmp/license.json
```

3. Make sure you have the `woolyai-server-license.json` file in the current directory. You can get it from WoolyAI support.

4. Run the Container

5. Check the logs with `docker logs woolyai-server` to make sure it started properly. You should see `"server listening on"` if it worked.

:::info
The `wooly-server-vram-cache`(Optional) folder is where you can cache models in VRAM with the [VRAM Model Cache Tool](/using-the-vram-model-cache). This is done with the  `woolyai-vram-model-cache --root ./wooly-server-vram-cache . . .` command.
:::

### NVIDIA

```bash
docker run -d --name woolyai-server \
--gpus all \
--network=host \
--pull always \
--entrypoint /usr/local/bin/server-entrypoint.bash \
-v "./woolyai-server-vram-cache:/home/automation/.wooly/shared_mem:rw" \
-v "./woolyai-server-config.toml:/home/automation/.wooly/config:ro" \
-v "./woolyai-server-license.json:/home/automation/.wooly/license.json:ro" \
woolyai/server:nvidia-latest
```

To delete, `docker rm -f woolyai-server`

#### Supported Architectures

- RTX PRO 6000 Blackwell Server Edition
- GB300, B300
- GB200, B200
- GH200, H200, H100
- L4, L40, L40S
- A100, A30
- A40, A10, A16, A2

### AMD

:::warning
We are currently working on optimizing the performance of the Unified WoolyAI Client Container to be as close to native on AMD. Please be sure to watch out for more updates.
:::

#### Supported Architectures

- MI300
- MI325X
- MI350

```bash
docker run -d --name woolyai-server \
--device /dev/kfd --device /dev/dri --security-opt seccomp=unconfined \
--network=host \
--pull always \
--entrypoint /usr/local/bin/server-entrypoint.bash \
-v "./woolyai-server-vram-cache:/home/automation/.wooly/shared_mem:rw" \
-v "./woolyai-server-config.toml:/home/automation/.wooly/config:ro" \
-v "./woolyai-server-license.json:/home/automation/.wooly/license.json:ro" \
woolyai/server:amd-latest
```

To delete, `docker rm -f woolyai-server`

## FAQ

- There is no need to go into the container.
- You can see logs with: `docker logs -f woolyai-server`
