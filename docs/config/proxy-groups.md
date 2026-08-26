---
sidebar_position: 5
title: 策略组
---

# 策略组（proxy-groups）

官方：https://wiki.metacubex.one/config/proxy-groups/

把多个节点（或别的组、订阅）收在一个名字下，并规定怎么选。

---

## 常见字段

```yaml
proxy-groups:
  - name: "PROXY"
    type: select
    proxies:
      - DIRECT
      - ss1
    use:
      - provider1
    url: "https://www.gstatic.com/generate_204"
    interval: 300
    lazy: true
    timeout: 5000
    max-failed-times: 5
    filter: "(?i)港|hk|hongkong"
    exclude-filter: "美|日"
    exclude-type: "ss|http"
    expected-status: 204
```

| 字段 | 说明 |
| --- | --- |
| `name` | 组名；有特殊字符时加引号 |
| `type` | 见下表 |
| `proxies` | 成员：节点名或其他组名 |
| `use` | 引用 proxy-providers 的名字 |
| `url` / `interval` | 健康检查地址与间隔（秒）。官方写明：检查的是 **proxies 里的节点**；通过 `use` 拉进来的集合，不在这套 url/interval 检查范围内 |
| `lazy` | 默认 true：当前没选到这个组时不测 |
| `default-selected` | 默认选谁；空或不存在则第一个 |
| `empty-fallback` | 组空了时回退到哪个 **proxy 名**（不能是组），默认 `COMPATIBLE` |
| `timeout` | 健康检查超时（毫秒） |
| `max-failed-times` | 失败多少次后强制再测，默认 5 |
| `disable-udp` | 禁用该组 UDP |
| `include-all` 等 | 引入全部节点或全部 provider |
| `filter` / `exclude-filter` | 按正则筛名字（主要作用于订阅、include-all 一类） |
| `exclude-type` | 按协议类型排除，`|` 分隔，不是正则 |
| `expected-status` | 期望 HTTP 状态，如 `204`、`200/302`、`400-503` |
| `hidden` / `icon` | 给面板用 |

组上的 `interface-name`、`routing-mark` 官方已标弃用，改写到节点上。

---

## type

| type | 行为 |
| --- | --- |
| `select` | 手动选 |
| `url-test` | 按延迟 |
| `fallback` | 按列表顺序，通的就用 |
| `load-balance` | 负载均衡 |
| `relay` | 按顺序链式转发 |

各 type 还有自己的额外字段，见官方页面。
