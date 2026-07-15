# axis-ui

> 企业级 Vue 3 组件库 · 基于设计 Token 体系构建 · 支持暗色模式与品牌主题定制
>
> 实现自《企业级前端设计规范方案》v1.0(见 [企业级前端设计规范方案.md](./企业级前端设计规范方案.md))

## 特性

- 🎨 **设计 Token 驱动** — 严格遵循「全局 → 语义 → 组件」三层 Token 架构,组件样式零硬编码,全部消费 `--axis-*` CSS 变量
- 🌙 **暗色模式** — 一行 `setTheme('dark')` 全局切换,基于语义 Token 重映射(海拔分层背景、品牌色降饱和、阴影弱化),组件零改动
- 🏷 **品牌主题定制** — `applyBrandTheme()` 运行时覆盖语义 Token,即刻全站换肤
- ♿ **无障碍** — 遵循 WCAG AA 对比度要求;所有动效响应 `prefers-reduced-motion` 自动降级;组件带 ARIA 角色
- 📦 **34 个核心组件** — 覆盖通用、表单(含 Form 校验)、布局、数据展示、反馈五大类
- 🔌 **全量 / 按需两种引入方式**,支持 ESM 与 UMD

## 快速开始

从 GitHub Packages 安装(需先在项目 `.npmrc` 配置 registry,详见[发布与安装指南](./docs/publishing.md)):

```bash
npm install @jiaozai1/axis-ui vue
```

```ts
// main.ts — 全量引入
import { createApp } from 'vue'
import AxisUI from 'axis-ui'
import 'axis-ui/dist/axis-ui.css'
import App from './App.vue'

createApp(App).use(AxisUI).mount('#app')
```

```vue
<template>
  <ax-button type="primary" @click="onSave">保存</ax-button>
</template>
```

按需引入:

```ts
import { AxButton, AxMessage, setTheme } from 'axis-ui'
import 'axis-ui/dist/axis-ui.css'
```

详见 [快速上手指南](./docs/getting-started.md)。

## 本仓库开发

```bash
npm install
npm run dev         # 启动 Demo 演示站(全组件展示 + 暗色/品牌主题切换)
npm run build:lib   # 构建组件库产物到 dist/
npm run build       # 构建 Demo 静态站到 dist-demo/
```

发布:本地执行 `./scripts/release.sh patch|minor|major`(构建 → 版本提升 → publish → git 提交打 tag → 推送,先 `--dry-run` 预检),或在 GitHub 创建 Release 触发[自动发布工作流](./.github/workflows/publish.yml)。详见[发布指南](./docs/publishing.md)。

## 组件一览

| 分类 | 组件 | 文档 |
|------|------|------|
| 通用 | Icon 图标(内置 76 个线性图标) | [docs/components/icon.md](./docs/components/icon.md) |
| 通用 | Button 按钮 | [docs/components/button.md](./docs/components/button.md) |
| 通用 | Link 链接 | [docs/components/link.md](./docs/components/link.md) |
| 布局 | Grid 栅格(Row / Col) | [docs/components/grid.md](./docs/components/grid.md) |
| 布局 | Space 间距 | [docs/components/space.md](./docs/components/space.md) |
| 表单 | Form 表单(含 FormItem) | [docs/components/form.md](./docs/components/form.md) |
| 表单 | Input 输入框 | [docs/components/input.md](./docs/components/input.md) |
| 表单 | Select 选择器 | [docs/components/select.md](./docs/components/select.md) |
| 表单 | Checkbox 多选框(含 Group) | [docs/components/checkbox.md](./docs/components/checkbox.md) |
| 表单 | Radio 单选框(含 Group) | [docs/components/radio.md](./docs/components/radio.md) |
| 表单 | Switch 开关 | [docs/components/switch.md](./docs/components/switch.md) |
| 展示 | Card 卡片 | [docs/components/card.md](./docs/components/card.md) |
| 展示 | Typography 排版(Text / Title) | [docs/components/typography.md](./docs/components/typography.md) |
| 展示 | Descriptions 描述列表(含 Item) | [docs/components/descriptions.md](./docs/components/descriptions.md) |
| 展示 | Tag 标签 | [docs/components/tag.md](./docs/components/tag.md) |
| 展示 | Badge 徽标 | [docs/components/badge.md](./docs/components/badge.md) |
| 展示 | Table 表格 | [docs/components/table.md](./docs/components/table.md) |
| 展示 | Tabs 标签页 | [docs/components/tabs.md](./docs/components/tabs.md) |
| 展示 | Steps 步骤条 | [docs/components/steps.md](./docs/components/steps.md) |
| 导航 | Menu 菜单(含 SubMenu / MenuItem) | [docs/components/menu.md](./docs/components/menu.md) |
| 导航 | Pagination 分页 | [docs/components/pagination.md](./docs/components/pagination.md) |
| 反馈 | Alert 警告提示 | [docs/components/alert.md](./docs/components/alert.md) |
| 反馈 | Message 全局提示 | [docs/components/message.md](./docs/components/message.md) |
| 反馈 | Modal 对话框 | [docs/components/modal.md](./docs/components/modal.md) |
| 反馈 | WizardModal 向导弹窗 | [docs/components/wizard-modal.md](./docs/components/wizard-modal.md) |
| 反馈 | Tooltip 文字提示 | [docs/components/tooltip.md](./docs/components/tooltip.md) |

## 文档目录

- [快速上手](./docs/getting-started.md)
- [设计 Token 速查表](./docs/design-tokens.md)
- [主题定制(暗色模式 / 品牌主题)](./docs/theming.md)
- [发布到 GitHub Packages](./docs/publishing.md)
- [组件文档](./docs/components/)

## 设计原则(摘自设计规范)

1. **只消费语义 Token** — 业务与组件样式禁止直接引用全局 Token(如 `--axis-blue-6`)或硬编码色值/间距;
2. **8px 网格间距** — 组件内 4–16px、组件间 16–24px、区块间 24–48px,禁止魔法数字;
3. **z-index 收敛** — 只使用 `--axis-z-dropdown/modal/message/tooltip` 四档;
4. **动效三场景** — 仅用于状态变化、层级出入场、反馈确认,时长与缓动一律取 Token。

## 目录结构

```
axis-ui/
├── src/
│   ├── styles/
│   │   ├── tokens.css        # L1 全局 + L2 语义 Token(亮色)
│   │   ├── dark.css          # 暗色语义映射
│   │   └── base.css          # 基础样式与动效降级
│   ├── components/           # 各组件(SFC 内定义 L3 组件 Token)
│   ├── theme.ts              # setTheme / applyBrandTheme 等主题工具
│   └── index.ts              # 库入口
├── demo/                     # Demo 演示站
├── docs/                     # Markdown 文档
└── vite.config.ts            # demo / lib 双模式构建
```

## License

MIT
