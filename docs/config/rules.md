---
sidebar_position: 6
title: 路由规则
---

# 路由规则（rules）

对应官方：https://wiki.metacubex.one/config/rules/

规则从上到下匹配，**命中一条就停**。最后通常有一条 `MATCH` 兜底。

格式大致是：

```text
类型,匹配内容,策略[,附加参数]
```

策略可以是：节点名、组名、`DIRECT`、`REJECT` 等。

---

## 示例

```yaml
rules:
  - DOMAIN,ad.example,REJECT
  - DOMAIN-SUFFIX,google.com,PROXY
  - DOMAIN-KEYWORD,google,PROXY
  - GEOSITE,youtube,PROXY
  - GEOIP,CN,DIRECT
  - IP-CIDR,127.0.0.0/8,DIRECT,no-resolve
  - PROCESS-NAME,curl,PROXY
  - RULE-SET,my-provider,PROXY
  - MATCH,PROXY
```

---

## 常用类型（域名 / IP）

| 类型 | 说明 |
| --- | --- |
| `DOMAIN` | 完整域名 |
| `DOMAIN-SUFFIX` | 后缀。`google.com` 能匹配 `www.google.com`，不匹配 `content-google.com` |
| `DOMAIN-KEYWORD` | 域名里包含关键字 |
| `DOMAIN-WILDCARD` | `*` / `?` 通配（和配置其他地方的 Clash 通配写法不完全一样，见官方） |
| `DOMAIN-REGEX` | 正则 |
| `GEOSITE` | 域名集合（依赖 geosite 数据） |
| `IP-CIDR` / `IP-CIDR6` | IP 段（两者效果同类） |
| `IP-SUFFIX` | IP 后缀范围 |
| `IP-ASN` | ASN |
| `GEOIP` | 国家代码，如 `CN` |

来源侧还有 `SRC-GEOIP`、`SRC-IP-CIDR` 等。

---

## 端口、入站、进程

| 类型 | 说明 |
| --- | --- |
| `DST-PORT` / `SRC-PORT` | 目标 / 来源端口（支持端口范围语法） |
| `IN-PORT` / `IN-TYPE` / `IN-USER` / `IN-NAME` | 按入站端口、类型、用户、名字 |
| `PROCESS-NAME` / `PROCESS-PATH` 及 WILDCARD、REGEX | 按进程名或路径；Android 上进程名可配包名 |
| `UID` | Linux 用户 ID |
| `NETWORK` | `tcp` 或 `udp` |
| `RULE-SET` | 引用 rule-providers |
| `AND` / `OR` / `NOT` | 逻辑组合，注意括号 |
| `SUB-RULE` | 跳到子规则集 |
| `MATCH` | 全部命中，无条件 |

---

## 附加参数

### no-resolve

用在「看目标 IP」的规则上。  
默认匹配 IP 类规则时可能先 DNS 解析域名再比 IP；加上 `no-resolve` 表示这条先别为了匹配去解析。  
若前面规则已经解析过，仍可能带 IP 信息。

### src

把「目标 IP」类规则改成按「来源 IP」比。

---

## 注意

若请求是 UDP，而命中的节点不支持 UDP（例如 ss 没写 `udp: true`），会**继续往下匹配**。

规则顺序比「规则条数」更重要：先精确后宽泛，最后 `MATCH`。
