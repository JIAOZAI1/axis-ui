<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { formItemKey } from '../form/context'

defineOptions({ name: 'AxSelect' })

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    options?: SelectOption[]
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { options: () => [], placeholder: '请选择', size: 'md' }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | undefined): void
  (e: 'change', value: string | number | undefined): void
}>()

const open = ref(false)
const rootRef = ref<HTMLElement>()

/* 位于 AxFormItem 内时联动:校验失败自动进入 error 态 */
const formItem = inject(formItemKey, null)
const hasError = computed(() => !!formItem?.error.value)

const selected = computed(() =>
  props.options.find((o) => o.value === props.modelValue)
)

const showClear = computed(
  () => props.clearable && !props.disabled && props.modelValue !== undefined && props.modelValue !== ''
)

function toggleOpen() {
  if (props.disabled) return
  open.value = !open.value
}

function pick(option: SelectOption) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  open.value = false
  formItem?.onFieldBlur()
}

function clear(ev: MouseEvent) {
  ev.stopPropagation()
  emit('update:modelValue', undefined)
  emit('change', undefined)
  formItem?.onFieldChange()
}

function onClickOutside(ev: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(ev.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div
    ref="rootRef"
    :class="['ax-select', `ax-select--${size}`, { 'is-open': open, 'is-disabled': disabled, 'is-error': hasError }]"
  >
    <div
      class="ax-select__trigger"
      role="combobox"
      :aria-expanded="open"
      tabindex="0"
      @click="toggleOpen"
      @keydown.enter.prevent="toggleOpen"
      @keydown.escape="open = false"
    >
      <span v-if="selected" class="ax-select__value">{{ selected.label }}</span>
      <span v-else class="ax-select__placeholder">{{ placeholder }}</span>
      <button
        v-if="showClear"
        class="ax-select__clear"
        type="button"
        aria-label="清空"
        @click="clear"
      >✕</button>
      <span v-else class="ax-select__arrow" aria-hidden="true">
        <svg viewBox="0 0 12 12" width="10" height="10">
          <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </div>

    <transition name="ax-select-zoom">
      <ul v-if="open" class="ax-select__dropdown" role="listbox">
        <li
          v-for="option in options"
          :key="option.value"
          :class="['ax-select__option', {
            'is-selected': option.value === modelValue,
            'is-disabled': option.disabled
          }]"
          role="option"
          :aria-selected="option.value === modelValue"
          @click="pick(option)"
        >
          {{ option.label }}
        </li>
        <li v-if="options.length === 0" class="ax-select__empty">暂无数据</li>
      </ul>
    </transition>
  </div>
</template>

<style>
.ax-select {
  --ax-select-height: var(--axis-control-height-md);
  --ax-select-font-size: var(--axis-font-size-base);

  position: relative;
  display: inline-block;
  width: 100%;
  font-size: var(--ax-select-font-size);
}
.ax-select--sm { --ax-select-height: var(--axis-control-height-sm); --ax-select-font-size: var(--axis-font-size-xs); }
.ax-select--lg { --ax-select-height: var(--axis-control-height-lg); --ax-select-font-size: var(--axis-font-size-lg); }

.ax-select__trigger {
  display: flex;
  align-items: center;
  gap: var(--axis-space-2);
  height: var(--ax-select-height);
  padding: 0 var(--axis-space-3);
  background: var(--axis-color-bg-container);
  border: 1px solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-md);
  color: var(--axis-color-text-primary);
  cursor: pointer;
  transition:
    border-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    box-shadow var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-select:hover:not(.is-disabled) .ax-select__trigger {
  border-color: var(--axis-color-primary-hover);
}
.ax-select.is-open .ax-select__trigger {
  border-color: var(--axis-color-primary);
  box-shadow: 0 0 0 2px var(--axis-color-primary-bg);
}
.ax-select.is-error .ax-select__trigger {
  border-color: var(--axis-color-error);
}
.ax-select.is-error.is-open .ax-select__trigger {
  box-shadow: 0 0 0 2px var(--axis-color-error-bg);
}
.ax-select.is-disabled .ax-select__trigger {
  background: var(--axis-color-fill-disabled);
  color: var(--axis-color-text-disabled);
  cursor: not-allowed;
}

.ax-select__value { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ax-select__placeholder { flex: 1; color: var(--axis-color-text-tertiary); }

.ax-select__arrow {
  display: inline-flex;
  color: var(--axis-color-text-tertiary);
  transition: transform var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-select.is-open .ax-select__arrow { transform: rotate(180deg); }

.ax-select__clear {
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
}
.ax-select__clear:hover { color: var(--axis-color-text-secondary); }

.ax-select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: var(--axis-z-dropdown);
  max-height: 256px;
  overflow: auto;
  margin: 0;
  padding: var(--axis-space-1);
  list-style: none;
  background: var(--axis-color-bg-elevated);
  border-radius: var(--axis-radius-lg);
  box-shadow: var(--axis-shadow-md);
  transform-origin: top;
}

.ax-select__option {
  padding: var(--axis-space-1) var(--axis-space-3);
  border-radius: var(--axis-radius-sm);
  line-height: var(--axis-line-height-base);
  color: var(--axis-color-text-primary);
  cursor: pointer;
  transition: background-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-select__option:hover:not(.is-disabled) { background: var(--axis-color-fill-hover); }
.ax-select__option.is-selected {
  background: var(--axis-color-primary-bg);
  color: var(--axis-color-primary);
  font-weight: var(--axis-font-weight-medium);
}
.ax-select__option.is-disabled {
  color: var(--axis-color-text-disabled);
  cursor: not-allowed;
}

.ax-select__empty {
  padding: var(--axis-space-4);
  text-align: center;
  color: var(--axis-color-text-tertiary);
  font-size: var(--axis-font-size-xs);
}

.ax-select-zoom-enter-active { transition: all var(--axis-motion-duration-mid) var(--axis-motion-ease-out); }
.ax-select-zoom-leave-active { transition: all var(--axis-motion-duration-fast) var(--axis-motion-ease-in); }
.ax-select-zoom-enter-from,
.ax-select-zoom-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
}
</style>
