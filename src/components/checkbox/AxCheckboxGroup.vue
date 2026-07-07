<script setup lang="ts">
import { computed, provide } from 'vue'
import { checkboxGroupKey } from './context'

defineOptions({ name: 'AxCheckboxGroup' })

const props = withDefaults(
  defineProps<{
    modelValue?: (string | number)[]
    disabled?: boolean
  }>(),
  { modelValue: () => [], disabled: false }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: (string | number)[]): void
  (e: 'change', value: (string | number)[]): void
}>()

provide(checkboxGroupKey, {
  value: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  toggle(value) {
    const next = props.modelValue.includes(value)
      ? props.modelValue.filter((v) => v !== value)
      : [...props.modelValue, value]
    emit('update:modelValue', next)
    emit('change', next)
  }
})
</script>

<template>
  <div class="ax-checkbox-group" role="group">
    <slot />
  </div>
</template>

<style>
.ax-checkbox-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--axis-space-4);
}
</style>
