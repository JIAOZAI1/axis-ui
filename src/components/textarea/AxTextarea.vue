<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, useAttrs, watch } from 'vue'
import { formItemKey } from '../form/context'

defineOptions({ name: 'AxTextarea', inheritAttrs: false })

export interface TextareaAutosizeOptions {
  minRows?: number
  maxRows?: number
}

export type TextareaAutosize = boolean | TextareaAutosizeOptions
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    rows?: number
    placeholder?: string
    disabled?: boolean
    maxlength?: number
    showCount?: boolean
    status?: 'error' | 'warning'
    resize?: TextareaResize
    /** 自动适应内容高度;传入对象时可限制最少、最多行数 */
    autosize?: TextareaAutosize
  }>(),
  {
    modelValue: '',
    rows: 3,
    resize: 'vertical',
    autosize: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'focus', ev: FocusEvent): void
  (e: 'blur', ev: FocusEvent): void
}>()

const attrs = useAttrs()
const focused = ref(false)
const textareaEl = ref<HTMLTextAreaElement | null>(null)

/* class/style 控制组件外层布局,其余原生属性和监听器透传给 textarea。 */
const nativeAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

/* 位于 AxFormItem 内时联动:校验失败自动进入 error 态 */
const formItem = inject(formItemKey, null)
const mergedStatus = computed(
  () => props.status ?? (formItem?.error.value ? 'error' : undefined)
)

const classes = computed(() => [
  'ax-textarea',
  {
    'is-disabled': props.disabled,
    'is-focused': focused.value,
    'is-show-count': props.showCount,
    'is-autosize': !!props.autosize,
    [`is-status-${mergedStatus.value}`]: mergedStatus.value
  }
])

const countText = computed(() =>
  props.maxlength === undefined
    ? String(props.modelValue.length)
    : `${props.modelValue.length}/${props.maxlength}`
)

const normalizedRows = computed(() => Math.max(1, props.rows))
const ariaInvalid = computed<boolean | 'true' | 'false' | 'grammar' | 'spelling' | undefined>(() => {
  if (mergedStatus.value === 'error') return true
  const value = attrs['aria-invalid']
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === 'false' || value === 'grammar' || value === 'spelling') {
    return value
  }
  return undefined
})

const resizeStyle = computed(() => ({
  resize: props.autosize ? 'none' : props.resize
}))

function resizeTextarea() {
  const textarea = textareaEl.value
  if (!textarea) return

  if (!props.autosize) {
    textarea.style.height = ''
    textarea.style.overflowY = ''
    return
  }

  const styles = window.getComputedStyle(textarea)
  const lineHeight = Number.parseFloat(styles.lineHeight)
  const padding = Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom)
  const border = Number.parseFloat(styles.borderTopWidth) + Number.parseFloat(styles.borderBottomWidth)
  const options = typeof props.autosize === 'object' ? props.autosize : undefined
  const minRows = Math.max(1, options?.minRows ?? normalizedRows.value)
  const maxRows = options?.maxRows
  const minHeight = lineHeight * minRows + padding + border
  const maxHeight = maxRows === undefined
    ? Number.POSITIVE_INFINITY
    : lineHeight * Math.max(maxRows, minRows) + padding + border

  /* 先压缩高度才能在删除内容时收缩,也避免原生 rows 干扰 minRows。 */
  textarea.style.height = '0px'
  const contentHeight = textarea.scrollHeight + border
  const height = Math.max(minHeight, Math.min(contentHeight, maxHeight))
  textarea.style.height = `${height}px`
  textarea.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden'
}

function onInput(ev: Event) {
  resizeTextarea()
  emit('update:modelValue', (ev.target as HTMLTextAreaElement).value)
  formItem?.onFieldChange()
}

function onChange(ev: Event) {
  emit('change', (ev.target as HTMLTextAreaElement).value)
}

function onBlur(ev: FocusEvent) {
  focused.value = false
  emit('blur', ev)
  formItem?.onFieldBlur()
}

watch(
  [() => props.modelValue, () => props.rows, () => props.autosize],
  () => nextTick(resizeTextarea),
  { deep: true }
)

onMounted(resizeTextarea)

defineExpose({
  focus: async () => {
    await nextTick()
    textareaEl.value?.focus()
  },
  resize: async () => {
    await nextTick()
    resizeTextarea()
  }
})
</script>

<template>
  <span :class="[classes, attrs.class]" :style="attrs.style">
    <textarea
      v-bind="nativeAttrs"
      ref="textareaEl"
      class="ax-textarea__inner"
      :value="modelValue"
      :rows="normalizedRows"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :aria-invalid="ariaInvalid"
      :style="resizeStyle"
      @input="onInput"
      @change="onChange"
      @focus="focused = true; emit('focus', $event)"
      @blur="onBlur"
    />
    <span v-if="showCount" class="ax-textarea__count" aria-live="polite">
      {{ countText }}
    </span>
  </span>
</template>

<style>
.ax-textarea {
  --ax-textarea-font-size: var(--axis-font-size-base);
  --ax-textarea-line-height: var(--axis-line-height-base);

  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 100%;
  font-size: var(--ax-textarea-font-size);
  line-height: var(--ax-textarea-line-height);
  color: var(--axis-color-text-primary);
}

.ax-textarea__inner {
  display: block;
  width: 100%;
  min-height: var(--axis-control-height-lg);
  padding: var(--axis-space-2) var(--axis-space-3);
  overflow-wrap: break-word;
  background: var(--axis-color-bg-container);
  border: 1px solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-md);
  outline: none;
  font: inherit;
  color: inherit;
  transition:
    border-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    box-shadow var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}

.ax-textarea.is-show-count .ax-textarea__inner {
  padding-bottom: var(--axis-space-6);
}

.ax-textarea:hover:not(.is-disabled) .ax-textarea__inner {
  border-color: var(--axis-color-primary-hover);
}

.ax-textarea.is-focused .ax-textarea__inner {
  border-color: var(--axis-color-primary);
  box-shadow: 0 0 0 2px var(--axis-color-primary-bg);
}

.ax-textarea.is-status-error .ax-textarea__inner {
  border-color: var(--axis-color-error);
}

.ax-textarea.is-status-error.is-focused .ax-textarea__inner {
  box-shadow: 0 0 0 2px var(--axis-color-error-bg);
}

.ax-textarea.is-status-warning .ax-textarea__inner {
  border-color: var(--axis-color-warning);
}

.ax-textarea.is-status-warning.is-focused .ax-textarea__inner {
  box-shadow: 0 0 0 2px var(--axis-color-warning-bg);
}

.ax-textarea.is-disabled .ax-textarea__inner {
  background: var(--axis-color-fill-disabled);
  color: var(--axis-color-text-disabled);
  cursor: not-allowed;
  resize: none !important;
}

.ax-textarea__inner::placeholder {
  color: var(--axis-color-text-tertiary);
}

.ax-textarea__count {
  position: absolute;
  right: var(--axis-space-3);
  bottom: var(--axis-space-1);
  pointer-events: none;
  font-size: var(--axis-font-size-xs);
  line-height: var(--axis-line-height-xs);
  color: var(--axis-color-text-tertiary);
}
</style>
