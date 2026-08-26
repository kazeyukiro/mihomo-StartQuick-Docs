---
sidebar_position: 2
title: 全局配置
---

# 全局配置

对应官方：https://wiki.metacubex.one/config/general/

写在配置文件最上面那一堆，管「怎么听端口、谁能连、日志多吵、API 开不开」之类。

---

## 局域网访问

```yaml
allow-lan: true
bind-address: "*"
lan-allowed-ips:
  - 0.0.0.0/0
  - ::/0
lan-disallowed-ips:
  - 192.168.0.3/32
```

- `allow-lan`：别的设备能不能用你这台机器上的代理端口上网。本机自用常设 `false`。
- `bind-address`：代理端口绑在哪个地址。`"*"` 表示所有网卡；也可以写成单个 IP。
- `lan-allowed-ips` / `lan-disallowed-ips`：只在 `allow-lan: true` 时有意义。黑名单优先于白名单。

给 HTTP / SOCKS / mixed 加用户名密码：

```yaml
authentication:
  - "user1:pass1"
skip-auth-prefixes:
  - 127.0.0.1/8
  - ::1/128
```

本机地址可以跳过认证，避免自己连自己还要输密码。

---

## 运行模式

```yaml
mode: rule
```

| 值 | 意思 |
| --- | --- |
| `rule` | 按 `rules` 走（默认，最常用） |
| `global` | 全局走代理，要在叫 GLOBAL 的策略组里选节点 |
| `direct` | 全局直连 |

---

## 日志

```yaml
log-level: info
```

从安静到话多：`silent` → `error` → `warning` → `info` → `debug`。  
排错时开 `info` 或 `debug`，平时 `warning` / `info` 就够。

---

## IPv6 与 Keep-Alive

```yaml
ipv6: true
keep-alive-interval: 15
keep-alive-idle: 15
disable-keep-alive: false
```

`ipv6`：内核是否处理 IPv6。  
Keep-Alive 相关在移动设备上有人拿来减耗电；Android 上 `disable-keep-alive` 会被强制成 true。细节见官方说明。

---

## 进程匹配

```yaml
find-process-mode: strict
```

| 值 | 意思 |
| --- | --- |
| `always` | 尽量匹配进程（规则里用 PROCESS-NAME 等） |
| `strict` | 默认，内核自己判断要不要匹配 |
| `off` | 不匹配进程，路由器上常用 |

---

## 外部控制器（API / 面板）

```yaml
external-controller: 127.0.0.1:9090
secret: "你自己设的密码"
external-controller-cors:
  allow-origins:
    - '*'
  allow-private-network: true
```

面板（Metacubexd、Yacd 等）靠这个地址连内核。  
只本机用就绑 `127.0.0.1`；要局域网控制再考虑 `0.0.0.0`，并务必设 `secret`。

还有：

- `external-controller-unix` / `external-controller-pipe`：Unix socket / Windows 命名管道，**不校验 secret**，开了自己注意安全。
- `external-controller-tls`：HTTPS API，要配下面的 `tls`。
- `external-doh-server`：在 API 端口上挂 DoH，**也不校验 secret**。

静态面板目录：

```yaml
external-ui: ui
external-ui-name: xd
external-ui-url: "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip"
```

路径若不在工作目录内，需要按官方说明设 `SAFE_PATHS` 环境变量。

---

## 缓存、延迟、并发

```yaml
profile:
  store-selected: true   # 记住策略组选了谁
  store-fake-ip: true    # 记住 fake-ip 映射

unified-delay: true      # 测延迟时算 RTT，减少协议差异
tcp-concurrent: true     # DNS 解析出多个 IP 时并发连，用最先成功的
```

---

## 出站网卡与路由标记

```yaml
interface-name: en0
routing-mark: 6666
```

全局默认出站网卡、Linux 下默认 fwmark。节点上也可以单独写，优先级一般是：**节点 > 策略组（部分字段已弃用）> 全局**。

---

## TLS（给 API 用）

```yaml
tls:
  certificate: string   # PEM 或路径
  private-key: string
  # ech-key: ...
```

主要给 `external-controller-tls` 用。  
**全局 client-fingerprint 已弃用**，指纹写到具体 proxy 里。

---

## Geo 数据

```yaml
geodata-mode: false          # true 用 dat，false 用 mmdb（默认 false）
geodata-loader: memconservative  # 小内存设备友好；还有 standard
geo-auto-update: false
geo-update-interval: 24      # 小时
geox-url:
  geoip: "https://..."
  geosite: "https://..."
  mmdb: "https://..."
  asn: "https://..."
```

规则里的 `GEOIP` / `GEOSITE` / `IP-ASN` 都靠这些文件。地址可按官方示例改镜像。

```yaml
global-ua: clash.meta
etag-support: true
```

下载外部资源时的 UA、是否用 ETag。

---

更全的字段和警告以官方全局配置页为准。
