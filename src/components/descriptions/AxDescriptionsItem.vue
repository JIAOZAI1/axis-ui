<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'
import { descriptionsKey } from './context'

defineOptions({ name: 'AxDescriptionsItem' })

const props = withDefaults(
  defineProps<{
    label?: string
    span?: number
  }>(),
  { span: 1 }
)

const slots = useSlots()
const descriptions = inject(descriptionsKey, null)

const contentNodes = computed(() => slots.default?.() ?? [])
const hasContent = computed(() => contentNodes.value.length > 0)

const style = computed(() => ({
  '--ax-descriptions-item-span': String(Math.max(1, props.span))
}))
</script>

<template>
  <div class="ax-descriptions-item" :style="style">
    <div v-if="label || $slots.label" class="ax-descriptions-item__label">
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="ax-descriptions-item__content">
      <slot v-if="hasContent" />
      <template v-else>{{ descriptions?.emptyText.value ?? '-' }}</template>
    </div>
  </div>
</template>

<style>
.ax-descriptions-item {
  min-width: 0;
  grid-column: span min(var(--ax-descriptions-item-span), var(--ax-descriptions-columns));
}

.ax-descriptions--horizontal .ax-descriptions-item {
  display: flex;
  align-items: flex-start;
  gap: var(--axis-space-2);
}

.ax-descriptions--vertical .ax-descriptions-item {
  display: flex;
  flex-direction: column;
  gap: var(--axis-space-1);
}

.ax-descriptions-item__label {
  flex: 0 0 var(--ax-descriptions-label-width);
  max-width: var(--ax-descriptions-label-width);
  color: var(--axis-color-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ax-descriptions--vertical .ax-descriptions-item__label {
  flex: none;
  max-width: none;
}

.ax-descriptions-item__content {
  min-width: 0;
  color: var(--axis-color-text-primary);
  overflow-wrap: anywhere;
}

.ax-descriptions.is-bordered .ax-descriptions-item {
  display: grid;
  grid-template-columns: var(--ax-descriptions-label-width) minmax(0, 1fr);
  gap: 0;
  border-right: 1px solid var(--axis-color-border-split);
  border-bottom: 1px solid var(--axis-color-border-split);
}

.ax-descriptions.is-bordered.ax-descriptions--vertical .ax-descriptions-item {
  grid-template-columns: 1fr;
}

.ax-descriptions.is-bordered .ax-descriptions-item__label,
.ax-descriptions.is-bordered .ax-descriptions-item__content {
  padding: var(--ax-descriptions-padding-y) var(--ax-descriptions-padding-x);
}

.ax-descriptions.is-bordered .ax-descriptions-item__label {
  max-width: none;
  background: var(--axis-color-fill-hover);
  color: var(--axis-color-text-secondary);
  font-weight: var(--axis-font-weight-medium);
}

.ax-descriptions.is-bordered .ax-descriptions-item__content {
  background: var(--axis-color-bg-container);
}

@media (max-width: 575px) {
  .ax-descriptions--horizontal .ax-descriptions-item {
    flex-direction: column;
    gap: var(--axis-space-1);
  }

  .ax-descriptions--horizontal .ax-descriptions-item__label {
    flex: none;
    max-width: none;
  }

  .ax-descriptions.is-bordered .ax-descriptions-item {
    grid-template-columns: 1fr;
  }
}
</style>
