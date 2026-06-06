# 领航员空间站管理系统 | Navigator ISS

《流浪地球》领航员空间站模拟管理界面，提供空间站日常运营核心功能的可视化交互体验。

## 功能模块

| 模块 | 路由 | 说明 |
|------|------|------|
| 总览仪表盘 | `/` | 空间站全局状态概览、核心指标仪表盘、告警摘要 |
| 状态监控 | `/monitor` | 舱室状态、能源系统、生命维持、推进系统 |
| 资源管理 | `/resources` | 物资储备、人员状态、设备管理 |
| 航线导航 | `/navigation` | 航线可视化、轨道参数、天文数据 |
| 通信系统 | `/communication` | 通信链路状态、通信记录 |
| 任务管理 | `/missions` | 任务列表、进度跟踪、子任务详情 |

## 技术栈

- **框架**：React 18 + TypeScript
- **构建**：Vite
- **样式**：Tailwind CSS 3
- **状态管理**：Zustand
- **路由**：React Router DOM v6
- **图表**：Recharts
- **动画**：Framer Motion
- **图标**：Lucide React

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run check

# 代码检查
npm run lint

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 项目结构

```
src/
├── components/
│   ├── layout/        # 布局组件（Sidebar、TopBar、Layout）
│   └── ui/            # 基础 UI 组件（StatusCard、GaugeChart、ProgressBar、Panel）
├── pages/             # 页面组件
├── stores/            # Zustand 状态管理
├── data/              # 类型定义与模拟数据
├── hooks/             # 自定义 Hooks
└── utils/             # 工具函数
```

## 部署

### Cloudflare Pages

1. 将代码推送到 GitHub 仓库
2. 在 Cloudflare Dashboard 中创建 Pages 项目，连接仓库
3. 配置构建参数：
   - **构建命令**：`npm run build`
   - **输出目录**：`dist`
   - **Node.js 版本**：20
4. 部署完成

### 其他静态托管

构建产物为 `dist/` 目录，可直接部署到任何静态文件服务器。SPA 路由需配置所有路径回退到 `index.html`。

## 设计说明

- **主色调**：深空黑（`#0a0e17`）+ 星际蓝（`#0c1e3a`）
- **强调色**：冰蓝（`#00d4ff`）+ 琥珀（`#ff8c00`）
- **状态色**：安全绿（`#00ff88`）、告警红（`#ff3b3b`）
- **字体**：Orbitron（标题）+ Rajdhani（正文）
- **特效**：全息发光边框、扫描线叠加、脉冲动画、数据流动画

## 数据说明

所有数据均为前端模拟生成，通过 Zustand Store 管理，每 3 秒自动刷新并添加随机波动，模拟实时监控效果。无需后端服务。
