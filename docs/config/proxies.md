---
sidebar_position: 4
title: 出站代理
---

# 出站代理（proxies）

对应官方：https://wiki.metacubex.one/config/proxies/

`proxies` 是一个数组，每一项是一个节点。

---

## 通用字段（几乎所有节点都有）

```yaml
proxies:
  - name: "ss"
    type: ss
    server: server
    port: 443
    ip-version: ipv4
    udp: true
    interface-name: eth0
    routing-mark: 1234
    tfo: false
    mptcp: false
    dialer-proxy: ss1
    smux:
      enabled: true
      protocol: h2mux
```

| 字段 | 人话 |
| --- | --- |
| `name` | 名字，不能重复，规则和组用这个名字引用 |
| `type` | 协议类型：ss、vmess、vless、trojan、hysteria2… |
| `server` / `port` | 服务器和端口 |
| `ip-version` | 出站用 IPv4/IPv6：`dual` / `ipv4` / `ipv6` / `ipv4-prefer` / `ipv6-prefer`，默认 dual |
| `udp` | 是否允许 UDP。不少协议默认行为不同，SS 要显式开 |
| `interface-name` | 从哪块网卡出站 |
| `routing-mark` | Linux fwmark |
| `tfo` / `mptcp` | TCP Fast Open / Multipath TCP |
| `dialer-proxy` | 先通过另一个节点/组再连本节点（代理链） |
| `smux` | TCP 上的多路复用（smux/yamux/h2mux 等） |

TLS 相关（`skip-cert-verify`、`sni`、`client-fingerprint`、`reality-opts` 等）见官方 TLS 页，写在具体协议配置里。

---

## 常见协议（字段以官方为准）

下面只帮助建立印象，**完整 cipher、plugin、transport 列表请打开对应官方页**。

### Shadowsocks（ss）

```yaml
- name: ss1
  type: ss
  server: server
  port: 443
  cipher: aes-128-gcm
  password: "password"
  udp: true
  plugin: obfs
  plugin-opts:
    mode: tls
```

官方：https://wiki.metacubex.one/config/proxies/ss/

### VMess / VLESS / Trojan

常见还要配 `uuid`、`network`（ws/grpc/tcp…）、`tls`、`servername` 等。  
VMess 还有 `alterId`、`cipher`；VLESS 有 flow 等。

- https://wiki.metacubex.one/config/proxies/vmess/
- https://wiki.metacubex.one/config/proxies/vless/
- https://wiki.metacubex.one/config/proxies/trojan/

### Hysteria2 / TUIC

偏 UDP/QUIC，常有 `password`、`up`/`down`、端口跳跃 `ports`、`sni` 等。

- https://wiki.metacubex.one/config/proxies/hysteria2/
- 官方 proxies 目录下还有 tuic 等页面

### 其他

HTTP/SOCKS 出站、WireGuard、SSH、Tailscale、direct、dns、reject 等官方都有单独页。  
本站入门阶段：**会读 name/type/server/port + 组里引用名字** 就够用。

---

## 内置名字

不用写在 `proxies` 里也能在规则/组里用的，例如：

- `DIRECT`：直连
- `REJECT`：拒绝

具体内置列表以当前内核与官方文档为准。
