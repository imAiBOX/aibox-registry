# Stable Diffusion WebUI（A1111）安装教程

## 准备
- **系统**：Windows 10/11 或 macOS 12+（有独立显卡效果最佳，核显/CPU 也能跑）
- **前置**：Git + Python 3.10+（免费，用户级安装）
- **磁盘**：程序约 1GB；首次启动再下载 PyTorch ~2.5GB 与模型文件
- **权限**：全程免管理员，装在你的用户目录

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录找到 **Stable Diffusion WebUI** → 点「安装」
2. 下载源码归档（哈希校验）→ 克隆到 `~/sd-webui` → 建虚拟环境装依赖
3. 完成后启动本地服务，浏览器打开即用

## 手动安装
```bash
git clone --depth 1 -b v1.10.1 https://github.com/AUTOMATIC1111/stable-diffusion-webui.git ~/sd-webui
cd ~/sd-webui && python -m venv venv && ./venv/bin/pip install -r requirements.txt
./venv/bin/python launch.py
```

## 配置与验证
1. 首次启动自动下载模型（可换国内镜像加速：设置 `PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple`）
2. 浏览器打开输出的 `http://127.0.0.1:7860`
3. 生成一张图成功即安装完成

## 常见问题
- **依赖下载慢**：用上面的清华镜像；或先关掉重跑
- **显存不足**：启动参数加 `--medvram` 或 `--lowvram`

## 卸载
删除 `~/sd-webui`（含模型与生成图，先备份）；AiBOX「管理 → 卸载」可代劳。
