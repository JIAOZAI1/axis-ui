import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type CollapseName = string | number
export type CollapseModelValue = CollapseName[]
export type CollapseType = 'bordered' | 'borderless' | 'simple'
export type CollapseFocusDirection = 'next' | 'previous' | 'first' | 'last'

export interface CollapseItemRegistration {
  headerRef: Ref<HTMLButtonElement | null>
  disabled: Ref<boolean>
}

export interface CollapseContext {
  activeNames: ComputedRef<CollapseModelValue>
  toggle: (name: CollapseName) => void
  registerItem: (name: CollapseName, item: CollapseItemRegistration) => void
  unregisterItem: (name: CollapseName) => void
  focusHeader: (name: CollapseName, direction: CollapseFocusDirection) => void
}

export interface CollapseExpose {
  expandAll: () => void
  collapseAll: () => void
}

export const collapseKey: InjectionKey<CollapseContext> = Symbol('AxCollapse')
