---
sidebar_position: 2
title: 怎么下载、选哪个文件
---

# 怎么下载、选哪个文件

官方下载：https://github.com/MetaCubeX/mihomo/releases  
官方说明：https://wiki.metacubex.one/startup/ 、https://wiki.metacubex.one/startup/faq/

Release 里文件名又长又多，先会拆文件名就行。

---

## 文件名里有什么

例如：

```text
mihomo-linux-amd64-v1.19.29.gz
mihomo-windows-amd64-compatible-v1.19.29.zip
mihomo-darwin-arm64-v1.19.29.gz
```

| 片段 | 含义 |
| --- | --- |
| `mihomo` | 程序名 |
| `linux` / `windows` / `darwin` / `android` … | 系统（darwin = macOS） |
| `amd64` / `arm64` / `386` / `armv7` … | CPU 架构 |
| `compatible` / `v1` / `v2` / `v3` / `go123` … | 兼容相关标签 |
| `v1.19.29` | 版本号 |
| `.gz` / `.zip` / `.deb` / `.rpm` | 包格式 |

名字里带 `alpha` 和一串 hash 的是预发布。日常先用**不带 alpha 的正式版**。

官方原话大意：alpha 跟最新提交；meta 会定期并 alpha；**meta 不一定更稳**。

---

## 系统和架构怎么选

### Windows

- 常见 PC：`mihomo-windows-amd64-….zip`
- ARM 机：`mihomo-windows-arm64-…`
- 老 32 位：`mihomo-windows-386-…`

官方构建声明支持 Win7 及以上。解压后得到可执行文件，可改名为 `mihomo.exe`。

### macOS

- Apple Silicon：`mihomo-darwin-arm64-….gz`
- Intel：`mihomo-darwin-amd64-….gz`

```bash
gunzip mihomo-darwin-arm64-xxxx.gz
chmod +x mihomo-darwin-arm64-xxxx
mv mihomo-darwin-arm64-xxxx mihomo
```

系统很旧时，FAQ 里提过带 `go124` / `go122` / `go120` 的包。新系统用默认包即可。

### Linux

```bash
uname -m
```

| 输出 | 一般选 |
| --- | --- |
| `x86_64` | `linux-amd64` |
| `aarch64` / `arm64` | `linux-arm64` |
| `armv7l` 等 | `linux-armv7` |
| `i386` / `i686` | `linux-386` |

`.gz` 解压后拷到例如 `/usr/local/bin`；Debian/Ubuntu 可用 `.deb`，Fedora/RHEL 可用 `.rpm`。

```bash
gunzip mihomo-linux-amd64-xxxx.gz
chmod +x mihomo-linux-amd64-xxxx
sudo mv mihomo-linux-amd64-xxxx /usr/local/bin/mihomo
mihomo -v
```

---

## compatible、v1、go123

主要出现在 **amd64** 文件名里。

| 标签 | 含义 |
| --- | --- |
| 只有 `amd64`、没有 v1/v2/v3 | 默认按 GOAMD64=**v3** 编译 |
| `compatible` 或 `amd64-v1` | 按 **v1**，兼容更老 CPU |
| `amd64-v2` / `amd64-v3` | 不同指令集等级 |
| `go120` / `go123` / … | 用较旧 Go 编译，给老系统/老内核 |

怎么选：

1. 近几年的机器 / VPS：先下默认 `amd64`（不要 compatible、不要 go 后缀）。
2. 非法指令或直接跑不起来：换 `compatible` / `amd64-v1`。
3. 内核在 2.6.32～3.1：官方让下带 `go123` 的；3.2+ 一般不用管 go 标签。

详见：https://wiki.metacubex.one/startup/faq/

---

## 文件放哪

**临时试用：** 二进制和 `config.yaml` 放同一目录即可。

**Linux 长期当服务：** 官方习惯是二进制 `/usr/local/bin/mihomo`，配置目录 `/etc/mihomo/`（见下节）。

---

## 前台跑一次

先写个能解析的配置，例如：

```yaml
mixed-port: 7890
log-level: info
```

```bash
# Linux / macOS，配置在当前目录
./mihomo -d .

# 或
./mihomo -f ./config.yaml
```

Windows：

```text
.\mihomo.exe -d .
```

日志里出现监听端口、没有立刻退出，说明核心起来了。`Ctrl+C` 结束。

`-d` 指定工作目录（配置、geo 等按这个目录找）。服务示例里是 `-d /etc/mihomo`。

只想检查配置能不能解析：

```bash
mihomo -t -d .
# 或
mihomo -t -f ./config.yaml
```

`-t` 会测配置然后退出（内核支持该参数）。

---

## Linux systemd（可选）

按官方 https://wiki.metacubex.one/startup/service/ 整理如下。

```bash
# 假设当前目录已有名为 mihomo 的二进制，以及 config.yaml
sudo cp mihomo /usr/local/bin/
sudo mkdir -p /etc/mihomo
sudo cp config.yaml /etc/mihomo/
```

`/etc/systemd/system/mihomo.service`：

```ini
[Unit]
Description=mihomo Daemon, Another Clash Kernel.
After=network.target NetworkManager.service systemd-networkd.service iwd.service

[Service]
Type=simple
LimitNPROC=500
LimitNOFILE=1000000
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_RAW CAP_NET_BIND_SERVICE CAP_SYS_TIME CAP_SYS_PTRACE CAP_DAC_READ_SEARCH CAP_DAC_OVERRIDE
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_RAW CAP_NET_BIND_SERVICE CAP_SYS_TIME CAP_SYS_PTRACE CAP_DAC_READ_SEARCH CAP_DAC_OVERRIDE
Restart=always
ExecStartPre=/usr/bin/sleep 1s
ExecStart=/usr/local/bin/mihomo -d /etc/mihomo
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable mihomo
sudo systemctl start mihomo
sudo systemctl status mihomo
journalctl -u mihomo -o cat -e
# 持续看日志：
journalctl -u mihomo -o cat -f
# 改完配置重载：
sudo systemctl reload mihomo
```

---

## 不想碰命令行

可以用带界面的第三方客户端（内部仍是 mihomo 核心）。列表见：  
https://wiki.metacubex.one/startup/client/client/

界面问题和核心问题要分开：界面去对应客户端仓库问；核心行为才去 mihomo。

---

## Web 面板（可选）

核心没有图形壳，可靠 API 接面板。官方提到过例如：

- http://yacd.metacubex.one
- http://d.metacubex.one
- http://board.zash.run.place/

配置示例：

```yaml
external-controller: 127.0.0.1:9090
# secret: "自己设一个"
```

浏览器打开面板站点，填 API 地址和 secret。字段细节见官方 General。

下一章写最小配置结构。
