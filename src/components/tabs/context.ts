import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface TabsContext {
  active: ComputedRef<string | number | undefined>
  registerPane: (name: string | number, label: Ref<string>) => void
  unregisterPane: (name: string | number) => void
}

export const tabsKey: InjectionKey<TabsContext> = Symbol('AxTabs')
