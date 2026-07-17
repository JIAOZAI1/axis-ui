<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { formItemKey } from '../form/context'
import AxTag from '../tag/AxTag.vue'

defineOptions({ name: 'AxSelect' })

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export type SelectValue = string | number | undefined | (string | number)[]

const props = withDefaults(
  defineProps<{
    /** 单选为单值,multiple 时为数组 */
    modelValue?: SelectValue
    options?: SelectOption[]
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    size?: 'sm' | 'md' | 'lg'
    /** 多选模式:v-model 为 (string | number)[],点选切换、下拉保持展开 */
    multiple?: boolean
    /** 多选时最多平铺的标签数,超出折叠为 +N */
    maxTagCount?: number
  }>(),
  { options: () => [], placeholder: '请选择', size: 'md', multiple: false }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectValue): void
  (e: 'change', value: SelectValue): void
}>()

const open = ref(false)
const rootRef = ref<HTMLElement>()

/* 位于 AxFormItem 内时联动:校验失败自动进入 error 态 */
const formItem = inject(formItemKey, null)
const hasError = computed(() => !!formItem?.error.value)

/* ---- 多选:选中值数组(保持选择顺序) ---- */
const selectedValues = computed<(string | number)[]>(() =>
  props.multiple && Array.isArray(props.modelValue) ? props.modelValue : []
)

const selectedOptions = computed(() =>
  selectedValues.value.map(
    (value) =>
      props.options.find((o) => o.value === value) ?? { label: String(value), value }
  )
)

/* maxTagCount 折叠:平铺前 N 个,其余收进 +N */
const visibleTags = computed(() =>
  props.maxTagCount !== undefined
    ? selectedOptions.value.slice(0, props.maxTagCount)
    : selectedOptions.value
)
const overflowCount = computed(() =>
  Math.max(0, selectedOptions.value.length - visibleTags.value.length)
)

/* ---- 单选 ---- */
const selected = computed(() =>
  !props.multiple && !Array.isArray(props.modelValue)
    ? props.options.find((o) => o.value === props.modelValue)
    : undefined
)

const isEmptyValue = computed(() =>
  props.multiple
    ? selectedValues.value.length === 0
    : props.modelValue === undefined || props.modelValue === ''
)

const showClear = computed(
  () => props.clearable && !props.disabled && !isEmptyValue.value
)

function isSelected(option: SelectOption): boolean {
  return props.multiple
    ? selectedValues.value.includes(option.value)
    : option.value === props.modelValue
}

function toggleOpen() {
  if (props.disabled) return
  open.value = !open.value
}

function pick(option: SelectOption) {
  if (option.disabled) return
  if (props.multiple) {
    /* 多选:切换选中,下拉保持展开方便连续操作 */
    const next = selectedValues.value.includes(option.value)
      ? selectedValues.value.filter((v) => v !== option.value)
      : [...selectedValues.value, option.value]
    emit('update:modelValue', next)
    emit('change', next)
    formItem?.onFieldChange()
  } else {
    emit('update:modelValue', option.value)
    emit('change', option.value)
    open.value = false
    formItem?.onFieldBlur()
  }
}

/** 多选:点击标签上的 ✕ 移除(阻止冒泡,不触发下拉开合) */
function removeTag(value: string | number, ev: MouseEvent) {
  ev.stopPropagation()
  if (props.disabled) return
  const next = selectedValues.value.filter((v) => v !== value)
  emit('update:modelValue', next)
  emit('change', next)
  formItem?.onFieldChange()
}

function clear(ev: MouseEvent) {
  ev.stopPropagation()
  const empty = props.multiple ? [] : undefined
  emit('update:modelValue', empty)
  emit('change', empty)
  formItem?.onFieldChange()
}

function onClickOutside(ev: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(ev.target as Node)) {
    /* 多选下拉收起视为一次完整交互,触发失焦校验 */
    if (open.value && props.multiple) formItem?.onFieldBlur()
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div
    ref="rootRef"
    :class="['ax-select', `ax-select--${size}`, {
      'ax-select--multiple': multiple,
      'is-open': open,
      'is-disabled': disabled,
      'is-error': hasError
    }]"
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
      <!-- 多选:标签平铺 + 溢出折叠 -->
      <span v-if="multiple && selectedOptions.length > 0" class="ax-select__tags">
        <AxTag
          v-for="option in visibleTags"
          :key="option.value"
          :closable="!disabled"
          @close="removeTag(option.value, $event)"
        >{{ option.label }}</AxTag>
        <AxTag v-if="overflowCount > 0">+{{ overflowCount }}</AxTag>
      </span>
      <!-- 单选:文本 -->
      <span v-else-if="selected" class="ax-select__value">{{ selected.label }}</span>
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
      <ul v-if="open" class="ax-select__dropdown" role="listbox" :aria-multiselectable="multiple || undefined">
        <li
          v-for="option in options"
          :key="option.value"
          :class="['ax-select__option', {
            'is-selected': isSelected(option),
            'is-disabled': option.disabled
          }]"
          role="option"
          :aria-selected="isSelected(option)"
          @click="pick(option)"
        >
          <span class="ax-select__option-label">{{ option.label }}</span>
          <!-- 多选:选中项右侧对勾 -->
          <svg
            v-if="multiple && isSelected(option)"
            class="ax-select__option-check"
            viewBox="0 0 12 12"
            width="12"
            height="12"
            aria-hidden="true"
          >
            <path d="m2.5 6.2 2.5 2.5 4.5-5.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
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

/* 多选:标签可换行,触发器随内容长高(min-height 保持对齐基线) */
.ax-select--multiple .ax-select__trigger {
  height: auto;
  min-height: var(--ax-select-height);
  padding-top: 2px;
  padding-bottom: 2px;
}
.ax-select__tags {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--axis-space-1);
  min-width: 0;
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
  display: flex;
  align-items: center;
  gap: var(--axis-space-2);
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

.ax-select__option-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ax-select__option-check {
  flex-shrink: 0;
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
