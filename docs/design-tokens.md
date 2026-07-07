# 设计 Token 速查表

axis-ui 的所有视觉值均以 CSS Custom Properties 形式提供,前缀 `--axis-`。

**三层架构与消费约束:**

| 层级 | 说明 | 是否允许业务消费 |
|------|------|------|
| L1 全局 Token | 原始值池,如 `--axis-blue-6` | ❌ 禁止 |
| L2 语义 Token | 场景语义,如 `--axis-color-primary` | ✅ 唯一推荐 |
| L3 组件 Token | 组件级微调,如 `--ax-button-height`(定义于组件内) | 覆盖定制时可用 |

---

## 色彩

### 品牌色

| Token | 亮色值 | 用途 |
|-------|--------|------|
| `--axis-color-primary` | `#1677ff` | 品牌主色(默认态) |
| `--axis-color-primary-hover` | `#4096ff` | 悬浮态 |
| `--axis-color-primary-active` | `#0958d9` | 激活态 |
| `--axis-color-primary-bg` | `#e6f4ff` | 浅色背景(选中底、聚焦光晕) |
| `--axis-color-primary-border` | `#91caff` | 浅色描边 |

### 功能色

四类功能色语义全公司统一,不可挪用。每类均含 `-hover / -active / -bg / -border` 四态:

| Token 族 | 基准值 | 用途 |
|----------|--------|------|
| `--axis-color-success*` | `#52c41a` | 成功提示、通过状态 |
| `--axis-color-warning*` | `#faad14` | 警告提示、待处理 |
| `--axis-color-error*` | `#ff4d4f` | 错误提示、危险操作、必填标记 |
| `--axis-color-info*` | 同主色 | 中性通知 |

### 中性色(带透明度方案)

| Token | 亮色值 | 用途 |
|-------|--------|------|
| `--axis-color-text-primary` | `rgba(0,0,0,.88)` | 一级文字(标题、正文) |
| `--axis-color-text-secondary` | `rgba(0,0,0,.65)` | 二级文字 |
| `--axis-color-text-tertiary` | `rgba(0,0,0,.45)` | 三级文字 / 占位符 |
| `--axis-color-text-disabled` | `rgba(0,0,0,.25)` | 禁用文字 |
| `--axis-color-text-inverse` | `#ffffff` | 深色底上的反色文字 |
| `--axis-color-border-default` | `rgba(5,5,5,.15)` | 默认描边 |
| `--axis-color-border-split` | `rgba(5,5,5,.06)` | 分割线 |
| `--axis-color-fill-default` | `rgba(0,0,0,.06)` | 默认填充 |
| `--axis-color-fill-hover` | `rgba(0,0,0,.04)` | 悬浮填充 |
| `--axis-color-fill-active` | `rgba(0,0,0,.10)` | 激活填充 |
| `--axis-color-fill-disabled` | `rgba(0,0,0,.04)` | 禁用填充 |
| `--axis-color-bg-layout` | `#f5f5f5` | 页面底色 |
| `--axis-color-bg-container` | `#ffffff` | 容器底色 |
| `--axis-color-bg-elevated` | `#ffffff` | 浮层底色 |
| `--axis-color-bg-mask` | `rgba(0,0,0,.45)` | 遮罩 |

> 暗色模式下上述 Token 全部重映射(见 [theming.md](./theming.md)),消费方无需感知。

---

## 字体

| Token | 值 | 用途 |
|-------|-----|------|
| `--axis-font-family-base` | 系统字体栈(PingFang SC / Microsoft YaHei 等) | 默认字体 |
| `--axis-font-family-code` | SF Mono / Menlo / Consolas | 代码 |
| `--axis-font-size-xs` / `--axis-line-height-xs` | 12px / 20px | 辅助说明、标签 |
| `--axis-font-size-sm` / `--axis-line-height-sm` | 13px / 22px | 表格密集数据 |
| `--axis-font-size-base` / `--axis-line-height-base` | 14px / 22px | 正文默认 |
| `--axis-font-size-lg` / `--axis-line-height-lg` | 16px / 24px | 强调正文、小标题 |
| `--axis-font-size-h4` / `--axis-line-height-h4` | 20px / 28px | 卡片标题 |
| `--axis-font-size-h3` / `--axis-line-height-h3` | 24px / 32px | 区块标题 |
| `--axis-font-size-h2` / `--axis-line-height-h2` | 30px / 38px | 页面标题 |
| `--axis-font-size-h1` / `--axis-line-height-h1` | 38px / 46px | 门户大标题 |
| `--axis-font-weight-regular` | 400 | 正文 |
| `--axis-font-weight-medium` | 500 | 强调、标题 |
| `--axis-font-weight-semibold` | 600 | 数据数字、大标题 |

---

## 间距(8px 网格 + 4px 半步长)

| Token | 值 | | Token | 值 |
|-------|-----|-|-------|-----|
| `--axis-space-1` | 4px | | `--axis-space-6` | 24px |
| `--axis-space-2` | 8px | | `--axis-space-8` | 32px |
| `--axis-space-3` | 12px | | `--axis-space-10` | 40px |
| `--axis-space-4` | 16px | | `--axis-space-12` | 48px |
| `--axis-space-5` | 20px | | `--axis-space-16` | 64px |

使用约定:组件内部 4–16px,组件之间 16–24px,区块之间 24–48px。

---

## 圆角与控件高度

| Token | 值 | 用途 |
|-------|-----|------|
| `--axis-radius-sm` | 4px | 小组件(Tag、Checkbox) |
| `--axis-radius-md` | 6px | 常规控件(Button、Input、Select) |
| `--axis-radius-lg` | 8px | 容器(Card、Modal、Popover) |
| `--axis-radius-full` | 9999px | 胶囊 / 头像 |
| `--axis-control-height-sm` | 24px | 小号控件 |
| `--axis-control-height-md` | 32px | 中号控件(默认) |
| `--axis-control-height-lg` | 40px | 大号控件 |
| `--axis-icon-size-sm` | 16px | 行内小图标 |
| `--axis-icon-size-md` | 20px | 常规图标 |
| `--axis-icon-size-lg` | 24px | 独立按钮图标(24×24 网格) |

---

## 断点与容器宽度

### 断点(screen-*)

| Token | 值 | 典型设备 |
|-------|-----|---------|
| `--axis-screen-xs` | 480px | 手机 |
| `--axis-screen-sm` | 576px | 大屏手机 |
| `--axis-screen-md` | 768px | 平板 |
| `--axis-screen-lg` | 992px | 小尺寸笔记本 |
| `--axis-screen-xl` | 1200px | 桌面(中后台设计基准 1440px) |
| `--axis-screen-xxl` | 1600px | 大屏显示器 |

> ⚠️ **CSS 变量不能出现在 `@media` 条件中**。断点 CSS 变量仅作速查参考;
> 媒体查询请使用与之一一对应的 JS 常量(见下),或书写一致的字面量并注明来源。

### 容器宽度(container-*)

`.ax-container` 类实现「水平居中 + 随断点提升最大宽度」的响应式容器:

| Token | 值 | 生效条件 |
|-------|-----|---------|
| `--axis-container-sm` | 540px | 视口 ≥ 576px |
| `--axis-container-md` | 720px | 视口 ≥ 768px |
| `--axis-container-lg` | 960px | 视口 ≥ 992px |
| `--axis-container-xl` | 1140px | 视口 ≥ 1200px |
| `--axis-container-xxl` | 1400px | 视口 ≥ 1600px |
| `--axis-content-min-width` | 1200px | 中后台内容区最小适配宽度 |

```html
<div class="ax-container">随断点居中限宽</div>
<div class="ax-container ax-container--fluid">始终 100% 宽</div>
```

### 布局框架尺寸(layout-*)

中后台经典「顶栏 + 侧边栏 + 内容区」框架的统一尺寸:

| Token | 值 | 用途 |
|-------|-----|------|
| `--axis-layout-header-height` | 56px | 顶栏高度 |
| `--axis-layout-sider-width` | 224px | 侧边栏展开宽度 |
| `--axis-layout-sider-collapsed-width` | 64px | 侧边栏折叠宽度 |
| `--axis-layout-footer-height` | 48px | 页脚高度 |

### JS 常量侧

断点相关值同时以 TS 常量导出,作为媒体查询与窗口判断的唯一事实源:

```ts
import {
  breakpoints,        // { xs: 480, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1600 }
  containerWidths,    // { sm: 540, md: 720, lg: 960, xl: 1140, xxl: 1400 }
  contentMinWidth,    // 1200
  layoutSizes,        // { headerHeight: 56, siderWidth: 224, ... }
  mediaUp, mediaDown, // 生成媒体查询条件字符串
  matchBreakpoint     // 判断当前视口是否达到某断点
} from 'axis-ui'

mediaUp('md')            // '(min-width: 768px)'
mediaDown('lg')          // '(max-width: 991.98px)'
matchBreakpoint('xl')    // 当前视口 ≥ 1200px ?
```

---

## 阴影与 z-index

阴影只表达「漂浮」,与层级绑定;业务禁止手写 z-index:

| 阴影 Token | z-index Token | 用途 |
|-----------|---------------|------|
| `--axis-shadow-sm` | — | 卡片轻微抬升 |
| `--axis-shadow-md` | `--axis-z-dropdown: 1000` | Dropdown / Popover |
| `--axis-shadow-lg` | `--axis-z-modal: 1010` | Modal / Drawer |
| `--axis-shadow-overlay` | `--axis-z-message: 1020` / `--axis-z-tooltip: 1030` | 全局通知 / Tooltip |

---

## 动效

| Token | 值 | 用途 |
|-------|-----|------|
| `--axis-motion-duration-fast` | 0.1s | 悬浮、按压等微反馈 |
| `--axis-motion-duration-mid` | 0.2s | 开关、Tab 切换 |
| `--axis-motion-duration-slow` | 0.3s | Modal、Drawer 出入场 |
| `--axis-motion-ease-out` | `cubic-bezier(.215,.61,.355,1)` | 入场 |
| `--axis-motion-ease-in` | `cubic-bezier(.55,.055,.675,.19)` | 出场 |
| `--axis-motion-ease-in-out` | `cubic-bezier(.645,.045,.355,1)` | 位移 / 形变 |

系统开启「减少动态效果」(`prefers-reduced-motion: reduce`)时,组件动效自动降级为直接切换。

---

## 正误示例

```css
/* ✅ 正确 */
.stat-card {
  background: var(--axis-color-bg-container);
  border: 1px solid var(--axis-color-border-split);
  border-radius: var(--axis-radius-lg);
  padding: var(--axis-space-6);
  box-shadow: var(--axis-shadow-sm);
  color: var(--axis-color-text-primary);
}

/* ❌ 错误 */
.stat-card-bad {
  background: #ffffff;            /* 硬编码色值 */
  border-radius: 8px;             /* 硬编码圆角 */
  padding: 17px;                  /* 8px 网格外的魔法数字 */
  color: var(--axis-blue-6);      /* 直接消费全局 Token */
  z-index: 9999;                  /* 手写 z-index */
}
```
