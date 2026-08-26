---
sidebar_position: 1
title: 配置参考
---

# 配置参考

官方配置总入口：https://wiki.metacubex.one/config/

完整示例配置（官方仓库）：https://github.com/MetaCubeX/mihomo/blob/Meta/docs/config.yaml

本站这一块不是把官方文档逐字抄一遍，而是按「配置文件里常见大块」用人话说明：每块干什么、常见字段什么意思、新手先动哪些。

协议字段特别细的（每种加密、每种 transport）以官方为准，这里只点到「你大概会碰到什么」。

## 配置文件大致长什么样

```text
全局选项（端口、模式、API、geo……）
入站（流量怎么进：mixed-port / tun / listeners）
DNS
proxies（节点）
proxy-groups（策略组）
proxy-providers / rule-providers（订阅与规则集，可选）
rules（路由规则）
```

侧边栏顺序建议：

1. [全局配置](./general)
2. [入站](./inbound)
3. [出站代理 proxies](./proxies)
4. [策略组 proxy-groups](./proxy-groups)
5. [路由规则 rules](./rules)
6. [DNS](./dns)
7. [代理集合 / 规则集合](./providers)

字段有更新时，仍以官方 wiki 为准。
