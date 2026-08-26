---
sidebar_position: 5
title: 基础分流
---

# 基础分流

最小配置里常见 `MATCH,PROXY`，所有流量进同一组。  
用起来多数人会想：有的直连，有的走代理。

下面两套只是结构示意。节点参数、GEOSITE 分类名以你本机数据为准；没有对应分类就换成你有的规则或 rule-set。  
官方：https://wiki.metacubex.one/config/rules/

需要：至少一个能用的节点（手写或订阅）、一个策略组（例如 `PROXY`）、`mode: rule`。用 `GEOIP` / `GEOSITE` 时，工作目录里要有对应 geo 数据。

---

## 默认走代理，国内直连

```yaml
mode: rule

proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - my-node
      - DIRECT

rules:
  - IP-CIDR,127.0.0.0/8,DIRECT,no-resolve
  - IP-CIDR,192.168.0.0/16,DIRECT,no-resolve
  - IP-CIDR,10.0.0.0/8,DIRECT,no-resolve
  - IP-CIDR,172.16.0.0/12,DIRECT,no-resolve
  - GEOIP,CN,DIRECT
  - GEOSITE,cn,DIRECT
  - MATCH,PROXY
```

规则从上往下。`MATCH` 放最后，否则后面的永远轮不到。

`GEOIP` 看的是目标 IP。域名流量有时要先解析才会撞上 IP 规则；需要跳过解析时加 `no-resolve`（官方 Rules 有说明）。

---

## 默认直连，名单走代理

```yaml
rules:
  - GEOSITE,gfw,PROXY          # 你的数据里没有 gfw 就换自己的列表或 rule-set
  - DOMAIN-SUFFIX,google.com,PROXY
  - DOMAIN-SUFFIX,youtube.com,PROXY
  - MATCH,DIRECT
```

适合平时大多直连、只代理少数站。名单自己维护，或用 rule-providers。

---

## 和 Xray 默认出站的差别

Xray 里规则都没命中时，常走配置里**第一个 outbound**。  
Mihomo 规则模式下，请自己写 `MATCH`，写明兜底是 `PROXY` 还是 `DIRECT`。

---

## 广告

若 geo 或 rule-set 里有广告域名集合，可以写成例如：

```yaml
- GEOSITE,category-ads-all,REJECT
```

分类名必须真实存在，否则这条等于白写。也可以 `RULE-SET,某provider,REJECT`。

---

改完先用 `mihomo -t -f config.yaml` 测。  
再确认：国内站是不是还在走代理、该代理的站有没有进 `PROXY`。  
不准时优先查规则顺序、geo 是否加载成功、DNS 解析到的 IP 是否符合预期。
