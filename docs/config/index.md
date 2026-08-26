---
sidebar_position: 1
title: 配置参考
---

# 配置参考

官方入口：https://wiki.metacubex.one/config/  
官方完整示例：https://github.com/MetaCubeX/mihomo/blob/Meta/docs/config.yaml

这里按配置文件里常见的几大块说明：每块干什么、常见字段什么意思。  
单个协议的全部加密方式、transport 细节，直接看官方对应页，免得和内核版本脱节。

```text
全局（端口、模式、API、geo…）
入站（mixed-port / tun / listeners）
DNS
proxies
proxy-groups
proxy-providers / rule-providers（可选）
rules
```

1. [全局配置](./general)
2. [入站](./inbound)
3. [出站 proxies](./proxies)
4. [策略组](./proxy-groups)
5. [规则](./rules)
6. [DNS](./dns)
7. [代理集合 / 规则集合](./providers)
