---
sidebar_position: 2
title: 一条请求怎么走完
---

# 一条请求怎么走完

名词拆开讲完了，这里串一下。细节很多，图只保留主干：

```text
浏览器 / App
    │
    │  流量怎么进 Mihomo？
    ▼
mixed-port / 系统代理 / TUN / …
    │
    │  域名要不要解析？（DNS，有时还有 fake-ip）
    ▼
规则 rules（从上往下，碰上就停）
    │
    ├─ DIRECT  → 直连
    ├─ REJECT  → 丢掉
    └─ 某个组名 → 组里选节点 → 连代理服务器 → 目标
```

---

## 流量从哪进来

常见两种。

**mixed-port**（还有单独的 port、socks-port）：只有自己设了代理的程序才会进来，比如系统代理、浏览器插件指到 `127.0.0.1:7890`。

**TUN**：虚拟网卡把系统里一大块流量吸进来，很多软件不用单独设。权限要求高，出问题也更难查。

`listeners`、redir、tproxy 之类以后再说。

---

## DNS 卡在哪一步

访问的是域名时，后面规则、连接经常要用到 IP，或者先用 fake-ip 顶一个假地址。  
DNS 配拧了，`GEOIP`、真实连通都会跟着歪。

节点本身如果是域名，解析它时最好走 `proxy-server-nameserver`，免得「连节点还得先靠节点」绕死。DNS 章有写。

---

## 规则和组

`rules` 从上往下扫。策略一般写组名，或 `DIRECT` / `REJECT`，少写死某个节点名。

有一点别和 Xray 混：Xray 常把「谁都没命中」丢给配置里第一个 outbound；Mihomo 在 `mode: rule` 下通常靠最后的 `MATCH,某策略` 兜底，自己写清楚更稳妥。

命中某个组之后，由组的 `type` 决定用谁：`select` 手选，`url-test` / `fallback` 等自动选。成员来自手写 `proxies`，或订阅 `use` 进来的列表。

---

## 和配置文件怎么对上

| 步骤 | 大致在哪 |
| --- | --- |
| 进来 | `mixed-port` / `tun` / `listeners` |
| DNS | `dns:` |
| 规则 | `rules:` |
| 组 | `proxy-groups:` |
| 节点 | `proxies:` / `proxy-providers` |

看别人配置时，可以按这条链对号，不必从第一行 YAML 硬啃到底。
