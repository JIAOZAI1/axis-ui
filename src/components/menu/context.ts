import type { ComputedRef, InjectionKey } from 'vue'

export interface MenuContext {
  active: ComputedRef<string | number | undefined>
  mode: ComputedRef<'vertical' | 'horizontal'>
  collapsed: ComputedRef<boolean>
  select: (name: string | number) => void
  isOpen: (name: string | number) => boolean
  toggleOpen: (name: string | number) => void
}

/** SubMenu 收集后代 MenuItem 的 name,用于「后代选中时高亮标题」 */
export interface SubMenuContext {
  registerChild: (name: string | number) => void
  unregisterChild: (name: string | number) => void
}

export const menuKey: InjectionKey<MenuContext> = Symbol('AxMenu')
export const subMenuKey: InjectionKey<SubMenuContext> = Symbol('AxSubMenu')
/** 嵌套深度(内联缩进用),弹出面板内重置为 0 */
export const menuDepthKey: InjectionKey<ComputedRef<number>> = Symbol('AxMenuDepth')
/** 当前是否处于弹出面板(popup)子树内 */
export const menuPopupKey: InjectionKey<ComputedRef<boolean>> = Symbol('AxMenuInPopup')
