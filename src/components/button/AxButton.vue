<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AxButton' })

const props = withDefaults(
  defineProps<{
    /** 按钮类型 */
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'text'
    /** 尺寸,对应 control-height-sm/md/lg */
    size?: 'sm' | 'md' | 'lg'
    /** 禁用 */
    disabled?: boolean
    /** 加载中 */
    loading?: boolean
    /** 撑满父容器 */
    block?: boolean
    /** 胶囊圆角 */
    round?: boolean
    /** 幽灵(描边)风格,配合彩色 type 使用 */
    plain?: boolean
    /** 原生 type */
    nativeType?: 'button' | 'submit' | 'reset'
  }>(),
  { type: 'default', size: 'md', nativeType: 'button' }
)

const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

const classes = computed(() => [
  'ax-button',
  `ax-button--${props.type}`,
  `ax-button--${props.size}`,
  {
    'is-disabled': props.disabled || props.loading,
    'is-loading': props.loading,
    'is-block': props.block,
    'is-round': props.round,
    'is-plain': props.plain
  }
])

function onClick(ev: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('click', ev)
}
</script>

<template>
  <button :class="classes" :type="nativeType" :disabled="disabled || loading" @click="onClick">
    <span v-if="loading" class="ax-button__spinner" aria-hidden="true" />
    <span class="ax-button__content"><slot /></span>
  </button>
</template>

<style>
.ax-button {
  /* L3 组件 Token:引用语义 Token */
  --ax-button-height: var(--axis-control-height-md);
  --ax-button-font-size: var(--axis-font-size-base);
  --ax-button-padding-x: var(--axis-space-4);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--axis-space-2);
  height: var(--ax-button-height);
  padding: 0 var(--ax-button-padding-x);
  border: 1px solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-md);
  background: var(--axis-color-bg-container);
  color: var(--axis-color-text-primary);
  font-size: var(--ax-button-font-size);
  font-weight: var(--axis-font-weight-regular);
  line-height: 1;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition:
    color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    background-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    border-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}

.ax-button--sm {
  --ax-button-height: var(--axis-control-height-sm);
  --ax-button-font-size: var(--axis-font-size-xs);
  --ax-button-padding-x: var(--axis-space-2);
}
.ax-button--lg {
  --ax-button-height: var(--axis-control-height-lg);
  --ax-button-font-size: var(--axis-font-size-lg);
  --ax-button-padding-x: var(--axis-space-5);
}

.ax-button--default:hover:not(.is-disabled) {
  color: var(--axis-color-primary-hover);
  border-color: var(--axis-color-primary-hover);
}
.ax-button--default:active:not(.is-disabled) {
  color: var(--axis-color-primary-active);
  border-color: var(--axis-color-primary-active);
}

.ax-button--primary,
.ax-button--success,
.ax-button--warning,
.ax-button--danger {
  color: var(--axis-color-text-inverse);
  border-color: transparent;
}
.ax-button--primary { background: var(--axis-color-primary); }
.ax-button--primary:hover:not(.is-disabled) { background: var(--axis-color-primary-hover); }
.ax-button--primary:active:not(.is-disabled) { background: var(--axis-color-primary-active); }
.ax-button--success { background: var(--axis-color-success); }
.ax-button--success:hover:not(.is-disabled) { background: var(--axis-color-success-hover); }
.ax-button--success:active:not(.is-disabled) { background: var(--axis-color-success-active); }
.ax-button--warning { background: var(--axis-color-warning); }
.ax-button--warning:hover:not(.is-disabled) { background: var(--axis-color-warning-hover); }
.ax-button--warning:active:not(.is-disabled) { background: var(--axis-color-warning-active); }
.ax-button--danger { background: var(--axis-color-error); }
.ax-button--danger:hover:not(.is-disabled) { background: var(--axis-color-error-hover); }
.ax-button--danger:active:not(.is-disabled) { background: var(--axis-color-error-active); }

/* plain 描边风格 */
.ax-button--primary.is-plain {
  background: var(--axis-color-primary-bg);
  border-color: var(--axis-color-primary-border);
  color: var(--axis-color-primary);
}
.ax-button--success.is-plain {
  background: var(--axis-color-success-bg);
  border-color: var(--axis-color-success-border);
  color: var(--axis-color-success);
}
.ax-button--warning.is-plain {
  background: var(--axis-color-warning-bg);
  border-color: var(--axis-color-warning-border);
  color: var(--axis-color-warning);
}
.ax-button--danger.is-plain {
  background: var(--axis-color-error-bg);
  border-color: var(--axis-color-error-border);
  color: var(--axis-color-error);
}

.ax-button--text {
  background: transparent;
  border-color: transparent;
  color: var(--axis-color-primary);
}
.ax-button--text:hover:not(.is-disabled) { background: var(--axis-color-fill-hover); }
.ax-button--text:active:not(.is-disabled) { background: var(--axis-color-fill-active); }

.ax-button.is-round { border-radius: var(--axis-radius-full); }
.ax-button.is-block { display: flex; width: 100%; }

.ax-button.is-disabled {
  cursor: not-allowed;
  color: var(--axis-color-text-disabled);
  background: var(--axis-color-fill-disabled);
  border-color: var(--axis-color-border-default);
}
.ax-button--text.is-disabled {
  background: transparent;
  border-color: transparent;
}

.ax-button__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: var(--axis-radius-full);
  animation: ax-button-spin 0.8s linear infinite;
}
@keyframes ax-button-spin {
  to { transform: rotate(360deg); }
}
</style>
