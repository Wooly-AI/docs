---
sidebar_position: 2
slug: /running-the-wooly-server
---

### Prerequisites

- A host machine with a compatible GPU (NVIDIA or AMD currently)
- A license.json file from [WoolyAI support](https://woolyai.com/).
- Docker installed on the host machine.
- Choose the proper docker image for your GPU vendor:
    - NVIDIA: `woolyai/server:nvidia-latest`
    - AMD: `woolyai/server:amd-latest`

### Setup

1. Create a directory for the server VRAM cache

```bash
mkdir wooly-server-vram-cache
```

1. Create the server config file: `wooly-server-config.toml`:
```toml
[SERVER]

LISTEN_ADDR = tcp::443
# Optional SSL endpoint. Uncomment after placing certfile.pem in working dir.
# LISTEN_ADDR = ssl::443
# SSL_CERT_FILE = certfile.pem
# SSL_KEY_FILE = certfile.pem

# Controller integration (leave blank if not using a controller).
# CONTROLLER_URL = nats://localhost:4222 # the natz URL for the controller
# NODE_NAME = my-node # must be unique across all nodes in the cluster
# NODE_ID = 159e6f46-9398-11f0-bca3-6b6ea1493108 # will be auto-generated from NODE_NAME if not set (must be a valid UUID)
# NODE_ADDRESS = 127.0.0.1 # the address of the node the client will connect to

# Global cache behaviour: OFF, RECORD, or REPLAY (default).
GLOBAL_CACHE_MODE = OFF

# License file location, if you want to use a different location than the default ~/.wooly/license.json
#LICENSE_FILE = /tmp/license.json
```

1. Make sure you have the license.json file in the current directory. You can get it from WoolyAI support.

1. Run the Container

**NOTE:** The `wooly-server-vram-cache` folder is where you can cache models in VRAM with the [VRAM Model Cache Tool](./using-the-vram-model-cache-tool). This is done with the  `woolyai-vram-model-cache --root ./wooly-server-vram-cache . . .` command.

### NVIDIA

```bash
docker run -d --name wooly-server \
--gpus all \
--network=host \
--entrypoint /usr/local/bin/server-entrypoint.bash \
-v "./wooly-server-vram-cache:/home/automation/.wooly/shared_mem:rw" \
-v "./wooly-server-config.toml:/home/automation/.wooly/config:ro" \
-v "./wooly-server-license.json:/home/automation/.wooly/license.json:ro" \
woolyai/server:nvidia-latest
```

#### Supported Architectures

- RTX PRO 6000 Blackwell Server Edition
- GB300, B300
- GB200, B200
- GH200, H200, H100
- L4, L40, L40S
- A100, A30
- A40, A10, A16, A2

### AMD

#### Supported Architectures

- MI300
- MI325X
- MI350

```bash
docker run -d --name wooly-server \
--device /dev/kfd --device /dev/dri --security-opt seccomp=unconfined \
--network=host \
--entrypoint /usr/local/bin/server-entrypoint.bash \
-v "./wooly-server-vram-cache:/home/automation/.wooly/shared_mem:rw" \
-v "./wooly-server-config.toml:/home/automation/.wooly/config:ro" \
-v "./wooly-server-license.json:/home/automation/.wooly/license.json:ro" \
woolyai/server:amd-latest
```

## FAQ

- There is no need to go into the container.
- You can see logs with: `docker logs -f wooly-server`