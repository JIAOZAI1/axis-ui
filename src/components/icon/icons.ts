/**
 * axis-ui 内置线性图标库
 *
 * 规范约束(设计规范 3.6):24×24 网格、2px 描边、线性风格、
 * 颜色一律 currentColor 随文字色换肤;面性仅用于极少数场景(如 more 的圆点)。
 * 值为 SVG 内部片段,由 AxIcon 统一包裹 <svg viewBox="0 0 24 24" stroke="currentColor" …> 渲染。
 *
 * 新增图标须走 RFC 流程,保持 24 网格与 2px 描边风格一致。
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
  copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v4h-4"/>',
  download:
    '<path d="M12 4v10M7.5 10.5 12 15l4.5-4.5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  upload:
    '<path d="M12 15V5M7.5 9.5 12 5l4.5 4.5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  send: '<path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/>',
  share:
    '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  print:
    '<path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  'external-link':
    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
  filter: '<path d="M4 5h16l-6 7v6l-4 2v-8L4 5z"/>',
  more: '<circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
  loading: '<path d="M21 12a9 9 0 1 1-9-9"/>',
  fullscreen:
    '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  'fullscreen-exit':
    '<path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3M16 21v-3a2 2 0 0 1 2-2h3"/>',
  logout:
    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',

  /* ---- 任务控制 ---- */
  play: '<path d="M7 4.5v15l12-7.5-12-7.5z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',

  /* ---- 方向 ---- */
  'chevron-up': '<path d="m6 15 6-6 6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-left': '<path d="m15 6-6 6 6 6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  'chevrons-left': '<path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/>',
  'chevrons-right': '<path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/>',
  'arrow-up': '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
  'arrow-down': '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  'arrow-left': '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',

  /* ---- 语义状态与提示 ---- */
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9"/>',
  warning: '<path d="M12 3 2.5 20h19L12 3z"/><path d="M12 9.5V14M12 16.8v.4"/>',
  error: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  question:
    '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.6 2.24c-.72.36-1.1.9-1.1 1.76v.5"/><path d="M12 16.8v.4"/>',
  bell: '<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6z"/><path d="M10.3 19.5a2 2 0 0 0 3.4 0"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  star: '<path d="m12 3 2.7 5.8 6.3.8-4.6 4.4 1.2 6.2L12 17.2 6.4 20.2l1.2-6.2L3 9.6l6.3-.8L12 3z"/>',

  /* ---- 对象 ---- */
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>',
  users:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.3 3-5.5 6.5-5.5s6.5 2.2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.9c1.8.8 3 2.3 3 5.1"/>',
  home: '<path d="m4 11 8-7 8 7"/><path d="M6 9.5V20h12V9.5"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off':
    '<path d="m3 3 18 18"/><path d="M10.6 5.8c.46-.2.93-.3 1.4-.3 6 0 9.5 6.5 9.5 6.5a17.6 17.6 0 0 1-2.2 2.9M6.6 6.6C4 8.3 2.5 12 2.5 12S6 18.5 12 18.5c1.4 0 2.7-.35 3.9-.9"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  calendar:
    '<rect x="4" y="6" width="16" height="15" rx="2"/><path d="M4 10.5h16M8 3.5v4M16 3.5v4"/>',
  folder:
    '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/>',
  'file-text':
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
  image:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m21 16-4.5-4.5L8 20"/>',
  paperclip:
    '<path d="m21 11.5-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8L13 3.9a3.67 3.67 0 0 1 5.2 5.2L9.9 17.4a1.83 1.83 0 0 1-2.6-2.6l7.8-7.8"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.8-1.3"/>',
  key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone:
    '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z"/>',
  'map-pin':
    '<path d="M20 10c0 6-8 11-8 11s-8-5-8-11a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  tag: '<path d="M12.6 2.6 21.4 11.4a2 2 0 0 1 0 2.8l-7.2 7.2a2 2 0 0 1-2.8 0L2.6 12.6A2 2 0 0 1 2 11.2V4a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6z"/><circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>',
  database:
    '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>',
  server:
    '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><circle cx="7" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="7" cy="16.5" r="1" fill="currentColor" stroke="none"/>',
  cloud:
    '<path d="M17.5 19a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-13.42 1.9A4 4 0 0 0 6 19h11.5z"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="3.5" cy="18" r="1" fill="currentColor" stroke="none"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  inbox:
    '<path d="M4.5 5.5 2 13v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4l-2.5-7.5A2 2 0 0 0 17.6 4H6.4a2 2 0 0 0-1.9 1.5z"/><path d="M2 13h5l2 3h6l2-3h5"/>',
  'bar-chart': '<path d="M6 20V10M12 20V4M18 20v-6"/>',
  code: '<path d="m8 8-4.5 4L8 16M16 8l4.5 4L16 16"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13.5 13.5 0 0 1 0 18 13.5 13.5 0 0 1 0-18z"/>',
  moon: '<path d="M20 13.5A8.5 8.5 0 0 1 10.5 4 7.5 7.5 0 1 0 20 13.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>'
} as const

export type IconName = keyof typeof icons

/** 全部图标名(Demo 图标墙 / 文档用) */
export const iconNames = Object.keys(icons) as IconName[]
