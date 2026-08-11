<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useId, watch } from 'vue'
import { splitterKey } from './context'

defineOptions({ name: 'AxSplitterPanel' })

const props = withDefaults(
  defineProps<{
    /** 初始像素尺寸;未设置的面板平分剩余空间 */
    defaultSize?: number
    minSize?: number
    maxSize?: number
  }>(),
  {
    defaultSize: undefined,
    minSize: 0,
    maxSize: undefined
  }
)

const context = inject(splitterKey)
if (!context) {
  throw new Error('[Axis UI] AxSplitterPanel 必须作为 AxSplitter 的直接子组件使用')
}

const panelId = `ax-splitter-panel-${useId()}`

context.registerPanel({
  id: panelId,
  getDefaultSize: () => props.defaultSize,
  getMinSize: () => props.minSize,
  getMaxSize: () => props.maxSize
})

const isLast = computed(() => context.isLastPanel(panelId))
const isActive = computed(() => context.isActiveSeparator(panelId))
const panelStyle = computed(() => context.getPanelStyle(panelId))
const separator = computed(() => context.getSeparatorState(panelId))
const ariaOrientation = computed(() => (
  context.direction.value === 'horizontal' ? 'vertical' : 'horizontal'
))

watch(
  () => [props.defaultSize, props.minSize, props.maxSize],
  () => context.requestLayout()
)

onBeforeUnmount(() => context.unregisterPanel(panelId))
</script>

<template>
  <div :id="panelId" class="ax-splitter-panel" :style="panelStyle">
    <slot />
  </div>
  <div
    v-if="!isLast"
    :class="['ax-splitter__separator', { 'is-active': isActive }]"
    role="separator"
    tabindex="0"
    :aria-label="separator.label"
    :aria-orientation="ariaOrientation"
    :aria-valuemin="separator.min"
    :aria-valuemax="separator.max"
    :aria-valuenow="separator.now"
    :aria-valuetext="`${separator.now}px`"
    :aria-controls="separator.controls"
    :aria-disabled="separator.disabled"
    @pointerdown="context.onSeparatorPointerDown($event, panelId)"
    @keydown="context.onSeparatorKeydown($event, panelId)"
  />
</template>
