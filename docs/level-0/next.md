---
sidebar_position: 8
title: 接下来该干什么？
---

# 看完概念之后

概念对上号了，就可以动手。

建议顺序：

1. [快速开始](../getting-started/)：下载，用[旁注版小配置](../getting-started/annotated-config)跑通，再[验证](../getting-started/first-proxy)、[分流](../getting-started/basic-routing)。订阅和[图形客户端](../getting-started/gui-clients)按需。
2. 官方 wiki：https://wiki.metacubex.one/ ，General、DNS、Proxies、Proxy Groups、Rules 这几块优先。
3. 一次只加一类东西：组、DNS、订阅、TUN……别一次堆满。
4. 出问题把 `log-level` 调到 `info` 或 `debug`。命令见[附录](./appendix)。

Mihomo 只按配置转发。节点烂、协议被干扰、YAML 写错，它解决不了。  
问人时带上精简后的配置（密码打码）和相关日志，比空口说「连不上」有用。
