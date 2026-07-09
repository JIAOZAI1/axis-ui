# axis-ui 项目说明

## 项目目标

企业级 Vue 3 组件库,是《企业级前端设计规范方案》v1.0 的代码实现。目标:

1. 以**设计 Token** 为唯一事实源,组件样式零硬编码;
2. 暗色模式与品牌主题**零组件改动**切换(仅替换语义 Token 映射);
3. 提供中后台开发所需的核心组件(当前 31 个)+ 完整 Markdown 文档 + Demo 演示站;
4. 以 npm 包发布到 **GitHub Packages**(`@jiaozai1/axis-ui`)。

设计规范原文在会话末尾自动导入(见下方 import),它是所有视觉/交互决策的最高依据。

## 架构

规范定义的四层架构,本仓库实现 L1-L3:

```text
L4 业务模板层   (未实现,规划中)
L3 组件库层     src/components/*  每组件可含 --ax-* 组件 Token
L2 设计规范层   语义 Token(--axis-color-primary 等)
L1 设计 Token 层 全局 Token(--axis-blue-6 等,仅 tokens.css 内部引用)
```

### 目录结构

```text
src/
├── styles/
│   ├── tokens.css     # L1 全局 + L2 语义 Token(亮色);断点/容器/布局尺寸
│   ├── dark.css       # 暗色语义映射([data-theme="dark"])
│   └── base.css       # 基础样式、.ax-container、prefers-reduced-motion 降级
├── components/<name>/ # Ax<Name>.vue(+ context.ts 用于 provide/inject)
├── theme.ts           # setTheme / getTheme / toggleTheme / applyBrandTheme
├── tokens.ts          # 断点等 JS 常量:breakpoints / mediaUp / matchBreakpoint
└── index.ts           # 库入口:全部组件注册 + 具名导出 + 类型导出
demo/                  # Demo 演示站(App.vue 单页全组件展示,暗色/品牌切换)
docs/                  # Markdown 文档(getting-started / design-tokens / theming / publishing / components/*)
scripts/release.sh     # 唯一发布入口
.github/workflows/publish.yml  # GitHub Release 触发的 CI 发布
deploy/                # Docker/K8s 部署文件(Demo 站)
```

### 组件清单(31)

- 通用:Button、Link
- 布局:Row/Col(24 列栅格)、Space
- 表单:Form/FormItem(校验)、Input、Select、Checkbox(+Group)、Radio(+Group)、Switch
- 展示:Card、Descriptions(+Item)、Typography(Text/Title)、Tag、Badge、Table、Tabs(+TabPane)
- 导航:Menu(+SubMenu/MenuItem)、Pagination
- 反馈:Alert、Message(命令式)、Modal、Tooltip

## 技术栈与命令

Vue 3.5 + Vite 6 + TypeScript(`<script setup lang="ts">`),无其他运行时依赖,Vue 是 peer dependency。

```bash
npm run dev         # Demo 演示站(端口默认 5173)
npm run build       # Demo 静态站 -> dist-demo/
npm run build:lib   # 库产物 -> dist/(ESM + UMD + CSS)
```

改动后验证:两个 build 都要跑通;涉及交互的改动用 `vite preview --outDir dist-demo` 冒烟。

## 硬性约束(来自设计规范,violate 即 bug)

1. **只消费语义/组件 Token**:组件与业务样式禁止硬编码色值/间距/圆角/阴影,禁止直接引用全局 Token(如 `--axis-blue-6`);
2. **8px 网格**:间距只用 `--axis-space-*`,禁止 13px/17px 类魔法数字;
3. **z-index 收敛**:只用 `--axis-z-dropdown(1000)/modal(1010)/message(1020)/tooltip(1030)` 四档,禁止手写数字;
4. **动效**:时长/缓动只取 `--axis-motion-*`,必须兼容 `prefers-reduced-motion`(base.css 已全局降级);
5. **对比度**:正文 >= 4.5:1(WCAG AA),必填标记用 `color-error`;
6. **CSS 变量不能进 @media**:断点用 src/tokens.ts 的 JS 常量或与 tokens.css 注释一致的字面量;
7. 新组件必须:`Ax` 前缀 + `defineOptions({ name })`、注册进 src/index.ts(import/export/components 数组三处)、写 docs/components/<name>.md、加 Demo 区块、更新 README 组件表与计数。

## 发布(重要)

- **唯一入口**:`./scripts/release.sh [patch|minor|major|x.y.z]`,先 `--dry-run` 预检;项目 skill `/release` 封装了完整流程。**禁止手动 npm publish / npm version / git tag**;
- 用户要求(2026-07-07):axis-ui 的发布一律通过 `scripts/release.sh` 执行,不要手动执行 npm version / npm publish / git tag;
- 发布流程:先 `./scripts/release.sh --dry-run`,再 `./scripts/release.sh patch|minor|major`;
- 版本策略:新增组件/Token = minor;值微调/bug 修复/现有组件加属性 = patch;删除/重命名 API = major 且必须有 codemod + 废弃期;
- registry:GitHub Packages,scope `@jiaozai1`(必须小写);token 在 `~/.npmrc` 的 `//npm.pkg.github.com/:_authToken=` 行(曾踩坑:token 挂到 npmjs 行导致 ENEEDAUTH);项目 `.npmrc` 只放 scope 映射,严禁写 token;
- CI:GitHub 上创建 Release 也会触发自动发布(publish.yml),同一版本不要两边重复发。

## 文档索引

- README.md — 总览与组件表
- docs/getting-started.md — 安装与引入
- docs/design-tokens.md — 全部 Token 速查(改 Token 必须同步此文件)
- docs/theming.md — 暗色/品牌主题机制
- docs/publishing.md — 发布与消费方接入
- docs/components/*.md — 各组件 API(改组件必须同步)

## 设计规范原文(每次会话自动加载)

@企业级前端设计规范方案.md
