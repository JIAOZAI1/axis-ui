<script setup lang="ts">
import { computed } from 'vue'
import { icons, type IconName } from './icons'

defineOptions({ name: 'AxIcon' })

const props = withDefaults(
  defineProps<{
    /** 内置图标名;不传时渲染默认插槽(自定义 SVG) */
    name?: IconName
    /** 尺寸:三档取 icon-size Token,也接受像素数字 */
    size?: 'sm' | 'md' | 'lg' | number
    /** 旋转动画(加载态,常配 name="loading") */
    spin?: boolean
    /** 无障碍标签;不传时视为装饰性图标(aria-hidden) */
    label?: string
  }>(),
  { size: 'md' }
)

const style = computed(() => ({
  '--ax-icon-size':
    typeof props.size === 'number'
      ? `${props.size}px`
      : `var(--axis-icon-size-${props.size})`
}))

/* 内置图标为库内静态字符串,v-html 无注入风险 */
const content = computed(() => (props.name ? icons[props.name] : ''))
</script>

<template>
  <span
    :class="['ax-icon', { 'is-spin': spin }]"
    :style="style"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <svg
      v-if="name"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      v-html="content"
    />
    <slot v-else />
  </span>
</template>

<style>
.ax-icon {
  --ax-icon-size: var(--axis-icon-size-md);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ax-icon-size);
  height: var(--ax-icon-size);
  flex-shrink: 0;
  color: inherit;
  vertical-align: -0.15em;
}

.ax-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.ax-icon.is-spin {
  animation: ax-icon-spin 1s linear infinite;
}

@keyframes ax-icon-spin {
  to { transform: rotate(360deg); }
}
</style>
