---
slug: /server/setup
---

## Prerequisites

- A host machine with a compatible GPU (NVIDIA currently)
- A license.json file. You can get it from https://woolyai.com/signup/
- Docker installed on the GPU host machine.
- Choose the proper docker image from the [WoolyAI Server Docker Hub](https://hub.docker.com/r/woolyai/server/tags). We provide images for NVIDIA at specific driver versions. Generally, you use as close as possible to your

## Setup

1. Optional(Only needed for Model Weight Dedup feature) - Create a directory for the server VRAM cache.

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
```

3. Make sure you have the `woolyai-server-license.json` file in the current directory. You can get it from WoolyAI support.

4. Run the Container

## NVIDIA

We provide multiple cuda versions for you to use. Be sure to the appropriate version for your GPU by checking the [WoolyAI Server Docker Hub](https://hub.docker.com/r/woolyai/server/tags). Currently, you can find 12.9.1 and 13.1.1.

```bash
docker run -d --name woolyai-server \
--gpus all \
--network=host \
--pull always \
--entrypoint /usr/local/bin/server-entrypoint.bash \
-v "./woolyai-server-vram-cache:/home/automation/.wooly/shared_mem:rw" \
-v "./woolyai-server-config.toml:/home/automation/.wooly/config:ro" \
-v "./woolyai-server-license.json:/home/automation/.wooly/license.json:ro" \
woolyai/server:cuda12.9.1-latest
```

:::info
With **`--gpus all`**, the server sees **every GPU on the host** that Docker exposes. To attach to a **subset** only, narrow visibility before or at launch (for example **`CUDA_VISIBLE_DEVICES`** on the host, Docker **`--gpus "device=..."`**, or **`CUDA_VISIBLE_DEVICES`** inside the container). Wooly **client** libraries can further select devices with **`GPUS`** in **`wooly-client-config.toml`** (see [client setup](/client/setup)); on Slurm clusters, also see the [Slurm usage guide](/usage-guides/slurm) for `woolyai_vram`, features, and client `GPUS`.
:::

5. Check the logs with `docker logs woolyai-server` to make sure it started properly. You should see `"server listening on"` if it worked.

:::info
The `wooly-server-vram-cache`(Optional) folder is where you can cache models in VRAM with the [VRAM Model Cache Tool](/using-the-vram-model-cache). This is done with the  `woolyai-vram-model-cache --root ./wooly-server-vram-cache . . .` command.
:::

## FAQ

- There is no need to go into the container.
- You can see logs with: `docker logs -f woolyai-server`
