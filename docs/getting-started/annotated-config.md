---
sidebar_position: 4
title: 旁注版完整小配置
---

# 旁注版完整小配置

下面是一份结构算完整、但尽量短的例子，按块说明每一段在干什么。  
服务器、密码都是假的，请换成你自己的。字段以官方为准：https://wiki.metacubex.one/

---

## 整份配置

```yaml
# --- 全局 ---
mixed-port: 7890
allow-lan: false
mode: rule
log-level: info
ipv6: true

external-controller: 127.0.0.1:9090
# secret: "改成自己的密码"

# --- DNS（先简单写；不够再加 fallback） ---
dns:
  enable: true
  enhanced-mode: redir-host
  nameserver:
    - 223.5.5.5
    - 119.29.29.29
  # 节点是域名时，解析节点地址建议单独指定：
  # proxy-server-nameserver:
  #   - 223.5.5.5

# --- 手写一个节点；有订阅看文末 ---
proxies:
  - name: my-node
    type: ss
    server: 203.0.113.10
    port: 8388
    cipher: aes-128-gcm
    password: "replace-me"
    udp: true

# --- 组 ---
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - my-node
      - DIRECT

# --- 规则：国内直连，其余进 PROXY ---
rules:
  - IP-CIDR,127.0.0.0/8,DIRECT,no-resolve
  - IP-CIDR,192.168.0.0/16,DIRECT,no-resolve
  - IP-CIDR,10.0.0.0/8,DIRECT,no-resolve
  - IP-CIDR,172.16.0.0/12,DIRECT,no-resolve
  - GEOIP,CN,DIRECT
  - GEOSITE,cn,DIRECT
  - MATCH,PROXY
```

---

## 全局

`mixed-port: 7890`：本机代理口，HTTP 和 SOCKS 都走它。  
`allow-lan: false`：别的设备别来连你这个口，本机自用先这样。  
`mode: rule`：按 `rules` 分流；还有 `global`、`direct`。  
`log-level`：排错可以改成 `debug`。  
`external-controller`：给面板用，绑在 `127.0.0.1` 相对安全；对局域网开放时建议加 `secret`。

入站相关概念见[流量怎么进来](../level-0/inbound)，面板见[安装](./install)。

---

## DNS

打开 `enable` 之后，解析主要由 Mihomo 管，不全部甩给系统。  
`redir-host` 是先解析出真实 IP 再匹配；若改用 `fake-ip`，还要配 range、filter 等，这里故意没写。  
`proxy-server-nameserver` 只负责解析**节点服务器的域名**，节点填域名时很有用。

需要 fallback、分流 DNS 时，看[配置参考 · DNS](../config/dns)或官方页面。

---

## 节点

`proxies` 里每一项是一个出口。`name` 给组和规则引用；`type` 决定后面有哪些字段。  
这里用 SS 举例，真实环境可能是 vless、trojan、hysteria2 等，字段不一样。  
`203.0.113.10` 是文档用的保留地址，不能当真。  
协议说明：https://wiki.metacubex.one/config/proxies/

---

## 组

规则里写 `PROXY`，不要写死 `my-node`。  
`select` 表示在面板里自己选节点或 `DIRECT`。以后加节点，多半改组就行。  
若要按延迟自动选，改成 `url-test` 并补 `url`、`interval`，见[策略组](../config/proxy-groups)。

---

## 规则

从上往下：内网段直连（`no-resolve` 避免为了匹配去解析）→ 国内 IP → 国内域名集合 → 剩下的 `MATCH` 进 `PROXY`。

`GEOSITE,cn` 能不能用，取决于你的 geosite 数据里有没有这个分类。  
`MATCH` 请自己写，别假定会像 Xray 那样自动走「第一个出站」。

更多分流：[基础分流](./basic-routing)。

---

## 怎么跑

1. 存成 `config.yaml`，和 mihomo 放一起（或放进 `-d` 目录）  
2. 改掉服务器和密码  
3. `mihomo -t -f config.yaml` 测一下  
4. `mihomo -d .` 启动  
5. 系统代理或浏览器指到 `127.0.0.1:7890`，或：

```bash
curl -x http://127.0.0.1:7890 -I https://www.google.com
```

---

## 节点改成订阅

```yaml
proxy-providers:
  my-sub:
    type: http
    url: "https://example.com/sub"
    path: ./proxy_providers/my-sub.yaml
    interval: 86400

proxy-groups:
  - name: PROXY
    type: select
    use:
      - my-sub
    proxies:
      - DIRECT
```

细节见[用订阅拉节点](./subscription)。

---

这份没写 TUN、复杂 fallback、大 rule-set、多组分流。先跑通再加；加的时候想清楚加的是入口、DNS、节点来源、选路还是规则。
