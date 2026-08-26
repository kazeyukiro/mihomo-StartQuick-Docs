---
sidebar_position: 3
title: 入站
---

# 入站

对应官方：https://wiki.metacubex.one/config/inbound/

「入站」= 流量从哪进 Mihomo。  
能不能从公网访问，取决于你绑的地址、系统和防火墙，不取决于协议名字唬不唬人。

三种常见写法：

1. 顶层代理端口（最简单）
2. 顶层 `tun`
3. `listeners` 数组（多个入站、可单独指定规则）

---

## 代理端口

官方：https://wiki.metacubex.one/config/inbound/port/

```yaml
port: 7890          # 仅 HTTP(S)
socks-port: 7891    # SOCKS
mixed-port: 7892    # HTTP + SOCKS 同一个口（新手最常用）
redir-port: 7893    # 透明代理 TCP（Linux/Android/macOS）
tproxy-port: 7894   # 透明代理 TCP+UDP（Linux/Android）
```

本机浏览器 / 系统代理指到 `127.0.0.1:混合端口` 即可。  
`allow-lan`、认证见[全局配置](./general)。

---

## TUN

顶层 `tun:` 用来接管系统流量（虚拟网卡）。  
需要权限，配置项多，DNS 劫持、按应用分流常跟它一起出现。

新手建议：**先 mixed-port 跑通，再开 TUN**。  
完整字段见官方：https://wiki.metacubex.one/config/inbound/tun/

概念说明见小小白里的「流量怎么进来」。

---

## listeners

可以同时开多个入站，类型、端口、是否强制走某个 proxy 都能分开写：

```yaml
listeners:
  - name: socks-in
    type: socks
    port: 10808
    # listen: 0.0.0.0
    # rule: 某个 sub-rule 名
    # proxy: 某个节点或组名   # 非空则该入站流量直接交给它，不走主 rules
    # udp: true
```

类型很多，官方按用途分了类，例如：

| 用途 | 类型举例 |
| --- | --- |
| 应用代理 | http、socks、mixed |
| 透明 / 系统 | redirect、tproxy、tun |
| 当服务端给人连 | ss、vmess、vless、trojan、hysteria2、tuic… |

`listen: 0.0.0.0` 会听所有网卡。未加密的 HTTP/SOCKS/Mixed **别直接暴露公网**。

还有 `ss-config` / `vmess-config` / `tuic-server` 等快捷写法，和对应 listener 类似，新配置更推荐用 `listeners`。

细节：https://wiki.metacubex.one/config/inbound/
