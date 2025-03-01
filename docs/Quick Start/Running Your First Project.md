---
sidebar_position: 1
slug: /getting-started/running-your-first-project
---

## Orientation

Wooly is provided currently as a [docker container](https://www.docker.com/resources/what-container/). It contains the Wooly runtime libraries and a CLI.

You can find all available images on [Docker Hub](https://hub.docker.com/r/woolyai/client).

### Pull the latest Docker Image

```bash
docker pull woolyai/client:latest
```

### Run the Docker Container

```bash
docker run -it --name wooly-container woolyai/client:latest
```

### Exec into the Container

```bash
docker exec -it wooly-container bash
```

### Log in to the Wooly Server

```bash
# once attached to bash in the container with docker exec -it wooly-container bash
ubuntu@de79436cb028:~$ wooly login
enter your token: 
ping latency to the wooly server is 43.568800 ms
success
```

You'll be prompted to enter your Wooly token. You can obtain a Wooly token by signing up at [https://woolyai.com/get-started/](https://woolyai.com/get-started/).

### Run a PyTorch Project

We include several examples projects in the docker image under the `~/examples` directory.

```bash
cd ~/examples/
./
```





