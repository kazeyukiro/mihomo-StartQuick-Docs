---
sidebar_position: 5
title: 基础分流
---

# 基础分流

最小配置里常常是 `MATCH,PROXY`：所有流量进同一组。  
实际用时多数人想要：**一部分直连，一部分走代理**。

下面两套都是**结构示意**。节点参数、GEOSITE 分类名以你本机 geo 数据为准；没有对应分类就改成你有的规则或 rule-set。

官方规则说明：https://wiki.metacubex.one/config/rules/

---

## 先具备什么

- 至少一个能用的节点，写在 `proxies` 里（或订阅 `use` 进组）
- 一个策略组，例如 `PROXY`（`select` / `url-test` 均可）
- `mode: rule`
- 需要 `GEOIP` / `GEOSITE` 时，工作目录里要有对应 geo 数据（内核常会按配置去拉，也可自备）

---

## 方案 A：默认走代理，国内直连

思路：国内 IP / 国内域名 → `DIRECT`；其余 → `PROXY`。

```yaml
mode: rule

proxy-groups:
  - name: PROXY
    type: select
    proxies:
      - my-node
      - DIRECT

rules:
  # 局域网等（按需）
  - IP-CIDR,127.0.0.0/8,DIRECT,no-resolve
  - IP-CIDR,192.168.0.0/16,DIRECT,no-resolve
  - IP-CIDR,10.0.0.0/8,DIRECT,no-resolve
  - IP-CIDR,172.16.0.0/12,DIRECT,no-resolve

  # 国内 IP
  - GEOIP,CN,DIRECT

  # 国内域名（分类名取决于你的 geosite 数据）
  - GEOSITE,cn,DIRECT

  # 其余全部进组
  - MATCH,PROXY
```

规则**从上往下**。`MATCH` 必须在最后，否则后面的永远轮不到。

`GEOIP` 匹配的是**目标 IP**。域名流量有时要先解析才会撞上 IP 规则；前面规则已经解析过则另说。需要跳过解析时用 `no-resolve`（见官方 Rules）。

---

## 方案 B：默认直连，名单走代理

思路反过来：只有明确要代理的走 `PROXY`，最后 `MATCH,DIRECT`。

```yaml
rules:
  - GEOSITE,gfw,PROXY          # 若你的数据里有 gfw 类；没有就换自己的列表 / rule-set
  - DOMAIN-SUFFIX,google.com,PROXY
  - DOMAIN-SUFFIX,youtube.com,PROXY
  - MATCH,DIRECT
```

适合「平时大部分直连，只代理少数站点」。名单要自己维护或引用 rule-providers。

---

## 和 Xray「隐藏默认出站」的差别

Xray 里常有：规则都没命中时，走**配置里第一个 outbound**。  
Mihomo 在规则模式下，请**自己写 `MATCH`**，写清楚兜底是 `PROXY` 还是 `DIRECT`，别假设「第一个组会自动接住」。

---

## 广告 / 拒绝

若 geo 或 rule-set 里有广告域名集合，可以：

```yaml
- GEOSITE,category-ads-all,REJECT
```

分类名必须真实存在于你的数据文件，否则规则无效。也可以用 `RULE-SET,某provider,REJECT`。

---

## 改完怎么确认

1. `mihomo -t -f config.yaml` 能通过  
2. 已知国内站是否还走代理（看面板连接或日志）  
3. 已知该代理的站是否进了 `PROXY`

分流不准时，优先查：规则顺序、geo 是否加载成功、DNS 是否解析到预期 IP。
