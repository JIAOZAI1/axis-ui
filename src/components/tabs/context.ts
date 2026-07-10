import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface TabsPane {
  label: Ref<string>
  /** 面板级 closable 覆盖,undefined 时跟随 Tabs 的 closable */
  closable: Ref<boolean | undefined>
}

export interface TabsContext {
  active: ComputedRef<string | number | undefined>
  registerPane: (name: string | number, pane: TabsPane) => void
  unregisterPane: (name: string | number) => void
}

export const tabsKey: InjectionKey<TabsContext> = Symbol('AxTabs')
