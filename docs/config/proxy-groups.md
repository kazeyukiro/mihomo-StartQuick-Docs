---
sidebar_position: 5
title: 策略组
---

# 策略组（proxy-groups）

对应官方：https://wiki.metacubex.one/config/proxy-groups/

策略组 = 把多个节点（或别的组、订阅）收在一个名字下，并规定「怎么选」。

---

## 通用字段示例

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

| 字段 | 人话 |
| --- | --- |
| `name` | 组名；有特殊字符建议加引号 |
| `type` | 组类型（见下） |
| `proxies` | 手写成员：节点名或其他组名 |
| `use` | 引入 proxy-providers 的名字 |
| `url` / `interval` | 健康检查地址与间隔（秒）。官方注明：主要检查 `proxies` 里的，不检查 use 进来的集合里的节点 |
| `lazy` | 默认 true：没轮到这个组时不测 |
| `default-selected` | 默认选谁；空或不存在则选第一个 |
| `empty-fallback` | 组空了回退到哪个 **proxy**（不能是组），默认 COMPATIBLE |
| `timeout` | 健康检查超时（毫秒） |
| `max-failed-times` | 失败几次后强制再测，默认 5 |
| `disable-udp` | 关掉这个组的 UDP |
| `include-all` / `include-all-proxies` / `include-all-providers` | 一把梭引进全部节点或全部订阅 |
| `filter` / `exclude-filter` | 正则筛节点名（对订阅和 include-all 一类生效） |
| `exclude-type` | 按协议类型排除，`|` 分隔，不支持正则 |
| `expected-status` | 健康检查期望的 HTTP 状态，如 `204`、`200/302`、`400-503` |
| `hidden` / `icon` | 给面板用的隐藏与图标 |

组上的 `interface-name` / `routing-mark` 官方已标弃用，改到节点上写。

---

## 常见 type

| type | 干什么 |
| --- | --- |
| `select` | 你在面板里手动选 |
| `url-test` | 按延迟自动选 |
| `fallback` | 按列表顺序，能用就用 |
| `load-balance` | 负载均衡 |
| `relay` | 代理链（按顺序经过多个节点） |

每种还有自己的额外字段（测速间隔策略、负载算法等），见官方各 type 页面。

规则里写组名，不要写死某一个节点名，换节点会省事很多。
