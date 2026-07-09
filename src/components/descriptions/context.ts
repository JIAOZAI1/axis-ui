import type { InjectionKey, Ref } from 'vue'

export type DescriptionsSize = 'sm' | 'md' | 'lg'
export type DescriptionsLayout = 'horizontal' | 'vertical'

export interface DescriptionsContext {
  emptyText: Ref<string>
  layout: Ref<DescriptionsLayout>
  labelWidth: Ref<string | number | undefined>
  size: Ref<DescriptionsSize>
  bordered: Ref<boolean>
}

export const descriptionsKey: InjectionKey<DescriptionsContext> = Symbol('AxDescriptions')
