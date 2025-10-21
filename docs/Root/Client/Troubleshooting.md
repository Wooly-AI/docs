---
sidebar_position: 1
slug: /client/troubleshooting
---

:::info
`WOOLY_DEBUG=1` can be set in your environment to get verbose logging from the client.
:::

## Common issues and solutions

### Execution Hanging

If the execution of your python scripts inside of the client container are hanging, it could be several things:

1. The server is not responding.
    - If using the controller to obtain an IP, be sure the `NODE_ADDRESS` in your server config is set to an IP/URL the client can reach.
1. It's slow to run.
    - **Tip**: You can look at the server logs to see if it's busy running the execution.
    - If you're running your client container on a local laptop that's has a slow internet connection, especially to the server, it needs to transfer data back and forth to the server. An indicator of this is the server logs are showing low memory usage.