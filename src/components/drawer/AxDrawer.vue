<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

defineOptions({ name: 'AxDrawer' })

const props = withDefaults(
  defineProps<{
    /** v-model 控制显隐 */
    modelValue?: boolean
    title?: string
    /**
     * 面板宽度(placement 为 left/right 时)或高度(top/bottom 时):
     * 'sm'/'md'/'lg' 取 panel-width-* Token(240/300/360px),也接受任意 CSS 值
     */
    width?: 'sm' | 'md' | 'lg' | (string & {})
    /** 滑出方向 */
    placement?: 'left' | 'right' | 'top' | 'bottom'
    /** 点击遮罩关闭 */
    maskClosable?: boolean
    /** 显示右上角关闭按钮 */
    closable?: boolean
    /** 是否渲染遮罩(常驻工具面板可设为 false,不遮挡下方内容且不锁滚动) */
    mask?: boolean
  }>(),
  {
    modelValue: false,
    width: 'md',
    placement: 'right',
    maskClosable: true,
    closable: true,
    mask: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const sizeValue =
  props.width === 'sm' || props.width === 'md' || props.width === 'lg'
    ? `var(--axis-panel-width-${props.width})`
    : props.width

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onMaskClick() {
  if (props.maskClosable) close()
}

function onKeydown(ev: KeyboardEvent) {
  if (ev.key === 'Escape') close()
}

watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return
    if (props.mask) document.body.style.overflow = open ? 'hidden' : ''
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
  if (props.modelValue && props.mask) document.body.style.overflow = ''
})
</script>

<template>
  <teleport to="body">
    <transition name="ax-drawer-fade">
      <div v-if="modelValue" class="ax-drawer">
        <div v-if="mask" class="ax-drawer__mask" @click="onMaskClick" />
        <transition :name="`ax-drawer-slide-${placement}`" appear>
          <div
            class="ax-drawer__panel"
            :class="[`ax-drawer__panel--${placement}`, { 'is-maskless': !mask }]"
            role="dialog"
            aria-modal="true"
            :style="placement === 'left' || placement === 'right'
              ? { width: sizeValue }
              : { height: sizeValue }"
          >
            <div class="ax-drawer__header">
              <div class="ax-drawer__title">
                <slot name="title">{{ title }}</slot>
              </div>
              <button
                v-if="closable"
                class="ax-drawer__close"
                type="button"
                aria-label="关闭"
                @click="close"
              >✕</button>
            </div>
            <div class="ax-drawer__body">
              <slot />
            </div>
            <div v-if="$slots.footer" class="ax-drawer__footer">
              <slot name="footer" />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<style>
.ax-drawer {
  position: fixed;
  inset: 0;
  z-index: var(--axis-z-modal);
}

.ax-drawer__mask {
  position: fixed;
  inset: 0;
  background: var(--axis-color-bg-mask);
}

.ax-drawer__panel {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: var(--axis-color-bg-elevated);
  box-shadow: var(--axis-shadow-lg);
}
.ax-drawer__panel--left { top: 0; left: 0; bottom: 0; }
.ax-drawer__panel--right { top: 0; right: 0; bottom: 0; }
.ax-drawer__panel--top { top: 0; left: 0; right: 0; }
.ax-drawer__panel--bottom { bottom: 0; left: 0; right: 0; }
/* 无遮罩(常驻工具面板):不拦截下方内容点击之外的区域,仅面板自身可交互 */
.ax-drawer__panel.is-maskless { pointer-events: auto; }
.ax-drawer:has(.is-maskless) { pointer-events: none; }

.ax-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: var(--axis-space-4) var(--axis-space-6);
  border-bottom: 1px solid var(--axis-color-border-split);
}
.ax-drawer__title {
  font-size: var(--axis-font-size-lg);
  line-height: var(--axis-line-height-lg);
  font-weight: var(--axis-font-weight-medium);
  color: var(--axis-color-text-primary);
}
.ax-drawer__close {
  border: none;
  background: transparent;
  padding: var(--axis-space-1);
  color: var(--axis-color-text-tertiary);
  font-size: var(--axis-font-size-base);
  cursor: pointer;
  transition: color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-drawer__close:hover { color: var(--axis-color-text-secondary); }

.ax-drawer__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: var(--axis-space-6);
  color: var(--axis-color-text-primary);
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
}

.ax-drawer__footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  gap: var(--axis-space-2);
  padding: var(--axis-space-3) var(--axis-space-6) var(--axis-space-4);
  border-top: 1px solid var(--axis-color-border-split);
}

/* 遮罩淡入淡出 */
.ax-drawer-fade-enter-active { transition: opacity var(--axis-motion-duration-slow) var(--axis-motion-ease-out); }
.ax-drawer-fade-leave-active { transition: opacity var(--axis-motion-duration-mid) var(--axis-motion-ease-in); }
.ax-drawer-fade-enter-from,
.ax-drawer-fade-leave-to { opacity: 0; }

/* 面板按方向滑入 */
.ax-drawer-slide-right-enter-active,
.ax-drawer-slide-left-enter-active,
.ax-drawer-slide-top-enter-active,
.ax-drawer-slide-bottom-enter-active {
  transition: transform var(--axis-motion-duration-slow) var(--axis-motion-ease-out);
}
.ax-drawer-slide-right-enter-from { transform: translateX(100%); }
.ax-drawer-slide-left-enter-from { transform: translateX(-100%); }
.ax-drawer-slide-top-enter-from { transform: translateY(-100%); }
.ax-drawer-slide-bottom-enter-from { transform: translateY(100%); }
</style>
