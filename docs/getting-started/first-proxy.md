---
sidebar_position: 4
title: 添加第一个代理并验证
---

# 添加第一个代理并验证

节点至少要有：名称、类型、服务器、端口，以及该协议要求的密码 / uuid 等。

示意（**换成你自己的真实参数**）：

```yaml
proxies:
  - name: my-node
    type: ss
    server: 你的服务器地址
    port: 你的端口
    cipher: aes-128-gcm
    password: "你的密码"
```

字段以官方为准：https://wiki.metacubex.one/config/proxies/

文档里的地址和密码都是假的。没有真实节点时，只能确认「进程能起来、YAML 能过」，不能证明「代理一定通」。

---

## 为什么还要组

节点是出口；组是「从哪些出口里选」。

```yaml
proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - my-node
      - DIRECT
```

rules 只指向 `PROXY`，换节点多半改组就行。

---

## 最小结构示例

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

全部流量进 PROXY，在面板或 API 里选 `my-node` 或 `DIRECT`。

---

## 怎么判断「通了」

1. **进程在跑**  
   有监听日志，没有反复崩溃退出。  
   可先：`mihomo -t -f config.yaml` 看配置能否解析。

2. **流量确实走了代理端口**  
   系统代理或浏览器指到 `127.0.0.1:7890`，或：

```bash
curl -x http://127.0.0.1:7890 -I https://www.google.com
```

能返回头，说明至少经过了 Mihomo。若节点本身挂了，仍会超时——那是节点问题，不是「没装上」。

3. **面板**  
   连上 `external-controller`，能看到组、能切换，说明 API 正常。

4. **日志**  
   `info` / `debug` 下看认证失败、TLS、超时等具体报错。

---

## 常见情况

| 现象 | 可先查 |
| --- | --- |
| 启动立刻退出 | YAML 缩进、冒号后空格；用 `-t` 测配置 |
| 端口占用 | 换 `mixed-port`，或关掉占用该端口的程序 |
| 能启动但网页不通 | 是否真的走了 7890；节点是否可用；规则是否进了 REJECT |
| 面板连不上 | `external-controller`、防火墙、secret |

---

再往后：`rules` 分流、DNS、`proxy-providers` 订阅、TUN 等，都按需加。字段以 https://wiki.metacubex.one/ 为准。
