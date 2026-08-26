---
sidebar_position: 7
title: 用订阅拉节点
---

# 用订阅拉节点

节点很多时，不必全写在 `proxies` 里，可以用 **proxy-providers** 从 URL 或本地文件拉。

官方：https://wiki.metacubex.one/config/proxy-providers/

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

`my-sub` 按 `url` 下载，落到 `path`（默认要在工作目录 `-d` 允许的范围内）。  
`interval` 是更新间隔，单位秒。  
组里 `use` 把订阅里的节点塞进这个组；`proxies` 里还可以再混手写节点。

下载订阅要走代理时，provider 上有 `proxy` 字段，见官方说明。

---

## 和「多机场订阅聚合」

一些客户端里的「多机场订阅聚合」底层往往就是 provider 或类似逻辑。  
命令行这边就是自己写 `proxy-providers`，再在组里 `use`。

按名字过滤、排除某协议，用 `filter` / `exclude-filter` / `exclude-type`，官方有示例。

---

## 注意

订阅是别人的节点列表，信不信、会不会泄露，自己掂量。  
路径受工作目录限制，乱写绝对路径可能被拒。  
组上的 `url` / `interval` 健康检查，官方写明主要针对组里 **proxies 手写成员**，不覆盖 `use` 进来的；集合那边用 provider 自己的 `health-check`。
