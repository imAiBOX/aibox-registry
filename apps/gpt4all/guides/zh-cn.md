# GPT4All 安装与使用教程

一句话：**GPT4All（Nomic 出品，v3.10.0）是完全离线的本地大模型桌面聊天软件**——
不用 API、不需要显卡，在应用里下载模型就能聊天，还能把本地文件夹变成**带出处引用**的私有知识库（LocalDocs）。

## 你将得到

- 100% 本地对话：模型跑在你自己电脑上（llama.cpp 内核），数据不出机器
- 应用内模型库：从 HuggingFace 下载 GGUF 模型（3–13B 参数最适合普通电脑）
- LocalDocs 知识库：索引一个文件夹后提问，回答下方列出 **Sources** 出处（Nomic 嵌入模型本机计算）
- 可选：本地 OpenAI 兼容 API `http://localhost:4891/v1`，别的软件也能调用你的本地模型
- 可选：在 Models 页接云端服务商 Key（这不会下载任何模型）

## 准备（3 分钟）

| 需要 | 说明 |
|---|---|
| **Windows x64** | 官方要求：Intel Core i3 二代 / AMD Bulldozer 或更好 |
| **Windows ARM** | 支持高通 Snapdragon / 微软 SQ1 / SQ2 |
| **macOS** | Monterey 12.6 及以上（Apple Silicon 效果最好） |
| 内存 / 磁盘 | 小模型约 4 GB 内存（Phi-3 Mini 2.18 GB、Mini Orca 1.98 GB）；Llama 3 8B q4_0 文件 4.66 GB / 需 8 GB 内存；磁盘留 5 GB 以上 |
| Linux | 官方有 `.run` 安装器和社区 Flathub 包——AiBOX 目前只提供 Windows/macOS |

不需要：显卡（Vulkan 加速是可选项）、管理员权限（按当前用户安装）、Python、Node 或 Docker。

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **GPT4All** → 点「安装」
2. AiBOX 下载官方安装包（sha256 校验，国内自动走加速通道），以官方 Qt 静默模式（`--silent`）执行：
   Windows 装到当前用户目录 `%USERPROFILE%\gpt4all`（**零提权**），主程序在
   `%USERPROFILE%\gpt4all\bin\chat.exe`；macOS 装入 `/Applications`（`GPT4All.app`）

### 路线 B：手动安装（官方渠道）

- **Windows**：从 [gpt4all.io](https://gpt4all.io) 或
  [GitHub Releases](https://github.com/nomic-ai/gpt4all/releases) 下载 x64（或 ARM）安装包，双击按向导完成
- **macOS**：下载 `gpt4all-installer-darwin.dmg`，打开后运行里面的安装器
- **Linux**：`gpt4all-installer-linux.run` 或 Flathub 包（手动路线）

## 配置：下载第一个模型（你只需要做这一步）

1. 启动 GPT4All → 点 **Start Chatting**
2. 左侧菜单 **Models** → **+ Add Model** → 在 Explore 列表里搜索 → **Download**
   - 新手推荐：**Llama 3 Instruct**（4.66 GB，需 8 GB 内存）；内存紧张选
     **Phi-3 Mini**（2.18 GB / 4 GB）或 **Mini Orca**（1.98 GB / 4 GB）
3. **Chats** → **Load Default Model** → 发一句话，有正常回复即全链路通
4. **LocalDocs（可选）**：LocalDocs → **+ Add Collection** → 起名并选一个文件夹 → **Create**；
   出现绿色 **Ready** 后，在聊天页右上角打开 LocalDocs 开关
5. **本地 API（可选）**：Settings → Application → Advanced → 勾选 **Enable Local API Server**
   （默认端口 `4891`，OpenAI 兼容）

## 验证：怎样算成功

1. `"%USERPROFILE%\gpt4all\bin\chat.exe" --version` 输出 `3.10.0`
   （macOS：`/Applications/GPT4All.app/Contents/MacOS/gpt4all --version`）
2. Models 页能看到已下载的模型
3. 聊天发出后有连贯回复 = 应用 + 模型 + 推理全部正常
4. 强验证（API）：开启本地服务器后 `curl http://localhost:4891/v1/models` 能列出模型
5. LocalDocs：问一个**只有这份文件才有答案**的问题 → 回答下方出现 **Sources** 出处

## 常见问题

- **Error loading models（模型加载失败）**：多为 HuggingFace 上的权重与后端不兼容——
  改用应用 Models 页里官方支持列表的模型（官方排障文档）
- **回答胡言乱语 / 不连贯**：换个模型重试；量化后的小模型能力有限，Llama 3 8B q4_0 是稳妥默认
- **问我的文件答不对**：打开 LocalDocs 挂上上下文，并在提问里写"根据文档……"——相关片段进提示词后准确率明显提高
- **LocalDocs 没引用我的文件**：偏弱的模型会忽略检索片段；提问时加"根据提供的文件"，并确认集合是 **Ready**
- **模型存在哪？** Settings → Application → Download Path
  （Windows 默认 `%LOCALAPPDATA%\nomic.ai\GPT4All`）
- **API 连不上**：只监听 HTTP、只绑 `127.0.0.1`（不含 `::1`），默认端口 4891——官方文档明确说明

## 卸载

- **Windows**：先试 设置 → 应用 → GPT4All → 卸载；若没有卸载条目，删除 `%USERPROFILE%\gpt4all` 目录；
  下载的模型与数据在 `%LOCALAPPDATA%\nomic.ai\GPT4All`，不需要了可一并删除（释放数 GB）
- **macOS**：退出应用后把 `GPT4All.app` 拖进废纸篓；
  想连模型一起清：再删 `~/Library/Application Support/nomic.ai/GPT4All`

更多：[官方文档 docs.gpt4all.io](https://docs.gpt4all.io) · [官网 gpt4all.io](https://gpt4all.io) · [仓库](https://github.com/nomic-ai/gpt4all)
