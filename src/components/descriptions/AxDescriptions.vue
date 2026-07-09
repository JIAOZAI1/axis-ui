<script setup lang="ts">
import { computed, toRef } from 'vue'
import { descriptionsKey, type DescriptionsLayout, type DescriptionsSize } from './context'
import { provide } from 'vue'

defineOptions({ name: 'AxDescriptions' })

const props = withDefaults(
  defineProps<{
    title?: string
    column?: number
    bordered?: boolean
    size?: DescriptionsSize
    layout?: DescriptionsLayout
    labelWidth?: string | number
    emptyText?: string
  }>(),
  {
    column: 3,
    bordered: false,
    size: 'md',
    layout: 'horizontal',
    emptyText: '-'
  }
)

const classes = computed(() => [
  'ax-descriptions',
  `ax-descriptions--${props.size}`,
  `ax-descriptions--${props.layout}`,
  `ax-descriptions--cols-${Math.min(6, Math.max(1, props.column))}`,
  {
    'is-bordered': props.bordered
  }
])

const style = computed(() => ({
  '--ax-descriptions-requested-columns': String(Math.min(6, Math.max(1, props.column))),
  '--ax-descriptions-label-width':
    typeof props.labelWidth === 'number' ? `${props.labelWidth}px` : props.labelWidth
}))

provide(descriptionsKey, {
  emptyText: toRef(props, 'emptyText'),
  layout: toRef(props, 'layout'),
  labelWidth: toRef(props, 'labelWidth'),
  size: toRef(props, 'size'),
  bordered: toRef(props, 'bordered')
})
</script>

<template>
  <section :class="classes" :style="style">
    <div v-if="title || $slots.title || $slots.extra" class="ax-descriptions__header">
      <div class="ax-descriptions__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="$slots.extra" class="ax-descriptions__extra">
        <slot name="extra" />
      </div>
    </div>
    <div class="ax-descriptions__body">
      <slot />
    </div>
  </section>
</template>

<style>
.ax-descriptions {
  --ax-descriptions-requested-columns: 3;
  --ax-descriptions-columns: var(--ax-descriptions-requested-columns);
  --ax-descriptions-gap-x: var(--axis-space-6);
  --ax-descriptions-gap-y: var(--axis-space-3);
  --ax-descriptions-padding-y: var(--axis-space-3);
  --ax-descriptions-padding-x: var(--axis-space-4);
  --ax-descriptions-label-width: calc(var(--axis-space-12) * 2);
  --ax-descriptions-font-size: var(--axis-font-size-base);
  --ax-descriptions-line-height: var(--axis-line-height-base);

  color: var(--axis-color-text-primary);
  font-size: var(--ax-descriptions-font-size);
  line-height: var(--ax-descriptions-line-height);
}

.ax-descriptions--sm {
  --ax-descriptions-gap-x: var(--axis-space-4);
  --ax-descriptions-gap-y: var(--axis-space-2);
  --ax-descriptions-padding-y: var(--axis-space-2);
  --ax-descriptions-padding-x: var(--axis-space-3);
  --ax-descriptions-font-size: var(--axis-font-size-sm);
  --ax-descriptions-line-height: var(--axis-line-height-sm);
}

.ax-descriptions--lg {
  --ax-descriptions-gap-x: var(--axis-space-8);
  --ax-descriptions-gap-y: var(--axis-space-4);
  --ax-descriptions-padding-y: var(--axis-space-4);
  --ax-descriptions-padding-x: var(--axis-space-5);
  --ax-descriptions-font-size: var(--axis-font-size-lg);
  --ax-descriptions-line-height: var(--axis-line-height-lg);
}

.ax-descriptions__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--axis-space-4);
  margin-bottom: var(--axis-space-4);
}

.ax-descriptions__title {
  min-width: 0;
  color: var(--axis-color-text-primary);
  font-size: var(--axis-font-size-lg);
  line-height: var(--axis-line-height-lg);
  font-weight: var(--axis-font-weight-medium);
}

.ax-descriptions__extra {
  flex: none;
  color: var(--axis-color-text-secondary);
  font-size: var(--axis-font-size-base);
}

.ax-descriptions__body {
  display: grid;
  grid-template-columns: repeat(var(--ax-descriptions-columns), minmax(0, 1fr));
  column-gap: var(--ax-descriptions-gap-x);
  row-gap: var(--ax-descriptions-gap-y);
}

.ax-descriptions.is-bordered .ax-descriptions__body {
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--axis-color-border-split);
  border-radius: var(--axis-radius-lg);
  background: var(--axis-color-bg-container);
}

@media (max-width: 991px) {
  .ax-descriptions--cols-3,
  .ax-descriptions--cols-4,
  .ax-descriptions--cols-5,
  .ax-descriptions--cols-6 {
    --ax-descriptions-columns: 2;
  }
}

@media (max-width: 575px) {
  .ax-descriptions__body {
    grid-template-columns: 1fr;
  }
}
</style>
