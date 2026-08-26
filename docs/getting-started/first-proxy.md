---
sidebar_position: 4
title: 添加第一个代理并验证
---

# 添加第一个代理并验证

节点至少要有这些信息（不同协议字段不同）：

```text
名称 name
类型 type
服务器 server
端口 port
（以及协议要求的密码 / uuid / tls 等）
```

示意（**请换成你自己的真实参数**）：

```yaml
proxies:
  - name: my-node
    type: ss
    server: 你的服务器地址
    port: 你的端口
    cipher: aes-128-gcm
    password: "你的密码"
```

或 VLESS 一类（字段仅作结构示意）：

```yaml
proxies:
  - name: my-node
    type: vless
    server: 你的服务器地址
    port: 443
    uuid: 你的-uuid
    network: tcp
    tls: true
```

具体协议有哪些字段，看官方 Proxies：https://wiki.metacubex.one/config/proxies/

:::note
文档里的地址、端口、密码都是假的。  
没有合法节点时，只能验证「程序能启动、配置能解析」，不能验证「代理真的通」。
:::

---

## 为什么还要代理组？

节点是「一个出口」。  
组是「从哪些出口里选、怎么选」。

```yaml
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - my-node
      - DIRECT
```

rules 只写交给 `PROXY`，以后换节点、加节点，多数情况只改组，不用改每一条规则。

---

## 一份稍微完整一点的最小可用结构

```yaml
mixed-port: 7890
allow-lan: false
mode: rule
log-level: info
external-controller: 127.0.0.1:9090

proxies:
  - name: my-node
    type: ss
    server: 你的服务器
    port: 8388
    cipher: aes-128-gcm
    password: "密码"

proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - my-node
      - DIRECT

rules:
  - MATCH,PROXY
```

含义：全部流量进 PROXY 组，你在面板或 API 里选 `my-node` 或 `DIRECT`。

---

## 怎么验证「通了」

1. **核心在跑**  
   日志里有监听端口，没有持续报错退出。

2. **本机走代理端口**  
   - 系统代理或浏览器插件指到 `127.0.0.1:7890`（mixed-port）  
   - 或用 curl（Linux / macOS 示例）：

```bash
curl -x http://127.0.0.1:7890 -I https://www.google.com
```

能返回 HTTP 头，说明「经 Mihomo 出去」这条链路至少通了一截。  
若节点本身不可用，会超时或失败——那是节点/协议问题，不是「没装上」。

3. **看面板**  
   打开 Metacubexd / Yacd 等，连上 `external-controller`，在 Proxies 里能看到组和节点、能切换，说明 API 正常。

4. **看日志**  
   `log-level: info` 或 `debug` 时，连接失败原因通常会打出来（认证失败、TLS、超时等）。

---

## 常见坑

| 现象 | 可先检查 |
| --- | --- |
| 启动秒退 | YAML 缩进、冒号后空格、引号；`mihomo -t -f config.yaml` 有的版本可测配置 |
| 端口被占用 | 换一个 `mixed-port`，或关掉占用 7890 的程序 |
| 能启动但网页打不开 | 系统/浏览器是否真的走了 7890；节点是否可用；规则是否全进了 REJECT |
| 面板连不上 | `external-controller` 是否监听、防火墙、secret 是否填对 |

---

## 接下来

- 分流：在 `rules` 里加 `DOMAIN-SUFFIX`、`GEOIP` 等（官方 Rules）
- DNS：开启并配置 `dns`（官方 DNS；概念见小小白里的 DNS 章）
- 订阅：用 `proxy-providers` 拉远端节点列表（官方 Proxy Providers）
- TUN：系统级接管流量（先 mixed-port 跑稳再碰）

字段和进阶一律以官方 wiki 为准：https://wiki.metacubex.one/
