---
sidebar_position: 7
title: DNS
---

# DNS

对应官方：https://wiki.metacubex.one/config/dns/

概念见小小白「DNS」章。这里对照官方字段说人话。

---

## 骨架

```yaml
dns:
  enable: true
  listen: 0.0.0.0:1053
  ipv6: false
  enhanced-mode: fake-ip   # 或 redir-host
  fake-ip-range: 198.18.0.1/16
  default-nameserver:
    - 223.5.5.5
  nameserver:
    - https://doh.pub/dns-query
  fallback:
    - tls://1.1.1.1
  fallback-filter:
    geoip: true
    geoip-code: CN
```

| 字段 | 人话 |
| --- | --- |
| `enable` | false 则基本用系统 DNS |
| `listen` | 对外提供 DNS 服务的地址（UDP/TCP） |
| `ipv6` | false 时 AAAA 可回空 |
| `cache-algorithm` | `lru`（默认）或 `arc` |
| `prefer-h3` | DoH 优先 HTTP/3 |
| `use-hosts` / `use-system-hosts` | 是否用配置里 hosts、系统 hosts |
| `respect-rules` | DNS 查询是否走路由规则；需配好 `proxy-server-nameserver`，官方不建议和 prefer-h3 乱叠 |
| `default-nameserver` | 用来解析「DNS 服务器自己的域名」，必须是 IP（可以是加密 DNS 的 IP 形式） |
| `enhanced-mode` | `fake-ip` 或 `redir-host`（默认 redir-host） |
| `fake-ip-range` / `fake-ip-range6` | fake-ip 用的地址段；TUN 默认地址也会参考 |
| `fake-ip-filter` | 哪些域名不要 fake-ip |
| `fake-ip-filter-mode` | `blacklist` / `whitelist` / `rule` |
| `nameserver` | 默认解析服务器 |
| `fallback` | 后备（常用境外 DoT/DoH） |
| `nameserver-policy` | 按域名指定用哪组 DNS，优先于 nameserver/fallback |
| `proxy-server-nameserver` | **只解析节点域名**用的 DNS，避免「解析节点还得先连节点」的死结 |
| `direct-nameserver` | 走直连的域名用哪组 DNS |
| `fallback-filter` | 什么情况下采信 fallback（geoip、geosite、ipcidr、domain 等） |

---

## fake-ip 和 redir-host

- **redir-host**：先解析出真实 IP，再按规则走。
- **fake-ip**：先塞一个假 IP（如 198.18.x.x），真正连接时再解析。规则匹配可以更快，和 TUN 搭配很常见，但个别应用会不兼容，靠 `fake-ip-filter` 排除。

`fake-ip-filter-mode: rule` 时，filter 写法接近路由规则（可 DOMAIN、GEOSITE、RULE-SET、MATCH，并指定 fake-ip 或 real-ip）。

---

## fallback-filter 在干什么

配了 `fallback` 后，默认会按 filter 判断 nameserver 的结果像不像「被污染」。  
例如 `geoip: true` 且 `geoip-code: CN`：解析结果若是国内 IP 可以用 nameserver 的；否则改用 fallback。  
geosite / 域名列表命中的，可以规定直接只走 fallback。

---

## DNS 服务器写法附加参数

可在 URL 后用 `#`、`&` 加参数，例如走某个代理、ECS、跳过证书验证等。官方举例：

```yaml
nameserver:
  - "https://8.8.8.8/dns-query#proxy&ecs=1.1.1.1/24&ecs-override=true"
```

经代理查 DNS 时，务必配好 `proxy-server-nameserver`，否则容易鸡蛋问题（解析代理域名又依赖代理）。

---

更细的 hosts、DNS 类型、流程图见官方 DNS 子页面。
