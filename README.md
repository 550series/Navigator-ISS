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
| 船员系统 | `/crew-system/*` | 船员花名册、技能矩阵、心理健康、绩效追踪、排班管理 |
| 运维中心 | `/operations/*` | 告警中心、维修日志、应急响应预案 |
| 科研中心 | `/research/*` | 实验管理、太空环境监测、天文观测记录 |
| 操作日志 | `/logs` | 系统操作记录、事件追溯 |
| 系统设置 | `/settings` | 显示、数据、仿真、事件、关于等系统级配置 |

## 技术栈

- **框架**：React 18 + TypeScript
- **构建**：Vite 6
- **样式**：Tailwind CSS 3
- **状态管理**：Zustand
- **路由**：React Router DOM v7
- **图表**：Recharts
- **动画**：Framer Motion
- **图标**：Lucide React
- **PWA**：`vite-plugin-pwa`（`autoUpdate` + Workbox 运行时缓存），支持可安装、离线回退的应用形态
- **测试**：Vitest + Testing Library + jsdom
- **部署**：Cloudflare Pages（见 `wrangler.toml` 与 `public/_redirects`）

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

# 单元测试（watch 模式）
npm run test

# 单次运行全部用例（CI 推荐）
npm run test:run

# 生成覆盖率报告（v8 provider）
npm run test:coverage
```

## 项目结构

```
src/
├── components/
│   ├── layout/        # 布局组件（Sidebar、TopBar、Layout、EventSimulator）
│   └── ui/            # 基础 UI 组件（StatusCard、GaugeChart、ProgressBar、Panel 等）
├── pages/             # 页面组件（按模块分目录，含 Dashboard/Monitor/Navigation 等）
├── stores/            # Zustand 状态管理（含 __tests__）
├── data/              # 类型定义与模拟数据
├── hooks/             # 自定义 Hooks（含 __tests__）
├── lib/               # 通用工具库（如 cn 类名合并）
├── utils/             # 工具函数（formatters、validation，含 __tests__）
└── test/              # 测试基础设施（setup、全局 mock）
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

仓库根目录的 `wrangler.toml` 与 `public/_redirects`（SPA 回退规则）已为 Cloudflare Pages 预置。

### 其他静态托管

构建产物为 `dist/` 目录，可直接部署到任何静态文件服务器。SPA 路由需配置所有路径回退到 `index.html`。

## PWA

本项目已通过 `vite-plugin-pwa` 启用渐进式 Web 应用能力，构建时自动生成 Service Worker 与 `manifest.webmanifest`。

### 能力

- **可安装**：在桌面/移动浏览器中可通过「安装」将应用添加到主屏幕，以独立窗口运行
- **自动更新**：`registerType: 'autoUpdate'`，新版本发布后自动在后台拉取并激活
- **离线可用**：Workbox 预缓存应用壳（JS/CSS/HTML/图标/字体），断网时回退到 `public/offline.html`
- **运行时缓存**：Google Fonts（`googleapis.com` / `gstatic.com`）采用 `CacheFirst` 策略，长期复用
- **图标完整**：提供 192/512 PNG（`any` + `maskable` 双变体）与 180×180 `apple-touch-icon.png`，兼容 iOS Safari

### 安装方式

- **桌面 Chrome/Edge**：地址栏右侧「安装」图标 → 安装
- **Android Chrome**：菜单 → 「添加到主屏幕」
- **iOS Safari**：分享 → 「添加到主屏幕」（使用 `apple-touch-icon.png` 作为图标）

### 图标资源

图标源文件为 `public/pwa-512x512.svg`，PNG 资源由 `sharp` 从 SVG 生成。如需重新生成（修改源 SVG 后）：

```bash
npm run generate-pwa-assets
```

生成产物：

| 文件 | 用途 |
|------|------|
| `pwa-192x192.png` / `pwa-512x512.png` | manifest `purpose: any` |
| `pwa-192x192-maskable.png` / `pwa-512x512-maskable.png` | manifest `purpose: maskable`（带安全区内边距） |
| `apple-touch-icon.png` | iOS Safari 主屏图标 |

### 开发调试

开发模式下 PWA 同样启用（`devOptions.enabled: true`），可在 `npm run dev` 中通过 DevTools → Application → Service Workers 验证。生产构建后使用 `npm run preview` 检查最终 SW 行为。

## 设计说明

- **主色调**：深空黑（`#0a0e17`）+ 星际蓝（`#0c1e3a`）
- **强调色**：冰蓝（`#00d4ff`）+ 琥珀（`#ff8c00`）
- **状态色**：安全绿（`#00ff88`）、告警红（`#ff3b3b`）
- **字体**：Orbitron（标题）+ Rajdhani（正文）
- **特效**：全息发光边框、扫描线叠加、脉冲动画、数据流动画

## 数据说明

所有数据均为前端模拟生成，通过 Zustand Store 管理，每 3 秒自动刷新并添加随机波动，模拟实时监控效果。无需后端服务。

## 协作

- 开源协议见 [LICENSE](./LICENSE)
- 贡献指南见 [CONTRIBUTING.md](./CONTRIBUTING.md)
- 版本号以 `package.json` 为单一事实源，构建时通过 Vite 注入页脚
