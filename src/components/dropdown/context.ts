import type { InjectionKey, Ref } from 'vue'

export type DropdownValue = string | number
export type DropdownTrigger = 'click' | 'hover'
export type DropdownPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
export type DropdownFocusDirection = 'next' | 'previous' | 'first' | 'last'

export interface DropdownItemRegistration {
  value: DropdownValue
  elementRef: Ref<HTMLButtonElement | null>
  disabled: Ref<boolean>
}

export interface DropdownContext {
  registerItem: (id: symbol, item: DropdownItemRegistration) => void
  unregisterItem: (id: symbol) => void
  select: (value: DropdownValue) => void
  focusItem: (direction: DropdownFocusDirection, currentId?: symbol) => void
  close: (returnFocus?: boolean) => void
}

export const dropdownKey: InjectionKey<DropdownContext> = Symbol('AxDropdown')
