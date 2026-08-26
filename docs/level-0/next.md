---
sidebar_position: 8
title: 接下来该干什么？
---

# 看完概念之后

前面如果都能对上号，再去读配置就不会完全两眼一抹黑。

可以按这个顺序动手：

1. **快速开始**  
   下载 → 最小配置 → 验证 → [基础分流](../getting-started/basic-routing) → [图形客户端](../getting-started/gui-clients)

2. **官方 wiki**  
   https://wiki.metacubex.one/  
   先翻 General、DNS、Proxies、Proxy Groups、Rules。

3. **一次只加一类功能**  
   组 → DNS → 订阅 / rule-set → TUN……

4. **出问题先看日志**  
   `log-level: info` 或 `debug`。常用命令见[附录](./appendix)。

Mihomo 只按你的配置转发和分流。节点质量、协议环境、YAML 写错，它包办不了。  
问人时尽量带精简配置（密码打码）和相关日志。
