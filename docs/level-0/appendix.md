---
sidebar_position: 9
title: 附录：命令和路径
---

# 附录：命令和路径

读文档时碰到的命令、目录，集中记在这里。以你本机实际路径为准。

---

## 常用命令

| 做什么 | 示例 |
| --- | --- |
| 看版本 | `mihomo -v` |
| 指定工作目录启动 | `mihomo -d /path/to/dir` |
| 指定配置文件启动 | `mihomo -f /path/to/config.yaml` |
| 只测配置是否能解析，然后退出 | `mihomo -t -d .` 或 `mihomo -t -f config.yaml` |

工作目录（`-d`）里通常放 `config.yaml`，以及 geo 数据、provider 缓存等。  
官方服务示例用的是 `-d /etc/mihomo`。

---

## systemd（Linux，若你按官方装了服务）

| 做什么 | 命令 |
| --- | --- |
| 启动 / 停止 / 状态 | `systemctl start mihomo` / `stop` / `status` |
| 开机自启 | `systemctl enable mihomo` |
| 重载配置 | `systemctl reload mihomo` |
| 看日志 | `journalctl -u mihomo -o cat -e` |
| 跟踪日志 | `journalctl -u mihomo -o cat -f` |

服务文件常见位置：`/etc/systemd/system/mihomo.service`  
配置目录常见：`/etc/mihomo/`（内有 `config.yaml`）  
二进制常见：`/usr/local/bin/mihomo`

完整单元内容见官方：https://wiki.metacubex.one/startup/service/

---

## 配置里常打交道的项

| 项 | 干什么 |
| --- | --- |
| `mixed-port` | 本机 HTTP+SOCKS 代理口 |
| `external-controller` | 面板 / API 地址，如 `127.0.0.1:9090` |
| `secret` | API 访问密钥 |
| `log-level` | `silent` / `error` / `warning` / `info` / `debug` |

---

## 下载与文档

| 用途 | 地址 |
| --- | --- |
| 发布包 | https://github.com/MetaCubeX/mihomo/releases |
| 官方 wiki | https://wiki.metacubex.one/ |
| 完整配置示例 | https://github.com/MetaCubeX/mihomo/blob/Meta/docs/config.yaml |
| 第三方客户端列表 | https://wiki.metacubex.one/startup/client/client/ |
