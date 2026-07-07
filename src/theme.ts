/**
 * 主题工具:切换亮/暗模式、品牌主题定制
 */

export type ThemeMode = 'light' | 'dark'

/** 切换亮/暗模式(在 html 根元素上打 data-theme 标) */
export function setTheme(mode: ThemeMode) {
  if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export function getTheme(): ThemeMode {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light'
}

export function toggleTheme(): ThemeMode {
  const next: ThemeMode = getTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}

/**
 * 品牌主题定制:传入语义 Token 覆盖(不带 --axis- 前缀),
 * 覆盖仅作用于语义层,组件零改动。
 *
 * 示例:
 *   applyBrandTheme({ 'color-primary': '#722ed1', 'color-primary-hover': '#9254de' })
 */
export function applyBrandTheme(tokens: Record<string, string>) {
  const root = document.documentElement
  for (const [name, value] of Object.entries(tokens)) {
    root.style.setProperty(`--axis-${name}`, value)
  }
}
