---
sidebar_position: 9
title: 附录：命令和路径
---

# 附录：命令和路径

常用命令和路径集中放这儿，以你机器上的实际路径为准。

---

## 命令

```bash
mihomo -v                          # 版本
mihomo -d /path/to/dir             # 指定工作目录启动
mihomo -f /path/to/config.yaml     # 指定配置文件
mihomo -t -d .                     # 只测配置能否解析，然后退出
mihomo -t -f config.yaml
```

`-d` 的目录里通常放 `config.yaml`、geo 数据、provider 缓存等。官方服务示例用的是 `-d /etc/mihomo`。

---

## systemd（如果你按官方装了服务）

```bash
systemctl start mihomo
systemctl stop mihomo
systemctl status mihomo
systemctl enable mihomo            # 开机自启
systemctl reload mihomo            # 重载配置
journalctl -u mihomo -o cat -e     # 看日志
journalctl -u mihomo -o cat -f     # 跟踪日志
```

常见位置：

- 服务单元：`/etc/systemd/system/mihomo.service`
- 配置目录：`/etc/mihomo/`（里面有 `config.yaml`）
- 二进制：`/usr/local/bin/mihomo`

单元全文：https://wiki.metacubex.one/startup/service/

---

## 配置里常改的几项

- `mixed-port`：本机 HTTP + SOCKS 代理口
- `external-controller`：面板 / API，例如 `127.0.0.1:9090`
- `secret`：API 密钥
- `log-level`：`silent` / `error` / `warning` / `info` / `debug`

---

## 链接

- 发布包：https://github.com/MetaCubeX/mihomo/releases
- 官方 wiki：https://wiki.metacubex.one/
- 完整配置示例：https://github.com/MetaCubeX/mihomo/blob/Meta/docs/config.yaml
- 第三方客户端列表：https://wiki.metacubex.one/startup/client/client/
