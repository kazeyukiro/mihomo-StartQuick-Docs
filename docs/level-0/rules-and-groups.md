---
sidebar_position: 4
title: 规则和代理组
---

# 规则和代理组是什么？

可以先这么分：

> **规则：这条流量走哪条路**  
> **代理组：这条路上具体用哪个节点**

---

## 规则

不想每个网站手动切节点，就写规则。从上往下匹配，命中一条就停。

```yaml
rules:
  - DOMAIN-SUFFIX,example.com,PROXY
  - GEOIP,CN,DIRECT
  - MATCH,PROXY
```

意思大致是：example.com 交给 PROXY；国内 IP 直连；剩下的也走 PROXY。

类型很多（域名、IP、进程、端口……），官方 Rules 页有完整列表。现在只需知道：**规则决定去向**。

---

## 代理组

节点一多，规则里写死「这个站用日本 A」会改到崩溃。于是把节点丢进组：

```yaml
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - 日本
      - 香港
      - 新加坡
      - 美国
```

规则只写 `PROXY`。组里用谁，看 `type`：

| type | 行为 |
| --- | --- |
| `select` | 你在界面里手选 |
| `url-test` | 按延迟自动选 |
| `fallback` | 按顺序，能通就用 |
| `load-balance` | 负载均衡 |
| `relay` | 代理链（进阶） |

---

## 一条请求大概怎么走

```text
请求
 ↓
规则
 ↓
代理组
 ↓
具体节点
 ↓
代理服务器 / 直连
 ↓
目标
```

| 配置 | 管什么 |
| --- | --- |
| `proxies` | 有哪些节点 |
| `proxy-groups` | 怎么组织、怎么选 |
| `rules` | 流量怎么分流 |
