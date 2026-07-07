<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AxBadge' })

const props = withDefaults(
  defineProps<{
    /** 数字值 */
    value?: number | string
    /** 封顶值,超出显示 {max}+ */
    max?: number
    /** 仅显示小红点 */
    dot?: boolean
    /** 语义色 */
    type?: 'error' | 'primary' | 'success' | 'warning'
    /** 为 0 时也显示 */
    showZero?: boolean
  }>(),
  { max: 99, type: 'error' }
)

const content = computed(() => {
  if (props.dot) return ''
  if (typeof props.value === 'number' && props.value > props.max) return `${props.max}+`
  return String(props.value ?? '')
})

const hidden = computed(
  () => !props.dot && !props.showZero && (props.value === 0 || props.value === undefined)
)
</script>

<template>
  <span class="ax-badge">
    <slot />
    <sup
      v-if="!hidden"
      :class="['ax-badge__sup', `ax-badge__sup--${type}`, { 'is-dot': dot, 'is-alone': !$slots.default }]"
    >{{ content }}</sup>
  </span>
</template>

<style>
.ax-badge {
  position: relative;
  display: inline-flex;
}

.ax-badge__sup {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 var(--axis-space-1);
  border-radius: var(--axis-radius-full);
  color: #fff;
  font-size: var(--axis-font-size-xs);
  line-height: 1;
  box-shadow: 0 0 0 1px var(--axis-color-bg-container);
}
.ax-badge__sup--error { background: var(--axis-color-error); }
.ax-badge__sup--primary { background: var(--axis-color-primary); }
.ax-badge__sup--success { background: var(--axis-color-success); }
.ax-badge__sup--warning { background: var(--axis-color-warning); }

.ax-badge__sup.is-dot {
  min-width: 8px;
  width: 8px;
  height: 8px;
  padding: 0;
}
.ax-badge__sup.is-alone {
  position: static;
  transform: none;
}
</style>
