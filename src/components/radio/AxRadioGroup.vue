<script setup lang="ts">
import { computed, provide } from 'vue'
import { radioGroupKey } from './context'

defineOptions({ name: 'AxRadioGroup' })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    disabled?: boolean
  }>(),
  { disabled: false }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

provide(radioGroupKey, {
  value: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  select(value) {
    emit('update:modelValue', value)
    emit('change', value)
  }
})
</script>

<template>
  <div class="ax-radio-group" role="radiogroup">
    <slot />
  </div>
</template>

<style>
.ax-radio-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--axis-space-4);
}
</style>
