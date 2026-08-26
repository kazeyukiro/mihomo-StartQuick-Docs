---
sidebar_position: 3
title: 第一份配置文件
---

# 第一份配置文件

Mihomo 读的是 **YAML**。缩进用空格，不要用 Tab；同级对齐。

下面这份是「能说明结构」的最小例子，不是生产环境推荐配置。

```yaml
# 混合端口：HTTP + SOCKS 都走这个端口
mixed-port: 7890

# 是否允许局域网其他设备连你的代理端口（本机先关掉更安全）
allow-lan: false

# 规则模式：按 rules 分流（还有 global / direct）
mode: rule

log-level: info

# 可选：给面板用
external-controller: 127.0.0.1:9090

proxies:
  - name: example
    type: http
    server: example.com
    port: 8080

proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - example
      - DIRECT

rules:
  - MATCH,PROXY
```

它在说什么：

```text
监听 7890

有一个叫 example 的节点（这里是示意用的 http 代理）

有一个叫 PROXY 的组，可以选手动选 example 或直连

所有流量（MATCH）都交给 PROXY
```

---

## 和概念篇的对应关系

| 配置块 | 对应概念 |
| --- | --- |
| `mixed-port` | 流量怎么进 Mihomo |
| `proxies` | 有哪些节点 |
| `proxy-groups` | 节点怎么组织、怎么选 |
| `rules` | 流量怎么分流 |

`DIRECT` 是内置的「直连」，不用写在 `proxies` 里。  
还有内置的 `REJECT` 等，以后用到再查官方 wiki。

---

## 先跑起来再改

1. 把上面内容存成 `config.yaml`
2. 和 `mihomo` 放同一目录（或放进 `-d` 指定的目录）
3. 前台启动：`./mihomo -d .`
4. 看日志有没有报 YAML 错误、端口冲突

此时 **example 节点是假的**，真正上网还通不了。下一章换成真实节点，并说怎么验证。

完整字段说明以官方为准：https://wiki.metacubex.one/
