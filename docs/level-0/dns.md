---
sidebar_position: 5
title: DNS 到底是什么？
---

# DNS 到底是什么？

DNS 是另一个特别容易把新手绕晕的地方。

---

## 它最基础的工作

你访问 `example.com`，电脑真正要连接的是一个 IP 地址。

DNS 就是干这件事的：

```text
example.com
     ↓
    DNS
     ↓
  1.2.3.4（IP）
```

可以把它理解成互联网的电话簿。

---

## 为什么 Mihomo 也要管 DNS？

因为：

1. 规则匹配经常依赖域名（DOMAIN、DOMAIN-SUFFIX、GEOSITE 等）。
2. 如果 DNS 被污染，你解析出来的 IP 可能是错的，后面怎么代理都没用。
3. 不同流量可能需要用不同的 DNS（国内域名用国内 DNS，国外用国外 DoH 等）。

所以 Mihomo 内置了自己的 DNS 模块。官方 wiki 的 DNS 章节非常长，支持：

- 普通 UDP/TCP DNS
- DoH / DoT / DoQ
- fake-ip 模式
- nameserver-policy（按域名指定用哪个 DNS）
- fallback（备用 DNS）
- 等等

对新手来说，先记住两件事就够：

1. **开启 `dns.enable` 之后，Mihomo 会自己处理域名解析。**
2. **fake-ip 是一种特殊模式**：它先给你一个假的 IP（比如 `198.18.x.x`），真正连接的时候再解析真实 IP。好处是规则匹配更快、某些场景下更抗污染，但也会带来一些兼容性问题。

细节以后再慢慢啃官方文档。现在只需要知道：

> DNS 不是可有可无的装饰，它直接影响「规则能不能正确匹配」和「你最终连到的是不是正确的服务器」。

---

## 现在只需要记住

```text
域名
 ↓
DNS
 ↓
IP 地址
 ↓
建立连接
```

DNS 最基础的工作就是：

> **帮你把「域名」找到对应的网络地址。**
