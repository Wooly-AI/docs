---
sidebar_position: 3
---

For the Wooly Client Container, we provide a docker image that includes the Wooly runtime libraries and a CLI.

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
- `wooly credits` - This will show you how many credits you have left on your account.
- `wooly cache global list` - This will list all the models that are cached globally on the Wooly server.
- `wooly cache global on|off` - This will enable or disable your container's use of the global cache.
- `wooly cache private usage` - This will show you how much private cache you are using in MB.
- `wooly cache private invalidate` - This will invalidate/flush the private cache. By default you'll have a limit of 30GB.
- `wooly cache private on|off` - This will enable or disable private caching of the models you run on your container.
- `wooly ping` - This will test the latency to the Wooly server.
- `wooly version` - This will show the version of the Wooly CLI.




