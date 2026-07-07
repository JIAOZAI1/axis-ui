<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'AxAlert' })

withDefaults(
  defineProps<{
    /** 语义类型 */
    type?: 'info' | 'success' | 'warning' | 'error'
    /** 标题 */
    title?: string
    /** 描述文本(也可用默认插槽) */
    description?: string
    /** 可关闭 */
    closable?: boolean
    /** 显示图标 */
    showIcon?: boolean
  }>(),
  { type: 'info', showIcon: true }
)

const emit = defineEmits<{ (e: 'close'): void }>()
const visible = ref(true)

const icons: Record<string, string> = {
  info: 'M8 7.5v4M8 4.5v.5',
  success: 'M5 8.2 7.2 10.4 11 5.8',
  warning: 'M8 4.5v4.5M8 11.2v.3',
  error: 'M5.5 5.5l5 5M10.5 5.5l-5 5'
}

function close() {
  visible.value = false
  emit('close')
}
</script>

<template>
  <transition name="ax-alert-fade">
    <div v-if="visible" :class="['ax-alert', `ax-alert--${type}`]" role="alert">
      <span v-if="showIcon" class="ax-alert__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="16" height="16">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.4" />
          <path :d="icons[type]" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <div class="ax-alert__body">
        <div v-if="title" class="ax-alert__title">{{ title }}</div>
        <div class="ax-alert__description">
          <slot>{{ description }}</slot>
        </div>
      </div>
      <button v-if="closable" class="ax-alert__close" type="button" aria-label="关闭" @click="close">✕</button>
    </div>
  </transition>
</template>

<style>
.ax-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--axis-space-2);
  padding: var(--axis-space-2) var(--axis-space-3);
  border: 1px solid;
  border-radius: var(--axis-radius-lg);
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
}
.ax-alert--info {
  background: var(--axis-color-info-bg);
  border-color: var(--axis-color-info-border);
}
.ax-alert--success {
  background: var(--axis-color-success-bg);
  border-color: var(--axis-color-success-border);
}
.ax-alert--warning {
  background: var(--axis-color-warning-bg);
  border-color: var(--axis-color-warning-border);
}
.ax-alert--error {
  background: var(--axis-color-error-bg);
  border-color: var(--axis-color-error-border);
}

.ax-alert__icon {
  display: inline-flex;
  margin-top: 3px;
}
.ax-alert--info .ax-alert__icon { color: var(--axis-color-info); }
.ax-alert--success .ax-alert__icon { color: var(--axis-color-success); }
.ax-alert--warning .ax-alert__icon { color: var(--axis-color-warning); }
.ax-alert--error .ax-alert__icon { color: var(--axis-color-error); }

.ax-alert__body { flex: 1; min-width: 0; }
.ax-alert__title {
  font-weight: var(--axis-font-weight-medium);
  color: var(--axis-color-text-primary);
}
.ax-alert__description { color: var(--axis-color-text-secondary); }
.ax-alert__title + .ax-alert__description {
  margin-top: var(--axis-space-1);
  font-size: var(--axis-font-size-xs);
  line-height: var(--axis-line-height-xs);
}

.ax-alert__close {
  border: none;
  background: transparent;
  padding: 2px;
  color: var(--axis-color-text-tertiary);
  cursor: pointer;
  font-size: var(--axis-font-size-xs);
  transition: color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-alert__close:hover { color: var(--axis-color-text-secondary); }

.ax-alert-fade-leave-active {
  transition: all var(--axis-motion-duration-mid) var(--axis-motion-ease-in);
}
.ax-alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
