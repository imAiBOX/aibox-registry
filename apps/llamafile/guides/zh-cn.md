# llamafile 安装与使用教程

一句话：**llamafile（Mozilla 出品，2.6 万+ Star）把大模型压缩进一个可执行文件**——下载、双击/运行，
就是一个完整的本地 AI 服务：终端聊天和网页界面（`http://localhost:8080`）同时可用，零安装零配置。

## 你将得到

- **单文件运行时**：llama.cpp + 运行库打成一个文件，放进用户目录就能跑，不装任何依赖
- 两种用法：① 直接跑官方预构建 `.llamafile`（权重内置，下载即聊天）；② 用运行器 + 任意 GGUF 外部模型
- 内置网页版聊天（`localhost:8080`）和 OpenAI 兼容 API，其他工具可直接接入
- GPU 加速：Apple Metal（Apple Silicon）、NVIDIA CUDA、AMD ROCm、Vulkan（官方文档实证）

## 准备（2 分钟）

- **Windows 10+（仅 AMD64，CPU 需支持 AVX，约 2006 年后的 Intel）** 或 **macOS 12+**（Apple Silicon GPU 加速仅限 ARM64）
- 磁盘留 2~8 GB（预构建模型 1.77 GB 起，大模型另算）；内存 8 GB 起步
- ⚠️ Windows 单文件程序上限 4 GB：超过 4 GB 的模型请用"运行器 + 外部 GGUF"方式（官方文档说明）
- 不需要：管理员权限、Python、Node、GPU（有 GPU 更快）

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **llamafile** → 点「安装」
2. AiBOX 下载官方发布页的单文件运行器（sha256 校验，国内走加速通道）：
   Windows 放到 `%LOCALAPPDATA%\Programs\Llamafile\llamafile.exe`，macOS 放到
   `/Applications/Llamafile/llamafile` 并加执行权限——**全程无需管理员**

### 路线 B：手动安装（官方渠道）

直接跑官方预构建模型（macOS/Linux，官方 quickstart 命令）：

```bash
curl -LO https://huggingface.co/mozilla-ai/llamafile_0.10/resolve/main/Qwen3.5-0.8B-Q8_0.llamafile
chmod +x Qwen3.5-0.8B-Q8_0.llamafile
./Qwen3.5-0.8B-Q8_0.llamafile
```

Windows：下载后把文件重命名加 `.exe` 再运行（官方 README 要求）。只想用运行器的用户，
从 [Releases](https://github.com/mozilla-ai/llamafile/releases) 下载 `llamafile-0.10.6` 即可。

## 配置（选一个模型）

1. **最省事**：跑预构建 `.llamafile`——文件自带权重，运行即聊天，无任何配置
2. **自由搭配**：下载任意 GGUF（如 gpt-oss、Qwen、Llama 系列），用运行器加载：

```bash
# macOS/Linux
/Applications/Llamafile/llamafile -m /path/to/model.gguf
# Windows
%LOCALAPPDATA%\Programs\Llamafile\llamafile.exe -m C:\path\to\model.gguf
```

3. 需要 OpenAI 兼容 API 的工具（如 Cherry Studio、Cline）：填 `http://localhost:8080/v1`
4. GPU 不生效时检查 `~/.llamafile`（官方文档：GPU 动态库按"同目录 → 包内 → ~/.llamafile → $HOME"顺序查找）

## 验证：怎样算成功

1. 运行后终端出现聊天界面（或浏览器打开 `http://localhost:8080` 有 Web UI）
2. 发一句"你好" → **收到正常回复** = 模型真的跑起来了
3. 命令行验证版本（待真机确认输出格式）：

```bash
llamafile --version   # 预期输出含 0.10.6
```

## 常见问题

- **Windows 提示文件过大无法运行**：4 GB 单文件限制——改用运行器 + 外部 GGUF（见上）
- **启动报 "AVX" 错误**：CPU 太老（2006 年前的 Intel / 2003 年前的 AMD），换机器或换构建
- **macOS 提示无法打开/已损坏**：系统设置 → 隐私与安全性 → 仍要打开（对下载的文件右键打开也可）
- **端口 8080 被占用**：加参数换端口，如 `llamafile -m model.gguf --port 8081`
- **升级**：AiBOX 重新安装新版即可（单文件直接覆盖），或从 Releases 下载新文件替换

## 卸载

- Windows：删除 `%LOCALAPPDATA%\Programs\Llamafile`；macOS：删除 `/Applications/Llamafile`
- 可选清理：`~/.llamafile`（GPU 库缓存）和你下载的 `.llamafile` / `.gguf` 模型文件
- ⚠️ 模型文件常有几个 GB——确认不再需要再删，或先挪走备份

更多：[官方文档](https://docs.mozilla.ai/llamafile) · [快速上手](https://docs.mozilla.ai/llamafile/getting-started/quickstart) · [Releases](https://github.com/mozilla-ai/llamafile/releases)
