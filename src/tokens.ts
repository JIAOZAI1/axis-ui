/**
 * 设计 Token 的 JS 常量侧
 *
 * CSS 变量无法用于 @media 条件,断点/容器宽度在此以常量导出,
 * 供 JS 逻辑(窗口判断、组件响应式 props)与 CSS-in-JS 消费。
 * 值与 styles/tokens.css 中的 --axis-screen-* / --axis-container-* 保持一一对应。
 */

/** 断点(px):视口宽度 ≥ 该值时进入对应档位 */
export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
} as const

export type Breakpoint = keyof typeof breakpoints

/** 各断点下内容区最大宽度(px),对应 .ax-container */
export const containerWidths = {
  sm: 540,
  md: 720,
  lg: 960,
  xl: 1140,
  xxl: 1400
} as const

/** 中后台内容区最小适配宽度(设计基准 1440×900) */
export const contentMinWidth = 1200

/** 布局框架尺寸 */
export const layoutSizes = {
  headerHeight: 56,
  siderWidth: 224,
  siderCollapsedWidth: 64,
  footerHeight: 48
} as const

/** 生成 min-width 媒体查询条件,如 mediaUp('md') → '(min-width: 768px)' */
export function mediaUp(bp: Breakpoint): string {
  return `(min-width: ${breakpoints[bp]}px)`
}

/** 生成 max-width 媒体查询条件(取断点值 - 0.02px 避免与 min-width 重叠) */
export function mediaDown(bp: Breakpoint): string {
  return `(max-width: ${breakpoints[bp] - 0.02}px)`
}

/** 判断当前视口是否达到某断点(仅浏览器环境) */
export function matchBreakpoint(bp: Breakpoint): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(mediaUp(bp)).matches
}
