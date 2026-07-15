# 主题定制

axis-ui 的主题机制完全通过**替换 CSS 变量作用域**实现,组件与业务代码无感知。

## 暗色模式

### 切换 API

```ts
import { setTheme, getTheme, toggleTheme } from 'axis-ui'

setTheme('dark')          // 开启暗色
setTheme('light')         // 回到亮色
getTheme()                // 'light' | 'dark'
const next = toggleTheme() // 切换并返回切换后的模式
```

原理:`setTheme('dark')` 在 `<html>` 根元素上设置 `data-theme="dark"`,`dark.css` 中的语义 Token 重映射随之生效:

```css
:root { /* 亮色映射 */
  --axis-color-bg-container: #ffffff;
  --axis-color-text-primary: rgba(0, 0, 0, 0.88);
}
[data-theme="dark"] { /* 暗色映射 */
  --axis-color-bg-container: #1f1f1f;
  --axis-color-text-primary: rgba(255, 255, 255, 0.85);
}
```

### 暗色映射的设计要点

暗色不是简单反色,而是按规范重建一套映射:

| 策略 | 实现 |
|------|------|
| 背景分级表达海拔 | `bg-layout: #141414` → `bg-container: #1f1f1f` → `bg-elevated: #2a2a2a`,海拔越高越亮 |
| 品牌色降饱和一档 | `color-primary` 由 `blue-6` 改指 `blue-5`,避免高饱和色在暗底上刺眼 |
| 阴影弱化 | 暗色下阴影透明度提高但视觉减弱,层级主要靠描边(`border` 透明度提高)与背景亮度差表达 |
| 文字用白色透明度 | `rgba(255,255,255,.85/.65/.45/.25)` 四级,任意底色上层次正确 |
| 钉死 Token 不反转 | `text-inverse`(饱和实心底上的文字)不参与暗色重映射,始终白色——它的语义锚点是背景色而非主题 |

### 跟随系统偏好

```ts
const media = window.matchMedia('(prefers-color-scheme: dark)')
setTheme(media.matches ? 'dark' : 'light')
media.addEventListener('change', (e) => setTheme(e.matches ? 'dark' : 'light'))
```

## 品牌主题定制

子品牌 / 私有化客户定制时,只需覆盖品牌色相关的语义 Token,其余全部继承默认值:

```ts
import { applyBrandTheme } from 'axis-ui'

// 极客紫主题包
applyBrandTheme({
  'color-primary': '#722ed1',
  'color-primary-hover': '#9254de',
  'color-primary-active': '#531dab',
  'color-primary-bg': '#f9f0ff',
  'color-primary-border': '#d3adf7'
})
```

`applyBrandTheme` 将键名加上 `--axis-` 前缀后写入根元素的行内样式,优先级高于样式表中的默认值,因此亮暗两种模式下均生效。

> 生产环境建议:主题包以独立 CSS 文件形式发布(覆盖 `:root` 与 `[data-theme="dark"]` 两个作用域),经色板算法(如 Ant Design 色板算法)从品牌主色自动派生 10 级色阶,并走 Token 仓库的发布流程保证可追溯。`applyBrandTheme` 适合运行时预览与低成本接入。

### 静态主题包示例

```css
/* theme-purple.css — 在 axis-ui.css 之后引入 */
:root {
  --axis-color-primary: #722ed1;
  --axis-color-primary-hover: #9254de;
  --axis-color-primary-active: #531dab;
  --axis-color-primary-bg: #f9f0ff;
  --axis-color-primary-border: #d3adf7;
}
[data-theme="dark"] {
  --axis-color-primary: #9254de;
  --axis-color-primary-hover: #b37feb;
  --axis-color-primary-active: #722ed1;
  --axis-color-primary-bg: rgba(114, 46, 209, 0.15);
  --axis-color-primary-border: rgba(114, 46, 209, 0.4);
}
```

## 组件级微调(L3 组件 Token)

各组件在自身根类名上定义组件 Token(`--ax-` 前缀),引用语义 Token。需要局部微调时覆盖组件 Token 即可,不影响全局:

```css
/* 仅让营销区块的按钮更高 */
.hero .ax-button {
  --ax-button-height: 48px;
  --ax-button-padding-x: var(--axis-space-8);
}
```

| 组件 | 可覆盖的组件 Token |
|------|--------------------|
| Button | `--ax-button-height` / `--ax-button-font-size` / `--ax-button-padding-x` |
| Form | `--ax-form-label-width`(标签列宽度,默认 96px) |
| Input | `--ax-input-height` / `--ax-input-font-size` |
| Select | `--ax-select-height` / `--ax-select-font-size` |
| Table | `--ax-table-header-bg` / `--ax-table-cell-padding` |
| Switch | `--ax-switch-height` / `--ax-switch-min-width` / `--ax-switch-handle` |

## 无障碍要求

- 定制品牌色时必须保证:正文文字与背景对比度 ≥ 4.5:1(WCAG AA),大号文字与图标 ≥ 3:1;
- 建议在 CI 中加入自动对比度校验,不达标阻断发布;
- 所有组件动效已响应 `prefers-reduced-motion`,主题定制不得移除该降级。
