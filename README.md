# AutoScraper AI - 简化版

智能网页爬取与 AI 分析 Chrome 插件（简化版，适合新手学习）

## 📚 项目结构

```
AutoScraperAI/
├── src/
│   ├── background/
│   │   └── background.ts      # 后台脚本（核心逻辑）
│   ├── content/
│   │   └── content.ts         # 内容脚本（操作页面）
│   ├── popup/
│   │   ├── popup.html         # 弹出窗口 HTML
│   │   ├── popup.css          # 弹出窗口样式
│   │   └── popup.ts           # 弹出窗口逻辑
│   └── options/
│       ├── options.html       # 设置页面 HTML
│       ├── options.css        # 设置页面样式
│       └── options.ts         # 设置页面逻辑
├── public/
│   └── icons/                 # 图标文件
├── manifest.json              # Chrome 插件配置
├── package.json               # 项目依赖
├── tsconfig.json              # TypeScript 配置
└── webpack.config.js          # 构建配置
```

## ✅ 项目简化说明

本项目已针对新手学习进行了简化：

### 1. 移除 React
- ❌ 删除了 React 和 React DOM 依赖
- ✅ 改用原生 HTML + TypeScript
- ✅ 更简单，更容易理解

### 2. 简化文件结构
- ❌ 删除了复杂的工具函数分离
- ❌ 删除了复杂的类型定义文件
- ✅ 所有功能直接写在对应的文件中
- ✅ 每个文件都有详细的中文注释

### 3. 简化构建配置
- ❌ 移除了 CSS loader（CSS 文件直接复制）
- ✅ 只保留必要的 TypeScript 编译
- ✅ 更快的构建速度

## 🎯 核心概念（学习重点）

### Chrome 插件的三个主要部分：

1. **Popup（弹出窗口）**
   - 用户看到的界面
   - 发送消息给 background
   - **文件**: `src/popup/popup.*`

2. **Background（后台脚本）**
   - 插件的"大脑"
   - 处理所有业务逻辑
   - 协调 popup 和 content
   - **文件**: `src/background/background.ts`

3. **Content Script（内容脚本）**
   - 注入到网页中
   - 可以操作页面的 DOM
   - 执行具体的页面操作
   - **文件**: `src/content/content.ts`

### 消息传递流程：

```
用户点击按钮
    ↓
popup.ts 发送消息
    ↓
background.ts 接收消息
    ↓
background.ts 发送消息给 content.ts
    ↓
content.ts 执行操作
    ↓
content.ts 返回结果
    ↓
background.ts 调用 API
    ↓
background.ts 返回结果给 popup.ts
    ↓
popup.ts 显示结果
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

```bash
npm run build
```

### 3. 加载插件

1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目的 `dist` 目录

### 4. 配置 API

1. 右键点击插件图标 → 选择"选项"
2. 输入后端 API 地址（例如：`http://localhost:3000/api`）
3. 点击"保存设置"

### 5. 使用插件

1. 访问任意网页
2. 点击浏览器工具栏中的插件图标
3. 在弹出窗口中输入任务描述
4. 点击"开始分析"按钮

## 🎓 学习路径建议

### 第 1 天：理解基础结构
1. 阅读 `popup/popup.ts` - 理解用户界面如何工作
2. 阅读 `background/background.ts` - 理解核心逻辑
3. 阅读 `content/content.ts` - 理解如何操作页面

### 第 2 天：理解消息传递
1. 在 `popup.ts` 中找到 `chrome.runtime.sendMessage`
2. 在 `background.ts` 中找到 `chrome.runtime.onMessage.addListener`
3. 理解消息如何在 popup → background → content 之间传递

### 第 3 天：尝试修改
1. 修改 `popup.html` 添加新的输入框
2. 修改 `content.ts` 添加新的页面操作
3. 修改 `background.ts` 添加新的处理逻辑

## 📖 详细学习指南

### 第一步：理解消息传递
Chrome 插件通过消息在不同部分之间通信：
- **popup → background**: 用户点击按钮，popup 发送消息给 background
- **background → content**: background 请求页面数据或发送操作指令
- **content → background**: content 返回页面数据或操作结果

### 第二步：理解文件作用
- **popup.ts**: 处理用户交互，发送消息
- **background.ts**: 处理业务逻辑，协调各个部分
- **content.ts**: 操作页面，执行具体任务

### 第三步：添加新功能
尝试添加新功能，比如：
- 在 popup 中添加更多输入选项
- 在 content 中添加新的页面操作
- 在 background 中添加数据缓存

## 🔧 开发模式

监听文件变化，自动重新构建：

```bash
npm run dev
```

修改代码后，在 Chrome 扩展程序管理页面点击"重新加载"按钮。

## 📡 后端 API 接口

后端需要提供 `POST /api/analyze` 接口：

**请求格式：**
```json
{
  "url": "https://example.com",
  "html": "<html>...</html>",
  "title": "页面标题",
  "task": "用户任务描述"
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    // 提取的数据
  },
  "actions": [
    {
      "type": "click",
      "selector": "#button-id"
    },
    {
      "type": "scroll",
      "direction": "down",
      "amount": 500
    }
  ]
}
```

## 🎓 支持的操作类型

- `click`: 点击元素（需要 `selector`）
- `scroll`: 滚动页面（需要 `direction`: "up"/"down"，可选 `amount`）
- `input`: 输入文本（需要 `selector` 和 `text`）
- `wait`: 等待（需要 `amount` 毫秒数）

## 🔍 代码注释说明

所有代码文件都包含：
- 文件顶部的功能说明
- 每个函数的作用说明
- 关键步骤的注释

建议边看代码边理解，不要急于求成！

## 📝 许可证

MIT
