import type { ComputedRef, InjectionKey } from 'vue'

/** 单条校验规则 */
export interface FormRule {
  /** 必填(空值:undefined / null / '' / 空数组) */
  required?: boolean
  /** 字符串最小长度 / 数字最小值 */
  min?: number
  /** 字符串最大长度 / 数字最大值 */
  max?: number
  /** 正则校验(仅对非空字符串生效) */
  pattern?: RegExp
  /** 自定义校验:返回 true 通过,返回 string 作为错误信息,false 用 message */
  validator?: (value: unknown) => boolean | string | Promise<boolean | string>
  /** 校验失败提示 */
  message?: string
}

export type FormRules = Record<string, FormRule[]>

export interface FormContext {
  model: ComputedRef<Record<string, unknown> | undefined>
  rules: ComputedRef<FormRules | undefined>
  /** 未显式传入时为 undefined,回落到组件 Token --ax-form-label-width */
  labelWidth: ComputedRef<string | undefined>
  labelAlign: ComputedRef<'left' | 'right'>
  labelPosition: ComputedRef<'left' | 'top'>
  registerItem: (item: FormItemInstance) => void
  unregisterItem: (item: FormItemInstance) => void
}

export interface FormItemInstance {
  prop?: string
  validate: () => Promise<boolean>
  clearValidate: () => void
}

/** FormItem 提供给内部控件(Input/Select)的联动上下文 */
export interface FormItemContext {
  error: ComputedRef<string>
  onFieldBlur: () => void
  onFieldChange: () => void
}

export const formKey: InjectionKey<FormContext> = Symbol('AxForm')
export const formItemKey: InjectionKey<FormItemContext> = Symbol('AxFormItem')
