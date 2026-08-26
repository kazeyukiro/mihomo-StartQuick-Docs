---
sidebar_position: 99
title: 常见问题
---

# 常见问题

## Mihomo、Clash Meta、Clash 是同一个东西吗？

不是三个并列产品。

原版 Clash 已经停更。Clash Meta 是后来的社区分支，再后来改名成 Mihomo，也就是现在还在维护的这套内核。

展开写在：[Clash、Clash Meta、Mihomo](./level-0/clash-meta-mihomo)

## Mihomo 是客户端吗？

是核心。带界面的软件可以调它，也可以直接跑二进制。  
本机用多半当本地代理；服务器上也能开入站给人连。

## 节点和代理有啥区别？

配置里 `proxies` 每一项就是一个节点。  
口头说「代理」时，有时指这件事，有时指那个节点，看上下文。

## 配置为什么这么长？

要同时写清楚：流量从哪进、DNS、规则、组、节点。  
一块一块看比整份 YAML 死盯要轻松。零基础可以从小小白白话文看起。

## 从哪读起？

概念不清 → 小小白白话文  
已经懂代理和规则 → 快速开始  
查字段 → 配置参考 + 官方 wiki

## 官方文档

- https://wiki.metacubex.one/
- https://github.com/MetaCubeX/mihomo

本站是非官方入门整理，和内核行为冲突时以官方为准。

## 交流

官方群若不公开，社区有人整理过第三方群：  
https://t.me/mihomo_community
