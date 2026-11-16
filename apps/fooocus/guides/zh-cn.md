# Fooocus 安装教程

## 准备
- **系统**：Windows 10/11 或 macOS 12+（有显卡最佳）
- **前置**：Git + Python 3.10+（免费，用户级安装）
- **磁盘**：首次启动下载 PyTorch ~2.5GB 与模型
- **权限**：全程免管理员

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录找到 **Fooocus** → 点「安装」
2. 源码哈希校验后克隆到 `~/Fooocus`，虚拟环境自动装依赖
3. 启动即用——Fooocus 以「一键、少调参」著称

## 手动安装
```bash
git clone --depth 1 -b v2.5.5 https://github.com/lllyasviel/Fooocus.git ~/Fooocus
cd ~/Fooocus && python -m venv venv && ./venv/bin/pip install -r requirements_versions.txt
./venv/bin/python entry_point.py
```

## 配置与验证
1. 首次启动下载模型（慢可设 `PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple`）
2. 浏览器打开 `http://127.0.0.1:7860`
3. 输入提示词出图即成功

## 常见问题
- **和 A1111 怎么选**：想要简单出图选 Fooocus；要装插件生态选 A1111
- **加载慢**：首次启动属正常（模型下载）

## 卸载
删除 `~/Fooocus`（模型与生成图在内，先备份）；AiBOX「管理 → 卸载」可代劳。
