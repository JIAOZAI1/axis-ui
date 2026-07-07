<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineOptions({ name: 'AxMessageItem' })

const props = withDefaults(
  defineProps<{
    id: string
    type?: 'info' | 'success' | 'warning' | 'error'
    content: string
    duration?: number
  }>(),
  { type: 'info', duration: 3000 }
)

const emit = defineEmits<{ (e: 'destroy'): void }>()

const visible = ref(false)

const icons: Record<string, string> = {
  info: 'M8 7.5v4M8 4.5v.5',
  success: 'M5 8.2 7.2 10.4 11 5.8',
  warning: 'M8 4.5v4.5M8 11.2v.3',
  error: 'M5.5 5.5l5 5M10.5 5.5l-5 5'
}

onMounted(() => {
  visible.value = true
  if (props.duration > 0) {
    setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
})
</script>

<template>
  <transition name="ax-message-slide" appear @after-leave="emit('destroy')">
    <div v-if="visible" :class="['ax-message', `ax-message--${type}`]" role="status">
      <span class="ax-message__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="16" height="16">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.4" />
          <path :d="icons[type]" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <span class="ax-message__content">{{ content }}</span>
    </div>
  </transition>
</template>

<style>
.ax-message-container {
  position: fixed;
  top: var(--axis-space-6);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--axis-z-message);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--axis-space-2);
  pointer-events: none;
}

.ax-message {
  display: inline-flex;
  align-items: center;
  gap: var(--axis-space-2);
  padding: var(--axis-space-2) var(--axis-space-4);
  background: var(--axis-color-bg-elevated);
  border-radius: var(--axis-radius-lg);
  box-shadow: var(--axis-shadow-overlay);
  font-family: var(--axis-font-family-base);
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
  color: var(--axis-color-text-primary);
  pointer-events: auto;
}

.ax-message--info .ax-message__icon { color: var(--axis-color-info); }
.ax-message--success .ax-message__icon { color: var(--axis-color-success); }
.ax-message--warning .ax-message__icon { color: var(--axis-color-warning); }
.ax-message--error .ax-message__icon { color: var(--axis-color-error); }

.ax-message__icon { display: inline-flex; }

.ax-message-slide-enter-active { transition: all var(--axis-motion-duration-mid) var(--axis-motion-ease-out); }
.ax-message-slide-leave-active { transition: all var(--axis-motion-duration-mid) var(--axis-motion-ease-in); }
.ax-message-slide-enter-from,
.ax-message-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
