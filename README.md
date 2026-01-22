# 🧠 Image Classifier (Next.js + TensorFlow.js WASM)

一个基于 **Next.js App Router** 与 **TensorFlow.js（WASM backend）** 的前端图像分类工具。
 用户上传图片后，应用会自动使用 **MobileNet** 模型进行识别，并展示 Top-3 分类结果及概率。

## ✨ Features

- 📷 **图片上传即预测**（无需手动点击）
- ⚡ **TensorFlow.js WASM Backend**（稳定、跨平台、避免 WebGL 坑）
- 🧠 **MobileNet 预训练模型**
- 🎯 显示 **Top-3 分类结果 + 概率**
- 💻 纯前端实现，无需后端
- 🎨 **CSS Modules** 打造简洁 AI / SaaS 风格界面
- 🚀 基于 **Next.js App Router**

## 🛠 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **ML Runtime**: TensorFlow.js
- **Backend**: WASM (`@tensorflow/tfjs-backend-wasm`)
- **Model**: MobileNet
- **Styling**: CSS Modules
- **Runtime**: Node.js 22+

## 📂 Project Structure

```
image-classifier-next/
├─ app/
│  ├─ layout.tsx        # Root layout (html / body)
│  ├─ page.tsx          # Main page (UI + logic)
│  ├─ page.module.css   # Page-level styles
│  └─ tfjs.ts           # TFJS + WASM backend initialization
├─ public/
│  └─ tfjs/             # WASM files (tfjs-backend-wasm)
├─ package.json
└─ README.md
```

## 🚀 Getting Started

### 1️⃣ Clone the repository

```
git clone <https://github.com/kwiini/image-classifier.git>
cd image-classifier-next
```

### 2️⃣ Install dependencies

```
npm install
```

> Node.js version: **22+**
>  （本项目未降级 Node）

------

### 3️⃣ Start the development server

```
npm run dev
```

Open in browser:

```
http://localhost:3000
```

------

## 🧠 How It Works

1. 页面加载时初始化 **TensorFlow.js WASM backend**
2. 异步加载 **MobileNet** 模型（仅一次）
3. 用户上传图片
4. `<img>` 加载完成后自动触发预测
5. 调用 `model.classify(image, 3)`
6. 展示 Top-3 分类结果及概率

------

## ⚙️ TensorFlow.js WASM Notes

- 使用 **WASM backend** 替代 WebGL，避免浏览器 / Vite / 驱动兼容问题
- `.wasm` 文件通过 `public/tfjs/` 静态目录加载
- 在 `tfjs.ts` 中显式设置 backend 并调用 `tf.ready()`

------

## 🎨 UI Design

- 深色背景 + AI / SaaS 风格
- 卡片式布局

------

## 📌 Known Limitations

- 当前仅支持单张图片预测
- 使用预训练 MobileNet，未进行自定义训练
- 不包含后端与数据持久化

------

## 🔮 Possible Improvements

- 多图片批量预测
- 预测结果可视化（进度条 / 图表）
- 支持切换模型（MobileNet / EfficientNet）
- 抽象成自定义 Hook（`useImageClassifier`）
- 部署到 Vercel / Cloudflare Pages

------

## 📄 License

MIT License

------

## 🙌 Acknowledgements

- TensorFlow.js
- MobileNet
- Next.js