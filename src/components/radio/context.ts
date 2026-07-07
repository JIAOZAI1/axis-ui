import type { ComputedRef, InjectionKey } from 'vue'

export interface RadioGroupContext {
  value: ComputedRef<string | number | undefined>
  disabled: ComputedRef<boolean>
  select: (value: string | number) => void
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('AxRadioGroup')
