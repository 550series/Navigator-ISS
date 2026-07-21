# 贡献指南 | Contributing to Navigator ISS

感谢你对 **领航员空间站管理系统** 的关注！本文档说明如何参与本项目的开发与维护。

## 行为准则

参与本项目即代表你同意保持友善、尊重的协作态度。对技术方案有分歧时，请就事论事、对事不对人。

## 开发环境准备

- **Node.js** ≥ 20
- **包管理器**：npm（与仓库 `package-lock.json` 保持一致）

```bash
# 克隆仓库
git clone https://github.com/550series/Navigator-ISS.git
cd Navigator-ISS

# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev
```

## 常用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run check` | TypeScript 类型检查（不产出文件） |
| `npm run lint` | ESLint 代码检查 |
| `npm run build` | 类型检查 + 生产构建，输出到 `dist/` |
| `npm run preview` | 预览构建产物 |
| `npm run test` | Vitest 监听模式 |
| `npm run test:run` | 单次运行全部用例（CI 推荐） |
| `npm run test:coverage` | 生成 v8 覆盖率报告 |

提交前请确保 `npm run check`、`npm run lint`、`npm run test:run` 均通过。

## 项目结构约定

```
src/
├── components/
│   ├── layout/        # 全局布局（Sidebar、TopBar、Layout 等）
│   └── ui/            # 基础 UI 组件（StatusCard、GaugeChart、Panel 等）
├── pages/             # 页面，按模块分目录（Dashboard/Navigation/...）
├── stores/            # Zustand 状态管理，每个领域一个 store
├── data/              # 类型定义与模拟数据
├── hooks/             # 自定义 Hooks
├── lib/               # 通用工具库（如 cn）
├── utils/             # 业务工具函数（formatters、validation）
└── test/              # 测试基础设施
```

- 新增模块时，请在 `src/pages/<Module>/` 下建立子目录，并通过 `src/App.tsx` 注册路由、在 `src/components/layout/Sidebar.tsx` 添加导航项。
- 复用类 UI 优先放入 `components/ui/`，业务特定组件就近放在对应页面目录。
- 数据全部为前端模拟，请通过对应的 Zustand store 管理，不要引入真实后端依赖。

## 代码规范

- **TypeScript**：开启 `strict` 模式，新增公共 API 必须有显式类型，避免 `any`。
- **样式**：使用 Tailwind CSS 类名；如需自定义颜色/动画，扩展 `tailwind.config.js` 而非内联硬编码。
- **命名**：组件与文件使用 `PascalCase`；Hooks 以 `use` 开头；工具函数使用 `camelCase`。
- **导入路径**：统一使用 `@/` 别名（如 `@/components/ui/Panel`）。
- **提交前**：运行 `npm run lint` 与 `npm run check` 确保无报错。

## 测试要求

- 为新的 Hooks、Store、工具函数补充对应的 `__tests__/*.test.ts`。
- 测试使用 Vitest + Testing Library + jsdom，配置见 `vite.config.ts` 的 `test` 段与 `src/test/setup.ts`。
- 修复 Bug 时，请附上能复现该 Bug 的回归测试。

## 版本号与发布

- 版本号以 [`package.json`](./package.json) 为**单一事实源**，构建时通过 `vite.config.ts` 的 `define` 注入到应用页脚（`__APP_VERSION__`）。
- 请勿在代码中硬编码版本字符串，统一从 `package.json` 的 `version` 字段读取。
- 发布新版本时：更新 `package.json` 的 `version`，并在 PR 描述中注明变更范围。

## Git 与 Pull Request 流程

1. 从最新的 `main` 拉取分支：`git checkout -b feat/<short-name>` 或 `fix/<issue-id>`。
2. 提交信息使用简洁、可读的描述，推荐 [Conventional Commits](https://www.conventionalcommits.org/) 风格，例如：
   - `feat(navigation): 新增航线风险评估面板`
   - `fix(crew-system): 修复排班表跨日显示错误`
   - `docs: 同步 README 与实际路由`
3. 保持 PR 聚焦：一个 PR 解决一个问题，避免无关改动混入。
4. PR 描述中说明：动机、改动范围、是否影响现有行为、如何验证。
5. 确保所有检查项通过后再请求 Review：
   - [ ] `npm run check` 无错误
   - [ ] `npm run lint` 无错误
   - [ ] `npm run test:run` 全部通过
   - [ ] `npm run build` 成功
   - [ ] 已为新功能补充测试

## 报告问题

发现 Bug 或有功能建议，请通过 [GitHub Issues](https://github.com/550series/Navigator-ISS/issues) 提交，并包含：

- 复现步骤（最小可复现示例最佳）
- 预期行为与实际行为
- 相关环境信息（浏览器、Node 版本等）
- 如有可能，附上截图或日志

再次感谢你的贡献！
