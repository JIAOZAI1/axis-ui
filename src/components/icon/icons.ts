/**
 * axis-ui 内置线性图标库
 *
 * 规范约束(设计规范 3.6):24×24 网格、2px 描边、线性风格、
 * 颜色一律 currentColor 随文字色换肤;面性仅用于极少数场景(如 more 的圆点)。
 * 值为 SVG 内部片段,由 AxIcon 统一包裹 <svg viewBox="0 0 24 24" stroke="currentColor" …> 渲染。
 */

export const icons = {
  /* ---- 操作 ---- */
  search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.35-4.35"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  edit: '<path d="M4 20h4L19.5 8.5a2.12 2.12 0 0 0-3-3L5 17l-1 4z"/><path d="m13.5 6.5 3 3"/>',
  delete:
    '<path d="M4 7h16"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v4h-4"/>',
  download:
    '<path d="M12 4v10M7.5 10.5 12 15l4.5-4.5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  upload:
    '<path d="M12 15V5M7.5 9.5 12 5l4.5 4.5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  filter: '<path d="M4 5h16l-6 7v6l-4 2v-8L4 5z"/>',
  more: '<circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
  loading: '<path d="M21 12a9 9 0 1 1-9-9"/>',

  /* ---- 方向 ---- */
  'chevron-up': '<path d="m6 15 6-6 6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-left': '<path d="m15 6-6 6 6 6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',

  /* ---- 语义状态 ---- */
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9"/>',
  warning: '<path d="M12 3 2.5 20h19L12 3z"/><path d="M12 9.5V14M12 16.8v.4"/>',
  error: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',

  /* ---- 对象 ---- */
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>',
  home: '<path d="m4 11 8-7 8 7"/><path d="M6 9.5V20h12V9.5"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  calendar:
    '<rect x="4" y="6" width="16" height="15" rx="2"/><path d="M4 10.5h16M8 3.5v4M16 3.5v4"/>',
  folder:
    '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>'
} as const

export type IconName = keyof typeof icons

/** 全部图标名(Demo 图标墙 / 文档用) */
export const iconNames = Object.keys(icons) as IconName[]
