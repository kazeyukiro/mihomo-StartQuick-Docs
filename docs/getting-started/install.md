---
sidebar_position: 2
title: 怎么下载、选哪个文件
---

# 怎么下载、选哪个文件

官方下载页：https://github.com/MetaCubeX/mihomo/releases  
官方说明：https://wiki.metacubex.one/startup/ 和 https://wiki.metacubex.one/startup/faq/

Release 里文件特别多，文件名里塞了一堆信息。看不懂很正常，下面按人话拆。

---

## 文件名里都有什么

一个典型名字大概长这样：

```text
mihomo-linux-amd64-v1.19.29.gz
mihomo-windows-amd64-compatible-v1.19.29.zip
mihomo-darwin-arm64-v1.19.29.gz
```

从左到右大致是：

| 片段 | 含义 |
| --- | --- |
| `mihomo` | 程序名 |
| `linux` / `windows` / `darwin` / `android` … | 操作系统（darwin = macOS） |
| `amd64` / `arm64` / `386` / `armv7` … | CPU 架构 |
| `compatible` / `v1` / `v2` / `v3` / `go123` … | 兼容性相关标签（见下文） |
| `v1.19.29` | 版本号 |
| `.gz` / `.zip` / `.deb` / `.rpm` | 压缩或安装包格式 |

另外还有 **Alpha** 预发布：文件名里常带 `alpha` 和一段 git hash。  
日常用优先选**没有 alpha 字样的正式版（Meta / Release）**。

官方说明：alpha 是最新提交，meta 会定期合并 alpha；**meta 不一定比 alpha 更稳**。新手还是先用正式版。

---

## 我该选哪个系统、哪个架构？

### Windows

- 普通电脑：`mihomo-windows-amd64-….zip`
- ARM 本（少数 Surface 等）：`mihomo-windows-arm64-…`
- 很老的 32 位：`mihomo-windows-386-…`

官方构建目前支持 **Windows 7 及以上**。

解压后一般是一个 `mihomo.exe`（或带版本号的名字，你可改成 `mihomo.exe`）。

### macOS

- Apple Silicon（M1/M2/M3/M4…）：`mihomo-darwin-arm64-….gz`
- Intel Mac：`mihomo-darwin-amd64-….gz`

解压：

```bash
gunzip mihomo-darwin-arm64-xxxx.gz
chmod +x mihomo-darwin-arm64-xxxx
# 可重命名为 mihomo
mv mihomo-darwin-arm64-xxxx mihomo
```

若系统很旧，官方 FAQ 提到可按系统版本选带 `go124` / `go122` / `go120` 标签的包。一般新系统直接下默认包即可。

### Linux

先确认架构：

```bash
uname -m
```

| `uname -m` | 通常选 |
| --- | --- |
| `x86_64` | `linux-amd64` |
| `aarch64` / `arm64` | `linux-arm64` |
| `armv7l` 等 | `linux-armv7` |
| `i386` / `i686` | `linux-386` |

常见用法：

- 任意发行版：下 `.gz`，解压后放到比如 `/usr/local/bin`
- Debian / Ubuntu：可直接下 `.deb`
- Fedora / RHEL 系：可下 `.rpm`

解压示例：

```bash
gunzip mihomo-linux-amd64-xxxx.gz
chmod +x mihomo-linux-amd64-xxxx
sudo mv mihomo-linux-amd64-xxxx /usr/local/bin/mihomo
```

验证：

```bash
mihomo -v
```

能输出版本就说明二进制没问题。

---

## compatible、v1、v3、go123 是什么意思？

主要出现在 **amd64** 上。

| 标签 | 人话 |
| --- | --- |
| 默认（文件名里只有 `amd64`，没有 v1/v2/v3） | 按 **GOAMD64=v3** 编的，较新的 CPU 更合适 |
| `compatible` 或 `amd64-v1` | 按 **v1** 编的，兼容更老的 CPU / 环境 |
| `amd64-v2` / `amd64-v3` | 对应不同指令集等级 |
| `go120` / `go123` / `go124` … | 用较旧的 Go 版本编译，给**很老的系统或内核**用 |

**新手怎么选：**

1. 普通近几年的电脑 / VPS：直接选 **`amd64` 默认包**（不带 compatible、不带 go 标签）。
2. 跑起来报非法指令、打不开：再试 **`amd64-compatible`** 或 **`amd64-v1`**。
3. 很老的 Linux 内核（官方写：2.6.32～3.1）：选带 **`go123`** 的包。  
   现代内核（3.2+）一般不用管 go 标签。

更细的说明见官方：https://wiki.metacubex.one/startup/faq/

---

## 下完放哪里？

没有强制目录。常见两种：

**本机临时玩（Windows / macOS / Linux 都行）**

```text
某个文件夹/
  mihomo          （或 mihomo.exe）
  config.yaml     （配置文件，下一章写）
```

在这个目录里启动（见下一节）。

**Linux 想当系统服务长期跑**

官方建议（见 https://wiki.metacubex.one/startup/service/）：

- 二进制：`/usr/local/bin/mihomo`
- 配置目录：`/etc/mihomo/`（里面放 `config.yaml` 等）

后面「做成服务」一节会用到。

---

## 怎么前台跑一次（先确认能起来）

配置文件可以先放一个**几乎空的**，只要 YAML 合法就行。例如：

```yaml
mixed-port: 7890
log-level: info
```

保存为 `config.yaml`，和二进制放在同一目录（或用 `-d` 指定目录）。

**同一目录启动：**

```bash
# Linux / macOS
./mihomo -d .

# 或明确指定配置文件
./mihomo -f ./config.yaml
```

Windows 在 PowerShell / cmd 里：

```text
.\mihomo.exe -d .
```

看到类似「listening」「HTTP proxy listening」这类日志、没有立刻报错退出，就说明核心起来了。  
用 `Ctrl+C` 可以停掉。

`-d` 表示「工作目录」：配置、geo 数据等会按这个目录找。官方服务示例用的是 `-d /etc/mihomo`。

---

## （可选）Linux 做成 systemd 服务

内容来自官方：https://wiki.metacubex.one/startup/service/

1. 二进制放到 `/usr/local/bin/mihomo`
2. 配置放到 `/etc/mihomo/config.yaml`
3. 写服务文件 `/etc/systemd/system/mihomo.service`：

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

然后：

```bash
sudo systemctl daemon-reload
sudo systemctl enable mihomo
sudo systemctl start mihomo
sudo systemctl status mihomo
```

看日志：

```bash
journalctl -u mihomo -o cat -e
# 或持续跟踪
journalctl -u mihomo -o cat -f
```

重载配置（改完 config 后）：

```bash
sudo systemctl reload mihomo
```

---

## 不想碰命令行？

可以用带图形界面的第三方客户端，它们内部会调用 mihomo 核心。  
官方列表：https://wiki.metacubex.one/startup/client/client/

注意：客户端和核心是两回事。界面上的问题要去对应客户端项目反馈；核心问题才去 mihomo 仓库。

---

## Web 面板（可选）

核心本身没有漂亮界面，但可以通过 **external-controller** 接面板。

官方提到的几个：

- Yacd：http://yacd.metacubex.one
- Metacubexd：http://d.metacubex.one
- zashboard：http://board.zash.run.place/

配置里需要类似：

```yaml
external-controller: 127.0.0.1:9090
# 建议再设一个 secret，面板连接时填写
# secret: "你自己设的密码"
```

浏览器打开面板站点，填入 API 地址（如 `http://127.0.0.1:9090`）和 secret 即可。  
更细的字段见官方 General / 面板相关说明。

---

下一章写一份**真正能说明「节点 + 组 + 规则」**的最小配置。
