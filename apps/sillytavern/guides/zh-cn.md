# SillyTavern 安装教程

## 准备
- **系统**：Windows 10/11 或 macOS 12+
- **前置**：Git + Node.js 18+（没有先装，均为免费用户级安装）
- **权限**：全程免管理员，程序装在你的用户目录

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录里找到 **SillyTavern** → 点「安装」
2. AiBOX 克隆源码到 `~/SillyTavern`（哈希校验），首次启动自动装依赖
3. 完成后浏览器打开本地地址即可使用

## 手动安装
```bash
git clone --depth 1 -b 1.19.0 https://github.com/SillyTavern/SillyTavern.git ~/SillyTavern
cd ~/SillyTavern && ./start.sh
```
Windows 可用 Git Bash 执行同样命令。

## 配置与验证
1. 浏览器打开终端输出的 `http://127.0.0.1:8000`（默认）
2. 右上角选择连接方式：OpenAI 兼容 API / Claude / Kobold 等，填入 key 或本地地址
3. 发一条角色对话，模型正常回复即成功

## 常见问题
- **start.sh 报缺 Node**：安装 Node.js 18+ 后重开终端
- **端口被占**：`./start.sh --port 8001` 换端口

## 卸载
删除 `~/SillyTavern` 目录与 `%APPDATA%/SillyTavern`（或 `~/Library/Application Support/SillyTavern`）；AiBOX「管理 → 卸载」可代劳。
