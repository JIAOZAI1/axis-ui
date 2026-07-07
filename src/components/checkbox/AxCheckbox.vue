<script setup lang="ts">
import { computed, inject } from 'vue'
import { checkboxGroupKey } from './context'

defineOptions({ name: 'AxCheckbox' })

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    /** 在 CheckboxGroup 中使用时的取值 */
    value?: string | number
    disabled?: boolean
    /** 半选态(仅视觉) */
    indeterminate?: boolean
  }>(),
  { modelValue: false }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const group = inject(checkboxGroupKey, null)

const checked = computed(() =>
  group ? group.value.value.includes(props.value as string | number) : props.modelValue
)
const isDisabled = computed(() => props.disabled || group?.disabled.value || false)

function toggle() {
  if (isDisabled.value) return
  if (group) {
    group.toggle(props.value as string | number)
  } else {
    const next = !props.modelValue
    emit('update:modelValue', next)
    emit('change', next)
  }
}
</script>

<template>
  <label
    :class="['ax-checkbox', { 'is-checked': checked, 'is-disabled': isDisabled, 'is-indeterminate': indeterminate }]"
  >
    <input
      class="ax-checkbox__input"
      type="checkbox"
      :checked="checked"
      :disabled="isDisabled"
      @change="toggle"
    />
    <span class="ax-checkbox__box" aria-hidden="true">
      <svg v-if="checked && !indeterminate" viewBox="0 0 12 12" class="ax-checkbox__check">
        <path d="M2.5 6.2 5 8.7l4.5-5.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span v-else-if="indeterminate" class="ax-checkbox__dash" />
    </span>
    <span class="ax-checkbox__label"><slot /></span>
  </label>
</template>

<style>
.ax-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--axis-space-2);
  font-size: var(--axis-font-size-base);
  color: var(--axis-color-text-primary);
  cursor: pointer;
  user-select: none;
}

.ax-checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.ax-checkbox__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 1px solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-sm);
  background: var(--axis-color-bg-container);
  color: var(--axis-color-text-inverse);
  transition:
    background-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    border-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-checkbox:hover:not(.is-disabled) .ax-checkbox__box {
  border-color: var(--axis-color-primary);
}
.ax-checkbox.is-checked .ax-checkbox__box,
.ax-checkbox.is-indeterminate .ax-checkbox__box {
  background: var(--axis-color-primary);
  border-color: var(--axis-color-primary);
}

.ax-checkbox__check { width: 12px; height: 12px; }
.ax-checkbox__dash {
  width: 8px;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
}

.ax-checkbox.is-disabled {
  cursor: not-allowed;
  color: var(--axis-color-text-disabled);
}
.ax-checkbox.is-disabled .ax-checkbox__box {
  background: var(--axis-color-fill-disabled);
  border-color: var(--axis-color-border-default);
}
.ax-checkbox.is-disabled.is-checked .ax-checkbox__box {
  color: var(--axis-color-text-disabled);
}
</style>
