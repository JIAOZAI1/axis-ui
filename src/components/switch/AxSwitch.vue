<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AxSwitch' })

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean
    size?: 'sm' | 'md'
    /** 开启态文案 */
    checkedText?: string
    /** 关闭态文案 */
    uncheckedText?: string
  }>(),
  { modelValue: false, size: 'md' }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const classes = computed(() => [
  'ax-switch',
  `ax-switch--${props.size}`,
  { 'is-checked': props.modelValue, 'is-disabled': props.disabled }
])

function toggle() {
  if (props.disabled) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <button
    :class="classes"
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="ax-switch__handle" />
    <span v-if="checkedText || uncheckedText" class="ax-switch__text">
      {{ modelValue ? checkedText : uncheckedText }}
    </span>
  </button>
</template>

<style>
.ax-switch {
  --ax-switch-height: 22px;
  --ax-switch-min-width: 44px;
  --ax-switch-handle: 18px;

  position: relative;
  display: inline-flex;
  align-items: center;
  height: var(--ax-switch-height);
  min-width: var(--ax-switch-min-width);
  padding: 0 var(--axis-space-2) 0 calc(var(--ax-switch-handle) + 6px);
  border: none;
  border-radius: var(--axis-radius-full);
  background: var(--axis-color-fill-active);
  cursor: pointer;
  transition: background-color var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-switch--sm {
  --ax-switch-height: 16px;
  --ax-switch-min-width: 28px;
  --ax-switch-handle: 12px;
}
.ax-switch.is-checked {
  background: var(--axis-color-primary);
  padding: 0 calc(var(--ax-switch-handle) + 6px) 0 var(--axis-space-2);
}

.ax-switch__handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: var(--ax-switch-handle);
  height: var(--ax-switch-handle);
  border-radius: var(--axis-radius-full);
  background: #fff;
  box-shadow: var(--axis-shadow-sm);
  transition: left var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-switch.is-checked .ax-switch__handle {
  left: calc(100% - var(--ax-switch-handle) - 2px);
}

.ax-switch__text {
  font-size: var(--axis-font-size-xs);
  color: var(--axis-color-text-inverse);
  line-height: 1;
}
.ax-switch:not(.is-checked) .ax-switch__text {
  color: var(--axis-color-text-secondary);
}

.ax-switch.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
