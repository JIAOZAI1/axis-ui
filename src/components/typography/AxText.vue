<script setup lang="ts">
import { computed, ref } from 'vue'

defineOptions({ name: 'AxText' })

const props = withDefaults(
  defineProps<{
    type?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    weight?: 'regular' | 'medium' | 'semibold'
    code?: boolean
    ellipsis?: boolean
    copyable?: boolean
    block?: boolean
    lineClamp?: number
    tooltip?: boolean
    text?: string
  }>(),
  {
    type: 'primary',
    size: 'md',
    weight: 'regular',
    tooltip: true
  }
)

const emit = defineEmits<{ (e: 'copy', value: string): void }>()

const textRef = ref<HTMLElement | null>(null)

const classes = computed(() => [
  'ax-text',
  `ax-text--${props.type}`,
  `ax-text--${props.size}`,
  `ax-text--${props.weight}`,
  {
    'is-code': props.code,
    'is-ellipsis': props.ellipsis,
    'is-block': props.block,
    'is-line-clamp': props.lineClamp
  }
])

const style = computed(() => (
  props.lineClamp ? { '--ax-text-line-clamp': String(props.lineClamp) } : undefined
))

const title = computed(() => {
  if (!props.tooltip || (!props.ellipsis && !props.lineClamp)) return undefined
  return props.text
})

async function copyText() {
  const value = props.text ?? textRef.value?.innerText ?? ''
  if (!value) return
  await navigator.clipboard?.writeText(value)
  emit('copy', value)
}
</script>

<template>
  <span :class="['ax-text-wrap', { 'is-block': block }]">
    <component
      :is="code ? 'code' : 'span'"
      ref="textRef"
      :class="classes"
      :style="style"
      :title="title"
    >
      <slot>{{ text }}</slot>
    </component>
    <button
      v-if="copyable"
      class="ax-text__copy"
      type="button"
      aria-label="复制"
      @click="copyText"
    >复制</button>
  </span>
</template>

<style>
.ax-text-wrap {
  display: inline-flex;
  align-items: baseline;
  max-width: 100%;
  gap: var(--axis-space-1);
}

.ax-text-wrap.is-block {
  display: flex;
}

.ax-text {
  min-width: 0;
  color: var(--axis-color-text-primary);
  font-family: var(--axis-font-family-base);
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
  font-weight: var(--axis-font-weight-regular);
}

.ax-text--secondary { color: var(--axis-color-text-secondary); }
.ax-text--tertiary { color: var(--axis-color-text-tertiary); }
.ax-text--success { color: var(--axis-color-success); }
.ax-text--warning { color: var(--axis-color-warning); }
.ax-text--error { color: var(--axis-color-error); }

.ax-text--xs {
  font-size: var(--axis-font-size-xs);
  line-height: var(--axis-line-height-xs);
}
.ax-text--sm {
  font-size: var(--axis-font-size-sm);
  line-height: var(--axis-line-height-sm);
}
.ax-text--lg {
  font-size: var(--axis-font-size-lg);
  line-height: var(--axis-line-height-lg);
}

.ax-text--medium { font-weight: var(--axis-font-weight-medium); }
.ax-text--semibold { font-weight: var(--axis-font-weight-semibold); }

.ax-text.is-code {
  padding: 0 var(--axis-space-1);
  border: 1px solid var(--axis-color-border-split);
  border-radius: var(--axis-radius-sm);
  background: var(--axis-color-fill-hover);
  font-family: var(--axis-font-family-code);
}

.ax-text.is-ellipsis {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: bottom;
}

.ax-text.is-line-clamp {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: var(--ax-text-line-clamp);
  -webkit-box-orient: vertical;
}

.ax-text-wrap.is-block .ax-text {
  width: 100%;
}

.ax-text__copy {
  flex: none;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--axis-color-primary);
  font: inherit;
  font-size: var(--axis-font-size-xs);
  line-height: var(--axis-line-height-xs);
  cursor: pointer;
}

.ax-text__copy:hover {
  color: var(--axis-color-primary-hover);
}
</style>
