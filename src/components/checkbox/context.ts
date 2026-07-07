import type { ComputedRef, InjectionKey } from 'vue'

export interface CheckboxGroupContext {
  value: ComputedRef<(string | number)[]>
  disabled: ComputedRef<boolean>
  toggle: (value: string | number) => void
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> =
  Symbol('AxCheckboxGroup')
