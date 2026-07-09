<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AxTitle' })

const props = withDefaults(
  defineProps<{
    level?: 1 | 2 | 3 | 4
    type?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error'
    weight?: 'regular' | 'medium' | 'semibold'
    ellipsis?: boolean
  }>(),
  { level: 3, type: 'primary', weight: 'semibold' }
)

const classes = computed(() => [
  'ax-title',
  `ax-title--h${props.level}`,
  `ax-title--${props.type}`,
  `ax-title--${props.weight}`,
  { 'is-ellipsis': props.ellipsis }
])
</script>

<template>
  <component :is="`h${level}`" :class="classes">
    <slot />
  </component>
</template>

<style>
.ax-title {
  margin: 0;
  color: var(--axis-color-text-primary);
  font-family: var(--axis-font-family-base);
  font-weight: var(--axis-font-weight-semibold);
}

.ax-title--h1 {
  font-size: var(--axis-font-size-h1);
  line-height: var(--axis-line-height-h1);
}
.ax-title--h2 {
  font-size: var(--axis-font-size-h2);
  line-height: var(--axis-line-height-h2);
}
.ax-title--h3 {
  font-size: var(--axis-font-size-h3);
  line-height: var(--axis-line-height-h3);
}
.ax-title--h4 {
  font-size: var(--axis-font-size-h4);
  line-height: var(--axis-line-height-h4);
}

.ax-title--secondary { color: var(--axis-color-text-secondary); }
.ax-title--tertiary { color: var(--axis-color-text-tertiary); }
.ax-title--success { color: var(--axis-color-success); }
.ax-title--warning { color: var(--axis-color-warning); }
.ax-title--error { color: var(--axis-color-error); }

.ax-title--regular { font-weight: var(--axis-font-weight-regular); }
.ax-title--medium { font-weight: var(--axis-font-weight-medium); }
.ax-title--semibold { font-weight: var(--axis-font-weight-semibold); }

.ax-title.is-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
