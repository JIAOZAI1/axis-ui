<script setup lang="ts">
import { computed, inject, onBeforeUnmount, provide, ref, watch } from 'vue'
import { formItemKey, formKey, type FormRule } from './context'

defineOptions({ name: 'AxFormItem' })

const props = defineProps<{
  /** 字段标签 */
  label?: string
  /** 对应 Form model 的字段名,校验必需 */
  prop?: string
  /** 强制显示必填星号(不传则根据规则推断) */
  required?: boolean
  /** 字段级规则,与 Form rules[prop] 合并 */
  rules?: FormRule[]
  /** 覆盖 Form 的标签宽度 */
  labelWidth?: string
}>()

const form = inject(formKey, null)

const error = ref('')
/** 是否已被校验过:之后值变化即时重校验 */
const touched = ref(false)

const mergedRules = computed<FormRule[]>(() => [
  ...(props.prop && form?.rules.value?.[props.prop] ? form.rules.value[props.prop] : []),
  ...(props.rules ?? [])
])

const isRequired = computed(
  () => props.required || mergedRules.value.some((r) => r.required)
)

const labelStyle = computed(() => ({
  width: props.labelWidth ?? form?.labelWidth.value,
  textAlign: form?.labelAlign.value ?? 'right'
}))

const fieldValue = computed(() =>
  props.prop ? form?.model.value?.[props.prop] : undefined
)

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  return false
}

async function validate(): Promise<boolean> {
  if (!props.prop || mergedRules.value.length === 0) return true
  touched.value = true
  const value = fieldValue.value
  for (const rule of mergedRules.value) {
    if (rule.required && isEmpty(value)) {
      error.value = rule.message ?? `${props.label ?? props.prop}不能为空`
      return false
    }
    if (isEmpty(value)) continue
    const size = typeof value === 'number' ? value : String(value).length
    if (rule.min !== undefined && size < rule.min) {
      error.value = rule.message ?? `不能小于 ${rule.min}`
      return false
    }
    if (rule.max !== undefined && size > rule.max) {
      error.value = rule.message ?? `不能大于 ${rule.max}`
      return false
    }
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      error.value = rule.message ?? '格式不正确'
      return false
    }
    if (rule.validator) {
      const result = await rule.validator(value)
      if (result !== true) {
        error.value = typeof result === 'string' ? result : (rule.message ?? '校验不通过')
        return false
      }
    }
  }
  error.value = ''
  return true
}

function clearValidate() {
  error.value = ''
  touched.value = false
}

/* 已校验过的字段,值变化时即时重校验(输入自愈) */
watch(fieldValue, () => {
  if (touched.value) validate()
})

const instance = { prop: props.prop, validate, clearValidate }
form?.registerItem(instance)
onBeforeUnmount(() => form?.unregisterItem(instance))

/* 供内部控件(Input/Select)联动:错误态样式 + 失焦/变更触发校验 */
provide(formItemKey, {
  error: computed(() => error.value),
  onFieldBlur: () => { validate() },
  onFieldChange: () => { if (touched.value) validate() }
})

defineExpose({ validate, clearValidate })
</script>

<template>
  <div :class="['ax-form-item', { 'is-error': !!error, 'is-required': isRequired }]">
    <label v-if="label || $slots.label" class="ax-form-item__label" :style="labelStyle">
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="ax-form-item__content">
      <slot />
      <transition name="ax-form-item-error">
        <div v-if="error" class="ax-form-item__error" role="alert">{{ error }}</div>
      </transition>
    </div>
  </div>
</template>

<style>
.ax-form-item {
  display: flex;
  align-items: flex-start;
  gap: var(--axis-space-3);
}

.ax-form-item__label {
  flex-shrink: 0;
  padding-top: calc((var(--axis-control-height-md) - var(--axis-line-height-base)) / 2);
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
  color: var(--axis-color-text-primary);
}

/* 必填星号:使用 color-error(规范:必填标记属于 Error 语义) */
.ax-form-item.is-required .ax-form-item__label::before {
  content: "*";
  margin-right: var(--axis-space-1);
  color: var(--axis-color-error);
}

.ax-form-item__content {
  flex: 1;
  min-width: 0;
}

.ax-form-item__error {
  margin-top: var(--axis-space-1);
  font-size: var(--axis-font-size-xs);
  line-height: var(--axis-line-height-xs);
  color: var(--axis-color-error);
}

.ax-form-item-error-enter-active {
  transition: all var(--axis-motion-duration-mid) var(--axis-motion-ease-out);
}
.ax-form-item-error-leave-active {
  transition: all var(--axis-motion-duration-fast) var(--axis-motion-ease-in);
}
.ax-form-item-error-enter-from,
.ax-form-item-error-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}
</style>
