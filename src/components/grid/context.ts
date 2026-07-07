import type { ComputedRef, InjectionKey } from 'vue'

export interface RowContext {
  gutter: ComputedRef<number>
}

export const rowKey: InjectionKey<RowContext> = Symbol('AxRow')
