---
slug: /client/vram-overcommit
---

VRAM Overcommit is a feature that allows you to overcommit the VRAM of the GPU. This is useful for reducing memory usage and improving performance.

## How to use vram overcommit

1. Set the `WOOLYAI_VRAM_OVERCOMMIT` environment variable to `true` in the WoolyAI Client configuration file.

```bash
WOOLYAI_VRAM_OVERCOMMIT = 1
```

---