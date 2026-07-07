<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AxLink' })

const props = withDefaults(
  defineProps<{
    /** 跳转地址,禁用时不渲染 href */
    href?: string
    /** 语义色 */
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    /** 下划线策略 */
    underline?: 'always' | 'hover' | 'never'
    /** 禁用 */
    disabled?: boolean
    /** 原生 target,_blank 时自动补 rel 防钓鱼 */
    target?: '_self' | '_blank' | '_parent' | '_top'
    /**
     * 字号:预设档位取字号 Token(含配套行高),也接受任意 CSS 值(如 '18px');
     * 不传则继承上下文(font-size: inherit)
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | (string & {})
    /** 字重:取 font-weight Token,不传则继承 */
    weight?: 'regular' | 'medium' | 'semibold'
  }>(),
  { type: 'primary', underline: 'hover' }
)

const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

const rel = computed(() =>
  props.target === '_blank' ? 'noopener noreferrer' : undefined
)

const classes = computed(() => [
  'ax-link',
  `ax-link--${props.type}`,
  `ax-link--underline-${props.underline}`,
  { 'is-disabled': props.disabled }
])

/* 预设档位 → 字号 Token 后缀(md 对应 base) */
const presetSizes: Record<string, string> = { xs: 'xs', sm: 'sm', md: 'base', lg: 'lg' }

const style = computed(() => {
  const s: Record<string, string> = {}
  if (props.size) {
    const token = presetSizes[props.size]
    if (token) {
      s.fontSize = `var(--axis-font-size-${token})`
      s.lineHeight = `var(--axis-line-height-${token})`
    } else {
      s.fontSize = props.size
    }
  }
  if (props.weight) {
    s.fontWeight = `var(--axis-font-weight-${props.weight})`
  }
  return Object.keys(s).length ? s : undefined
})

function onClick(ev: MouseEvent) {
  if (props.disabled) {
    ev.preventDefault()
    return
  }
  emit('click', ev)
}
</script>

<template>
  <a
    :class="classes"
    :style="style"
    :href="disabled ? undefined : href"
    :target="disabled ? undefined : target"
    :rel="rel"
    :aria-disabled="disabled || undefined"
    @click="onClick"
  >
    <slot />
  </a>
</template>

<style>
.ax-link {
  display: inline-flex;
  align-items: center;
  gap: var(--axis-space-1);
  font-size: inherit;
  line-height: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}

/* 语义色:默认态 / 悬浮态 / 激活态 */
.ax-link--default { color: var(--axis-color-text-secondary); }
.ax-link--default:hover:not(.is-disabled) { color: var(--axis-color-text-primary); }

.ax-link--primary { color: var(--axis-color-primary); }
.ax-link--primary:hover:not(.is-disabled) { color: var(--axis-color-primary-hover); }
.ax-link--primary:active:not(.is-disabled) { color: var(--axis-color-primary-active); }

.ax-link--success { color: var(--axis-color-success); }
.ax-link--success:hover:not(.is-disabled) { color: var(--axis-color-success-hover); }
.ax-link--success:active:not(.is-disabled) { color: var(--axis-color-success-active); }

.ax-link--warning { color: var(--axis-color-warning); }
.ax-link--warning:hover:not(.is-disabled) { color: var(--axis-color-warning-hover); }
.ax-link--warning:active:not(.is-disabled) { color: var(--axis-color-warning-active); }

.ax-link--danger { color: var(--axis-color-error); }
.ax-link--danger:hover:not(.is-disabled) { color: var(--axis-color-error-hover); }
.ax-link--danger:active:not(.is-disabled) { color: var(--axis-color-error-active); }

/* 下划线策略 */
.ax-link--underline-always { text-decoration: underline; text-underline-offset: 3px; }
.ax-link--underline-hover:hover:not(.is-disabled) {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.ax-link--underline-never,
.ax-link--underline-never:hover { text-decoration: none; }

.ax-link.is-disabled {
  color: var(--axis-color-text-disabled);
  cursor: not-allowed;
}

/* 键盘可达性:聚焦环 */
.ax-link:focus-visible {
  outline: 2px solid var(--axis-color-primary);
  outline-offset: 2px;
  border-radius: var(--axis-radius-sm);
}
</style>
