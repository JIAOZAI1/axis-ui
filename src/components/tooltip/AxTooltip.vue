<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'AxTooltip' })

withDefaults(
  defineProps<{
    /** 提示内容 */
    content?: string
    /** 弹出位置 */
    placement?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  { content: '', placement: 'top' }
)

const visible = ref(false)
</script>

<template>
  <span
    class="ax-tooltip"
    @mouseenter="visible = true"
    @mouseleave="visible = false"
    @focusin="visible = true"
    @focusout="visible = false"
  >
    <slot />
    <transition name="ax-tooltip-fade">
      <span
        v-if="visible && (content || $slots.content)"
        :class="['ax-tooltip__popup', `ax-tooltip__popup--${placement}`]"
        role="tooltip"
      >
        <slot name="content">{{ content }}</slot>
        <span class="ax-tooltip__arrow" aria-hidden="true" />
      </span>
    </transition>
  </span>
</template>

<style>
.ax-tooltip {
  position: relative;
  display: inline-flex;
}

.ax-tooltip__popup {
  position: absolute;
  z-index: var(--axis-z-tooltip);
  max-width: 280px;
  width: max-content;
  padding: var(--axis-space-1) var(--axis-space-2);
  border-radius: var(--axis-radius-md);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  font-size: var(--axis-font-size-xs);
  line-height: var(--axis-line-height-xs);
  box-shadow: var(--axis-shadow-md);
  pointer-events: none;
}
[data-theme="dark"] .ax-tooltip__popup {
  background: #434343;
}

.ax-tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
  transform: rotate(45deg);
}

.ax-tooltip__popup--top {
  bottom: calc(100% + 8px);
  left: 50%;
  translate: -50% 0;
}
.ax-tooltip__popup--top .ax-tooltip__arrow {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
}

.ax-tooltip__popup--bottom {
  top: calc(100% + 8px);
  left: 50%;
  translate: -50% 0;
}
.ax-tooltip__popup--bottom .ax-tooltip__arrow {
  top: -4px;
  left: 50%;
  margin-left: -4px;
}

.ax-tooltip__popup--left {
  right: calc(100% + 8px);
  top: 50%;
  translate: 0 -50%;
}
.ax-tooltip__popup--left .ax-tooltip__arrow {
  right: -4px;
  top: 50%;
  margin-top: -4px;
}

.ax-tooltip__popup--right {
  left: calc(100% + 8px);
  top: 50%;
  translate: 0 -50%;
}
.ax-tooltip__popup--right .ax-tooltip__arrow {
  left: -4px;
  top: 50%;
  margin-top: -4px;
}

.ax-tooltip-fade-enter-active { transition: opacity var(--axis-motion-duration-fast) var(--axis-motion-ease-out); }
.ax-tooltip-fade-leave-active { transition: opacity var(--axis-motion-duration-fast) var(--axis-motion-ease-in); }
.ax-tooltip-fade-enter-from,
.ax-tooltip-fade-leave-to { opacity: 0; }
</style>
