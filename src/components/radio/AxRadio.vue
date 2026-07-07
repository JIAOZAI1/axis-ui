<script setup lang="ts">
import { computed, inject } from 'vue'
import { radioGroupKey } from './context'

defineOptions({ name: 'AxRadio' })

const props = defineProps<{
  modelValue?: string | number
  /** 本选项的取值 */
  value: string | number
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const group = inject(radioGroupKey, null)

const checked = computed(() =>
  group ? group.value.value === props.value : props.modelValue === props.value
)
const isDisabled = computed(() => props.disabled || group?.disabled.value || false)

function select() {
  if (isDisabled.value || checked.value) return
  if (group) {
    group.select(props.value)
  } else {
    emit('update:modelValue', props.value)
    emit('change', props.value)
  }
}
</script>

<template>
  <label :class="['ax-radio', { 'is-checked': checked, 'is-disabled': isDisabled }]">
    <input
      class="ax-radio__input"
      type="radio"
      :checked="checked"
      :disabled="isDisabled"
      @change="select"
    />
    <span class="ax-radio__dot" aria-hidden="true" />
    <span class="ax-radio__label"><slot /></span>
  </label>
</template>

<style>
.ax-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--axis-space-2);
  font-size: var(--axis-font-size-base);
  color: var(--axis-color-text-primary);
  cursor: pointer;
  user-select: none;
}

.ax-radio__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.ax-radio__dot {
  position: relative;
  width: 16px;
  height: 16px;
  border: 1px solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-full);
  background: var(--axis-color-bg-container);
  transition: border-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-radio:hover:not(.is-disabled) .ax-radio__dot {
  border-color: var(--axis-color-primary);
}
.ax-radio.is-checked .ax-radio__dot {
  border-color: var(--axis-color-primary);
}
.ax-radio__dot::after {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: var(--axis-radius-full);
  background: var(--axis-color-primary);
  transform: scale(0);
  transition: transform var(--axis-motion-duration-fast) var(--axis-motion-ease-out);
}
.ax-radio.is-checked .ax-radio__dot::after { transform: scale(1); }

.ax-radio.is-disabled {
  cursor: not-allowed;
  color: var(--axis-color-text-disabled);
}
.ax-radio.is-disabled .ax-radio__dot {
  background: var(--axis-color-fill-disabled);
}
.ax-radio.is-disabled.is-checked .ax-radio__dot::after {
  background: var(--axis-color-text-disabled);
}
</style>
