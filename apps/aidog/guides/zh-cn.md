# AiDog 安装与使用教程

一句话：**AiDog（aidog.im）是一个完全跑在你自己电脑上的私人 AI 伙伴**——它通过 Telegram、飞书、钉钉、企业微信等 9 个渠道和你聊天，自带技能系统、自然语言定时任务和自我进化记忆，密钥只存在你机器上，没有任何云端账号。

## 你将得到

- 一个常驻本机的 AI 助手：网页控制台（127.0.0.1:19167）+ 聊天软件渠道都能用
- 自带技能路由、子代理、定时任务（`/cron`）、记忆进化（`/learn`、`/reflect`）
- 完全免费、无遥测（可选的匿名使用统计默认关闭），你只需要一个模型端点

## 准备（请先看完，5 分钟）

| 需要 | 说明 |
|---|---|
| **Windows** | 需要 **WSL2**（Ubuntu 等发行版）。AiDog 的正式运行环境在 WSL 里；Windows 原生只有 attach-only 的小外壳 |
| **macOS** | 官方标注 "expected-but-untested"，可装可试，遇到问题属正常（实验性支持） |
| Python 3.10+ | WSL/Ubuntu 一般自带：`python3 --version` 检查 |
| tmux | **需要管理员权限**：WSL 里执行 `sudo apt-get install tmux`（这一步请手动完成，AiBOX 不会替你提权） |
| 模型端点 | 任意 OpenAI 兼容端点（也支持零配置本地网关试用） |
| Telegram 等 | 可选：想用聊天渠道就准备一个 bot token |

> ⚠️ **Windows 大坑**：仓库必须 clone 在 WSL 自己的文件系统里（如 `~/aidog`），**不要**放在 `C:\` 挂载盘下——9p/CIFS 挂载不支持 `chmod`，tmux 会坏；从 Windows 拷贝进去还会因换行符（CRLF）弄坏脚本。

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **AiDog** → 点「安装」
2. AiBOX 下载带哈希校验的官方源码包（国内自动走加速通道），在 WSL 里解压到 `~/aidog` 并执行官方一键安装 `deploy/install.sh`（provision + 启动 + 验证，可重复执行）
3. 看到安装器输出即完成；下一步做配置（见下节）

### 路线 B：手动安装（官方命令）

WSL / Linux（macOS 同）：

```bash
# 先装 tmux（需要管理员权限，手动执行）
sudo apt-get install tmux          # Ubuntu/WSL；macOS 用 brew install tmux

git clone https://github.com/AiDog-im/AiDog.git aidog && cd aidog
bash deploy/install.sh             # 一条命令：环境检查 + 配置 + 启动 + 验证
aidog setup                        # 引导式向导：逐项补齐缺的配置
```

## 配置（让它开口说话）

`aidog setup` 会只询问还没填的项（密钥隐藏输入、从不回显）：

1. `WEB_TOKEN`：控制台写操作口令——自己编一串长随机字符串
2. 模型端点：控制台「Settings」或向导里填 OpenAI 兼容 `base_url` + 模型名（默认本地网关 `http://127.0.0.1:3460/v1`，模型 `mimo-v2.6-flash`；有 Key 的服务商才需要填 `MODEL_API_KEY`）
3. Telegram（可选）：@BotFather 拿 token + 你的数字 ID（白名单，非白名单一律拒绝）

## 验证：怎样算成功

1. `aidog setup --check` 返回 **0**（全部就绪）或 **2**（只差凭据项）——都不是 1
2. 浏览器打开 **http://127.0.0.1:19167**，Chat 卡片发一句话，**有流式回复** = 模型链路通
3. Telegram 给你的 bot 发 `/help`（白名单账号）能收到回复
4. `python3 ~/aidog/deploy/aidog_doctor.py`：0 个 FAIL

## 常见问题

- **`tmux not found`**：先按上文手动装 tmux（需要管理员），再重跑 `bash deploy/install.sh`
- **`port 19167 is used`**：换个端口启动：`AIDOG_WEB_PORT=19200 bash deploy/boot_services.sh start`
- **一直 PENDING / model endpoint unreachable**：模型端点没通。先确认 `web/settings.json` 的 `mycore.base_url` 能访问；没配大脑时退出码 2 是"诚实的未配置"，不是崩溃
- **Telegram 收不到消息**：多是本机出站被墙——运行时通过本地代理（`HTTPS_PROXY`）发消息，在启动 tmux 的 shell 里设置即可
- **`aidog update apply` 报脏树**：有意设计，先提交本地改动再升级

## 卸载

```bash
bash ~/aidog/deploy/boot_services.sh stop   # 先停运行时
rm -rf ~/aidog                              # 数据与代码同目录，删前请备份 secrets.env 和 data/
rm -f ~/.local/bin/aidog                    # 删掉命令包装器
```

更多：[官方安装文档](https://github.com/AiDog-im/AiDog/blob/main/docs/installation.md) · [官网 aidog.im](https://aidog.im)
