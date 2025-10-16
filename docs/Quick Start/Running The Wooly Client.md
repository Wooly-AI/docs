---
sidebar_position: 2
slug: /running-the-wooly-client
---

### Prerequisites

- A Wooly Controller URL
- Docker installed on the host machine.

### Setup

1. Create a directory for the client data on the host. If not using `-u root` to exec into the container, the directory must be either owned by 1005:1005 or have permissions 777.

    ```bash
    mkdir client-data
    chown 1005:1005 client-data # or chmod 777 if you cannot use 1005
    ```

2. Create the client config to mount into the container, or, edit the existing default config file at `~/.config/wooly/config`.

    ```toml
    ADDRESS = 127.0.0.1
    GLOBALCACHE = OFF
    PRIVATECACHE = OFF
    PORT = 443
    SSL = DISABLE
    # PRIO = 0
    # CONTROLLER ONLY: Without MAX_VRAM, you'll see "controller assignment failed: failed to parse response JSON: [json.exception.parse_error.101] parse error at line 1, column 5: syntax error while parsing value - invalid literal; last read: '400 B'; expected end of input"
    # MAX_VRAM = 80000 # Memory limit for the client in MB (required for controller)
    # CACHE_ID
    # CONTROLLER_URL=http://127.0.0.1:8080 # When commented out, the client will go directly to the server and not use a controller
    # Controller-less config
    # GPUS = 0,1,2 # Specify a list of GPUs to be run target
    ```

3. Start the Client Container from the data directory.

    ```bash
    # remove any existing container with the same name
    docker rm -f "$(whoami)-wooly-client" || true

    cd client-data

    # If needed, add: -v "./client-config.toml:/home/ubuntu/.config/wooly/config:ro" \

    # run the container
    docker run -dit \
        --restart unless-stopped \
        --workdir /host \
        --network=host \
        --shm-size=2g \
        --name "$(whoami)-wooly-client" \
        -v "$(pwd)":"/host" \
        "woolyai/client:pytorch2.9-latest"

    # access the container
    ## -u root is also available, otherwise the default user/group is ubuntu (1005:1005)
    docker exec -it "$(whoami)-wooly-client" bash
    ```

## FAQ

- 