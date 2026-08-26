---
sidebar_position: 4
title: 旁注版完整小配置
---

# 旁注版完整小配置

对标那种「一份配置从头到尾讲清楚」的写法：下面是一份**结构完整、仍然尽量短**的示例。  
服务器、密码、订阅地址都是假的，换成你自己的。

读法：先扫左侧 YAML，再看每段后面的说明。  
字段权威解释仍以官方为准：https://wiki.metacubex.one/

---

## 整份配置（可复制后改）

```yaml
# ========== 1. 全局：端口、模式、日志、面板 ==========
mixed-port: 7890
allow-lan: false
mode: rule
log-level: info
ipv6: true

external-controller: 127.0.0.1:9090
# secret: "改成自己的密码"

# ========== 2. DNS（可先简单，再按需加 fallback） ==========
dns:
  enable: true
  enhanced-mode: redir-host
  nameserver:
    - 223.5.5.5
    - 119.29.29.29
  # 解析「节点域名」时建议单独指定，避免鸡蛋问题：
  # proxy-server-nameserver:
  #   - 223.5.5.5

# ========== 3. 节点（手写一个；有订阅见文末） ==========
proxies:
  - name: my-node
    type: ss
    server: 203.0.113.10
    port: 8388
    cipher: aes-128-gcm
    password: "replace-me"
    udp: true

# ========== 4. 策略组 ==========
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - my-node
      - DIRECT

# ========== 5. 规则：默认代理，国内直连 ==========
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

## 1. 全局在干什么

| 行 | 意思 |
| --- | --- |
| `mixed-port: 7890` | 本机用 `127.0.0.1:7890` 当 HTTP/SOCKS 代理口 |
| `allow-lan: false` | 局域网别的设备不能用你的代理口（本机自用更省事） |
| `mode: rule` | 按下面 `rules` 分流；还有 `global` / `direct` |
| `log-level: info` | 日志详细程度；排错可改成 `debug` |
| `ipv6: true` | 是否处理 IPv6（可按网络环境关） |
| `external-controller` | 给面板/API 用；只绑本机较安全 |
| `secret` | API 密钥；对局域网开放控制器时建议设 |

对应概念：流量怎么进 → [入站](../level-0/inbound)、[安装章里的面板](./install)。

---

## 2. DNS 在干什么

| 项 | 意思 |
| --- | --- |
| `enable: true` | 由 Mihomo 处理 DNS，而不是完全甩给系统 |
| `enhanced-mode: redir-host` | 先解析真实 IP 再匹配；若改用 `fake-ip` 要另配 range/filter |
| `nameserver` | 默认用哪些 DNS |
| `proxy-server-nameserver`（注释里） | **只用于解析节点服务器域名**；节点是域名时很有用 |

这份为了短，没写 `fallback`。污染严重或要国内外分流 DNS 时，再看[配置参考 · DNS](../config/dns)和官方 DNS 页。

---

## 3. 节点在干什么

`proxies` 数组里每一项是一个出口：

| 字段 | 意思 |
| --- | --- |
| `name` | 名字；组和规则用这个名字引用 |
| `type` | 协议；这里用 `ss` 举例，实际可能是 vless/trojan/hysteria2… |
| `server` / `port` | 服务器地址和端口 |
| `cipher` / `password` | SS 加密与密码；其他协议字段不同 |
| `udp: true` | 允许 UDP；很多场景需要，按协议支持情况开 |

`203.0.113.10` 是文档用保留地址，不能当真。  
协议字段：https://wiki.metacubex.one/config/proxies/

---

## 4. 策略组在干什么

```yaml
- name: PROXY
  type: select
  proxies:
    - my-node
    - DIRECT
```

- 规则里写 `PROXY`，不写死 `my-node`
- `select`：在面板里手动选 `my-node` 或直连
- 以后加节点，多半改组，少改规则

改成 `url-test` 可按延迟自动选，需加 `url` / `interval` 等，见[策略组](../config/proxy-groups)。

---

## 5. 规则在干什么

自上而下：

1. 常见内网网段 → 直连（带 `no-resolve`，避免为匹配去解析）
2. `GEOIP,CN` → 目标 IP 判为国内则直连
3. `GEOSITE,cn` → 域名落在 cn 集合则直连（集合名取决于你的 geosite 数据）
4. `MATCH,PROXY` → 其余全部进 `PROXY` 组

没有 `MATCH` 时，别假设会像 Xray 那样自动走「第一个出站」。规则模式请自己写兜底。

更多分流写法：[基础分流](./basic-routing)。

---

## 怎么跑这份配置

1. 存成 `config.yaml`，和 `mihomo` 放同一目录（或放进 `-d` 目录）
2. 改掉 `server` / `password` / 协议字段
3. 检查：`mihomo -t -f config.yaml`
4. 启动：`mihomo -d .`
5. 系统代理或浏览器指到 `127.0.0.1:7890`，或用 curl：

```bash
curl -x http://127.0.0.1:7890 -I https://www.google.com
```

---

## 若节点来自订阅

把第 3 节换成 provider，第 4 节用 `use`（可与手写节点并存）：

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

说明见[用订阅拉节点](./subscription)。

---

## 这份故意没写的

- TUN（系统级接管）
- 复杂 `fallback` / `nameserver-policy`
- rule-providers 大列表
- 多种协议、多组（游戏组、流媒体组等）

先跑通这一份，再按需往上加。加之前弄清加的是「入口、DNS、节点来源、选路还是规则」。
