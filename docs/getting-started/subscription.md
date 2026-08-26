---
sidebar_position: 7
title: 用订阅拉节点
---

# 用订阅拉节点

节点很多时，不必全部手写在 `proxies` 里，可以用 **proxy-providers** 从 URL 或本地文件拉取。

官方：https://wiki.metacubex.one/config/proxy-providers/

---

## 最小结构

```yaml
proxy-providers:
  my-sub:
    type: http
    url: "https://example.com/your-subscription"
    path: ./proxy_providers/my-sub.yaml
    interval: 86400
    health-check:
      enable: true
      url: https://www.gstatic.com/generate_204
      interval: 600

proxy-groups:
  - name: PROXY
    type: select
    use:
      - my-sub
    proxies:
      - DIRECT

rules:
  - MATCH,PROXY
```

含义：

- `my-sub` 按 `url` 下载，缓存在 `path`（默认要在工作目录 `-d` 允许的范围内）
- `interval`：多久更新一次（秒）
- 组里 `use: [my-sub]`：把订阅里的节点放进这个组
- 仍可在 `proxies` 里混入手写节点

下载订阅时若要走代理，provider 上有 `proxy` 字段，见官方说明。

---

## 和「多机场订阅聚合」

一些客户端里的「多机场订阅聚合」底层往往就是 provider 或等价逻辑。  
命令行用户则是自己写 `proxy-providers` + 组 `use`。

过滤节点名、排除某协议，用 `filter` / `exclude-filter` / `exclude-type`（官方有示例）。

---

## 注意

- 订阅内容是别人的节点列表，信任问题和泄露风险自己衡量
- 路径受工作目录安全策略限制，乱写绝对路径可能被拒
- 组上的 `url`/`interval` 健康检查，官方写明主要针对组内 **proxies 手写成员**，不覆盖 use 进来的集合；集合侧用 provider 自己的 `health-check`
