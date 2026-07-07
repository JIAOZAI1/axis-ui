<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AxTag' })

const props = withDefaults(
  defineProps<{
    /** 语义类型 */
    type?: 'default' | 'primary' | 'success' | 'warning' | 'error'
    /** 可关闭 */
    closable?: boolean
    /** 胶囊圆角 */
    round?: boolean
  }>(),
  { type: 'default' }
)

const emit = defineEmits<{ (e: 'close', ev: MouseEvent): void }>()

const classes = computed(() => [
  'ax-tag',
  `ax-tag--${props.type}`,
  { 'is-round': props.round }
])
</script>

<template>
  <span :class="classes">
    <slot />
    <button
      v-if="closable"
      class="ax-tag__close"
      type="button"
      aria-label="关闭"
      @click="emit('close', $event)"
    >✕</button>
  </span>
</template>

<style>
.ax-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--axis-space-1);
  padding: 0 var(--axis-space-2);
  height: 22px;
  border: 1px solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-sm);
  background: var(--axis-color-fill-hover);
  color: var(--axis-color-text-secondary);
  font-size: var(--axis-font-size-xs);
  line-height: 1;
  white-space: nowrap;
}
.ax-tag.is-round { border-radius: var(--axis-radius-full); }

.ax-tag--primary {
  background: var(--axis-color-primary-bg);
  border-color: var(--axis-color-primary-border);
  color: var(--axis-color-primary);
}
.ax-tag--success {
  background: var(--axis-color-success-bg);
  border-color: var(--axis-color-success-border);
  color: var(--axis-color-success);
}
.ax-tag--warning {
  background: var(--axis-color-warning-bg);
  border-color: var(--axis-color-warning-border);
  color: var(--axis-color-warning);
}
.ax-tag--error {
  background: var(--axis-color-error-bg);
  border-color: var(--axis-color-error-border);
  color: var(--axis-color-error);
}

.ax-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  padding: 0;
  margin-right: -2px;
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.6;
  font-size: 10px;
  cursor: pointer;
  transition: opacity var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-tag__close:hover { opacity: 1; }
</style>
