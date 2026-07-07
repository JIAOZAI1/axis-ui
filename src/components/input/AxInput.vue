<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { formItemKey } from '../form/context'

defineOptions({ name: 'AxInput' })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    type?: string
    size?: 'sm' | 'md' | 'lg'
    placeholder?: string
    disabled?: boolean
    /** 显示清空按钮 */
    clearable?: boolean
    /** 最大长度,配合 showCount 使用 */
    maxlength?: number
    /** 显示字数统计 */
    showCount?: boolean
    /** 校验状态 */
    status?: 'error' | 'warning'
  }>(),
  { modelValue: '', type: 'text', size: 'md' }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'clear'): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
}>()

const focused = ref(false)

/* 位于 AxFormItem 内时联动:校验失败自动进入 error 态 */
const formItem = inject(formItemKey, null)
const mergedStatus = computed(
  () => props.status ?? (formItem?.error.value ? 'error' : undefined)
)

const classes = computed(() => [
  'ax-input',
  `ax-input--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-focused': focused.value,
    [`is-status-${mergedStatus.value}`]: mergedStatus.value
  }
])

const showClear = computed(
  () => props.clearable && !props.disabled && props.modelValue.length > 0
)

function onInput(ev: Event) {
  emit('update:modelValue', (ev.target as HTMLInputElement).value)
  formItem?.onFieldChange()
}
function onChange(ev: Event) {
  emit('change', (ev.target as HTMLInputElement).value)
}
function onClear() {
  emit('update:modelValue', '')
  emit('clear')
  formItem?.onFieldChange()
}
function onBlur(ev: FocusEvent) {
  focused.value = false
  emit('blur', ev)
  formItem?.onFieldBlur()
}
</script>

<template>
  <span :class="classes">
    <span v-if="$slots.prefix" class="ax-input__affix"><slot name="prefix" /></span>
    <input
      class="ax-input__inner"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      @input="onInput"
      @change="onChange"
      @focus="focused = true; emit('focus', $event)"
      @blur="onBlur"
    />
    <button
      v-if="showClear"
      class="ax-input__clear"
      type="button"
      aria-label="清空"
      @click="onClear"
    >✕</button>
    <span v-if="showCount && maxlength" class="ax-input__count">
      {{ modelValue.length }}/{{ maxlength }}
    </span>
    <span v-if="$slots.suffix" class="ax-input__affix"><slot name="suffix" /></span>
  </span>
</template>

<style>
.ax-input {
  --ax-input-height: var(--axis-control-height-md);
  --ax-input-font-size: var(--axis-font-size-base);

  display: inline-flex;
  align-items: center;
  gap: var(--axis-space-1);
  width: 100%;
  max-width: 100%;
  height: var(--ax-input-height);
  padding: 0 var(--axis-space-3);
  background: var(--axis-color-bg-container);
  border: 1px solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-md);
  font-size: var(--ax-input-font-size);
  color: var(--axis-color-text-primary);
  transition:
    border-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    box-shadow var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-input--sm { --ax-input-height: var(--axis-control-height-sm); --ax-input-font-size: var(--axis-font-size-xs); }
.ax-input--lg { --ax-input-height: var(--axis-control-height-lg); --ax-input-font-size: var(--axis-font-size-lg); }

.ax-input:hover:not(.is-disabled) { border-color: var(--axis-color-primary-hover); }
.ax-input.is-focused {
  border-color: var(--axis-color-primary);
  box-shadow: 0 0 0 2px var(--axis-color-primary-bg);
}
.ax-input.is-status-error { border-color: var(--axis-color-error); }
.ax-input.is-status-error.is-focused { box-shadow: 0 0 0 2px var(--axis-color-error-bg); }
.ax-input.is-status-warning { border-color: var(--axis-color-warning); }
.ax-input.is-status-warning.is-focused { box-shadow: 0 0 0 2px var(--axis-color-warning-bg); }

.ax-input.is-disabled {
  background: var(--axis-color-fill-disabled);
  cursor: not-allowed;
}

.ax-input__inner {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  padding: 0;
}
.ax-input__inner::placeholder { color: var(--axis-color-text-tertiary); }
.ax-input.is-disabled .ax-input__inner {
  color: var(--axis-color-text-disabled);
  cursor: not-allowed;
}

.ax-input__affix {
  display: inline-flex;
  align-items: center;
  color: var(--axis-color-text-tertiary);
}
.ax-input__count {
  font-size: var(--axis-font-size-xs);
  color: var(--axis-color-text-tertiary);
}

.ax-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  border-radius: var(--axis-radius-full);
  background: var(--axis-color-fill-default);
  color: var(--axis-color-text-tertiary);
  font-size: 10px;
  cursor: pointer;
  transition: color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-input__clear:hover { color: var(--axis-color-text-secondary); }
</style>
