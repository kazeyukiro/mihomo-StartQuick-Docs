---
sidebar_position: 8
title: 代理集合与规则集合
---

# 代理集合与规则集合

对应官方：

- https://wiki.metacubex.one/config/proxy-providers/
- https://wiki.metacubex.one/config/rule-providers/

手写几十个节点、几百条域名很累，就用「集合」从 URL 或本地文件拉。

---

## proxy-providers（节点订阅）

```yaml
proxy-providers:
  provider1:
    type: http
    url: "https://example.com/sub"
    path: ./proxy_providers/provider1.yaml
    interval: 3600
    proxy: DIRECT
    health-check:
      enable: true
      url: https://www.gstatic.com/generate_204
      interval: 300
    override:
      udp: true
    filter: "(?i)港|hk"
    exclude-filter: "xxx"
```

| 字段 | 人话 |
| --- | --- |
| 键名 `provider1` | 集合名字，组里 `use` 引用它；别和组名随便撞车 |
| `type` | `http` / `file` / `inline` |
| `url` | http 类型必填 |
| `path` | 落地缓存路径；默认限制在工作目录（`-d`）内 |
| `interval` | 多久更新一次（秒） |
| `proxy` | 下载订阅时走哪个出站 |
| `health-check` | 对节点做可用性检测 |
| `override` | 统一覆盖节点部分字段（udp、跳过证书等） |
| `filter` / `exclude-filter` / `exclude-type` | 按名字或类型筛节点 |
| `header` | 拉订阅时的 HTTP 头 |

策略组里：

```yaml
proxy-groups:
  - name: PROXY
    type: select
    use:
      - provider1
```

---

## rule-providers（规则集）

用来给 `RULE-SET,名字,策略` 用。  
type 同样有 http/file 等，behavior 常见 `domain` / `ipcidr` / `classical`，格式有 yaml、text、mrs 等（以官方当前说明为准）。

```yaml
rule-providers:
  my-domains:
    type: http
    behavior: domain
    url: "https://example.com/list.yaml"
    path: ./rule_providers/my-domains.yaml
    interval: 86400

rules:
  - RULE-SET,my-domains,PROXY
  - MATCH,DIRECT
```

路径同样受工作目录安全限制。

---

## 和手写的分工

| 方式 | 适合 |
| --- | --- |
| `proxies` 手写 | 少量自建节点 |
| `proxy-providers` | 机场订阅、远程节点列表 |
| `rules` 手写 | 几条关键分流 |
| `rule-providers` | 大域名列表、社区规则集 |

字段变更快，写进配置前对一下官方页最新示例。
