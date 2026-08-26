---
sidebar_position: 2
title: Clash、Clash Meta、Mihomo
---

# Clash、Clash Meta、Mihomo 是什么关系？

网上三个名字搅在一起，其实不是三套并列产品。

**现在这个内核正式叫 Mihomo。**  
**Clash Meta（或 Clash.Meta）是它改名前大家常用的叫法。**  
**更早的原版 Clash（Dreamacro 那支）已经停更了。**

| 名字 | 大致是什么 | 还在维护吗 |
| --- | --- | --- |
| Clash（原版） | 早期开源核心，YAML + 规则分流很多从这套玩法传开 | 大约 2023 年底就停了 |
| Clash Premium | 原版作者做过的增强版，有一部分闭源 | 基本不再当日常更新来源 |
| Clash Meta | 社区在原版思路上继续做的分支，协议和支持更宽 | 项目还在，但已改名 |
| Mihomo | Meta 改名之后的正式名（MetaCubeX） | 是，当前主线 |

搜「Clash 配置」「Clash 订阅」，多半指的是这类 YAML 生态，不一定还是好几年前那个原版二进制。  
搜「Clash Meta」「Meta 内核」，和 Mihomo 基本是同一条线的前后称呼。  
真要下程序、查文档，认 [MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo) 和现在的 wiki 就行。

---

## 改名之后对你有什么影响

原版停更以后，还在往前走的主要是 Meta 这一支，后来仓库和程序名改成了 mihomo。

改名动机网上说法不一，用起来差别不大：配置还是熟悉的 `proxies` / `proxy-groups` / `rules` / `dns` 那一套；协议和功能比原版多了一截（以你装的版本为准）；旧文写「Clash Meta」很常见，多数时候可以当成在说现在的 Mihomo。

---

## 和带「Clash」字样的客户端

Clash / Mihomo 首先是**内核**，命令行就能跑，本身不带漂亮窗口。

各种 Verge、FlClash、手机上的 Meta 客户端之类，通常是：

```text
界面（订阅、开关、托盘）
        ↓
   调内核（现在多半是 Mihomo）
```

所以软件名里还写着 Clash、设置里写 Meta 内核或 mihomo，并不矛盾。  
换一个客户端，配置语言往往还是同一路；换内核版本，才更容易碰到「新协议认不认」的问题。

官方要求：和 MetaCubeX 无关的下游项目，名字里不要带 mihomo。wiki 首页有写。碰到名字很像官方、仓库对不上的，自己多留神。

---

## 老配置还能不能用

简单的老 Clash 配置（几个节点加几条规则），很多在 Mihomo 里还能跑，顶多改几处。  
Meta / Mihomo 才有的字段、较新的协议，原版 Clash 读不了。  
订阅要看里面是什么节点、你的内核新不新，太旧会直接不认。

本站例子按当前 Mihomo 写。拿很老的「原版 Clash 教程」逐字抄，可能对不上。

下一章：[一条请求怎么走完](./how-it-works)。
