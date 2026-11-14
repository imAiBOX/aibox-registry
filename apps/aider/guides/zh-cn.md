# Aider 安装与使用教程

一句话：**Aider（GitHub 5 万+ Star）是住在终端里的 AI 结对程序员**——你用中文/英文描述要改什么，
它直接改你 git 仓库里的文件并自动提交；主流云端模型和本地免费模型都能接。

## 你将得到

- 仓库里的 `aider >` 对话提示符：点名文件、提出修改，改动直接落盘（默认自动提交）
- 支持几乎所有主流大模型：OpenAI、Anthropic、Google、OpenRouter、DeepSeek、Ollama 等（官方 LLM 接入文档）
- 仓库地图 + lint + 测试感知：改文件时也保持对整个代码库的理解
- 配置位置符合直觉：`~/.aider.conf.yml`（家目录）或仓库根目录的 `.aider.conf.yml`

## 准备（2 分钟）

- **Python 3.10 – 3.12**（硬性要求：PyPI `requires_python >=3.10,<3.13` 实测）——用 `python --version` / `python3 --version` 确认
- 一个 git 仓库（aider 围绕 git 设计；脱离仓库也能用，但自动提交需要 git）
- 一个模型来源：API Key（OPENAI_API_KEY / ANTHROPIC_API_KEY …）或本地 Ollama
- 不需要：管理员权限（安装就是 `pip install --user`，全在用户目录）、Docker、Node.js

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **Aider** → 点「安装」
2. AiBOX 从 PyPI 下载官方 `aider-chat` wheel（带 sha256 校验），执行 `pip install --user`——**全程无需管理员**
3. 下面"验证"一节能打印版本号即装好

### 路线 B：手动安装（官方渠道）

- **pip**：`python -m pip install aider-chat`（macOS 用 `python3 -m pip ...`）
- **官方一键安装器**（README 推荐）：`python -m pip install aider-install` 再运行 `aider-install`——
  自动准备独立环境（自带 Python/uv），零配置
- 国内网络慢：前面加 `PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple`

## 配置

1. 在 **git 仓库里** 打开终端运行 `aider`，出现 `aider >` 提示符
2. 密钥：在 shell 里导出，如 `export OPENAI_API_KEY=...` / `export ANTHROPIC_API_KEY=...`
   （aider 读取标准环境变量，官方文档）；或 `--model ollama/...` 用免费本地模型
3. 默认项写进 `~/.aider.conf.yml`（按"git 根目录 → 当前目录 → 家目录"顺序查找，官方配置文档），例如：

```yaml
model: anthropic/claude-sonnet-4-5
auto-commits: true
dark-theme: true
```

4. 历史/日志在**项目里**：`.aider.input.history`、`.aider.chat.history.md`——
  跟着仓库走，不跟应用走（备份仓库即备份）

## 验证：怎样算成功

1. `aider --version` 输出 `aider 0.86.x`
2. 在仓库里 `aider factorial.py` 能加载文件并显示模型摘要
3. 输入"给这个函数加文档字符串"→ 文件被改动并自动提交（auto-commit）
4. 提示符里输入 `/help` 能列出全部会话内命令

## 常见问题

- **提示 `aider: command not found`**：`--user` 的脚本目录可能不在 PATH——先用
  `python -m pip show aider-chat` 确认装上了，再把用户 Scripts 目录加进 PATH，或改用 `python -m aider` 启动
- **Windows 敲 `python` 弹出应用商店**：去 python.org 装 Python 3.10–3.12（按用户安装、无需管理员），勾选 "Add to PATH"
- **报版本不支持 / Python 不对**：aider 需要 3.10–3.12；可用这些版本建 venv 后在 venv 里安装
- **国内依赖下载慢**：`PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple`
- **模型告警**：aider 会提示某模型对编辑格式支持不佳——用 `--model` 或配置文件换模型
- **升级**：`python -m pip install --upgrade --user aider-chat`

## 卸载

- `python -m pip uninstall -y aider-chat`（macOS 用 `python3 -m pip ...`）；建过 `~/.aider.conf.yml` 就一并删除
- 项目里的 `.aider.input.history` / `.aider.chat.history.md` 留在仓库中——不需要就自己删
- ⚠️ 如果把 API Key 写进了 `~/.aider.conf.yml`，删除前先导出——先备份

更多：[安装](https://aider.chat/docs/install.html) · [用法](https://aider.chat/docs/usage.html) · [配置](https://aider.chat/docs/config.html) · [模型接入](https://aider.chat/docs/llms)
