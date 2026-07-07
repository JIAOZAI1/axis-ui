<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

defineOptions({ name: 'AxModal' })

const props = withDefaults(
  defineProps<{
    /** v-model 控制显隐 */
    modelValue?: boolean
    title?: string
    /** 宽度 */
    width?: string
    /** 点击遮罩关闭 */
    maskClosable?: boolean
    /** 显示右上角关闭按钮 */
    closable?: boolean
    /** 显示默认底部(取消/确定) */
    showFooter?: boolean
    confirmText?: string
    cancelText?: string
  }>(),
  {
    modelValue: false,
    width: '520px',
    maskClosable: true,
    closable: true,
    showFooter: true,
    confirmText: '确定',
    cancelText: '取消'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function close(reason: 'confirm' | 'cancel') {
  emit('update:modelValue', false)
  emit(reason)
}

function onMaskClick() {
  if (props.maskClosable) close('cancel')
}

function onKeydown(ev: KeyboardEvent) {
  if (ev.key === 'Escape') close('cancel')
}

/* 打开时锁定页面滚动、监听 Esc 关闭 */
watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
    }
  }
)

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('keydown', onKeydown)
  if (props.modelValue) document.body.style.overflow = ''
})
</script>

<template>
  <teleport to="body">
    <transition name="ax-modal-fade">
      <div v-if="modelValue" class="ax-modal">
        <div class="ax-modal__mask" @click="onMaskClick" />
        <transition name="ax-modal-zoom" appear>
          <div
            class="ax-modal__panel"
            role="dialog"
            aria-modal="true"
            :style="{ width }"
          >
            <div class="ax-modal__header">
              <div class="ax-modal__title">
                <slot name="title">{{ title }}</slot>
              </div>
              <button
                v-if="closable"
                class="ax-modal__close"
                type="button"
                aria-label="关闭"
                @click="close('cancel')"
              >✕</button>
            </div>
            <div class="ax-modal__body">
              <slot />
            </div>
            <div v-if="showFooter || $slots.footer" class="ax-modal__footer">
              <slot name="footer">
                <button class="ax-modal__btn" type="button" @click="close('cancel')">{{ cancelText }}</button>
                <button class="ax-modal__btn ax-modal__btn--primary" type="button" @click="close('confirm')">{{ confirmText }}</button>
              </slot>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<style>
.ax-modal {
  position: fixed;
  inset: 0;
  z-index: var(--axis-z-modal);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 100px var(--axis-space-4) var(--axis-space-4);
  overflow: auto;
  font-family: var(--axis-font-family-base);
}

.ax-modal__mask {
  position: fixed;
  inset: 0;
  background: var(--axis-color-bg-mask);
}

.ax-modal__panel {
  position: relative;
  max-width: 100%;
  background: var(--axis-color-bg-elevated);
  border-radius: var(--axis-radius-lg);
  box-shadow: var(--axis-shadow-lg);
}

.ax-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--axis-space-4) var(--axis-space-6);
}
.ax-modal__title {
  font-size: var(--axis-font-size-lg);
  line-height: var(--axis-line-height-lg);
  font-weight: var(--axis-font-weight-medium);
  color: var(--axis-color-text-primary);
}
.ax-modal__close {
  border: none;
  background: transparent;
  padding: var(--axis-space-1);
  color: var(--axis-color-text-tertiary);
  font-size: var(--axis-font-size-base);
  cursor: pointer;
  transition: color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-modal__close:hover { color: var(--axis-color-text-secondary); }

.ax-modal__body {
  padding: 0 var(--axis-space-6) var(--axis-space-6);
  color: var(--axis-color-text-primary);
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
}

.ax-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--axis-space-2);
  padding: var(--axis-space-3) var(--axis-space-6) var(--axis-space-4);
}

.ax-modal__btn {
  height: var(--axis-control-height-md);
  padding: 0 var(--axis-space-4);
  border: 1px solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-md);
  background: var(--axis-color-bg-container);
  color: var(--axis-color-text-primary);
  font-size: var(--axis-font-size-base);
  cursor: pointer;
  transition: all var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-modal__btn:hover {
  color: var(--axis-color-primary-hover);
  border-color: var(--axis-color-primary-hover);
}
.ax-modal__btn--primary {
  background: var(--axis-color-primary);
  border-color: transparent;
  color: var(--axis-color-text-inverse);
}
.ax-modal__btn--primary:hover {
  background: var(--axis-color-primary-hover);
  color: var(--axis-color-text-inverse);
}

/* 出入场:mask 淡入淡出 + panel 缩放,slow 档 */
.ax-modal-fade-enter-active { transition: opacity var(--axis-motion-duration-slow) var(--axis-motion-ease-out); }
.ax-modal-fade-leave-active { transition: opacity var(--axis-motion-duration-mid) var(--axis-motion-ease-in); }
.ax-modal-fade-enter-from,
.ax-modal-fade-leave-to { opacity: 0; }

.ax-modal-zoom-enter-active { transition: transform var(--axis-motion-duration-slow) var(--axis-motion-ease-out); }
.ax-modal-zoom-enter-from { transform: scale(0.92); }
</style>
