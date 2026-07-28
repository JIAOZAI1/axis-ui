import type { InjectionKey } from 'vue'

/** 仅用于标记子组件确实处于 AxLayout 内,便于未来扩展(如响应式折叠联动) */
export const layoutKey: InjectionKey<true> = Symbol('AxLayout')
