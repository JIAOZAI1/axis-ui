<script setup lang="ts">
import { computed, inject } from 'vue'
import { layoutKey } from './context'

defineOptions({ name: 'AxLayoutSider' })

const props = withDefaults(
  defineProps<{
    /**
     * 侧栏宽度:'nav' 为全局导航侧栏(layout-sider-width,224px);
     * 'sm'/'md'/'lg' 为功能性面板宽度(panel-width-*,240/300/360px);
     * 也接受任意 CSS 值。
     */
    width?: 'nav' | 'sm' | 'md' | 'lg' | (string & {})
    /** 折叠为图标栏宽度(仅 width="nav" 时有意义,对应 layout-sider-collapsed-width) */
    collapsed?: boolean
    /** 内容区左右内边距,默认 0(菜单类内容自带内边距) */
    bodyPadding?: string
    /** 描边位置:侧栏在内容左侧时右描边,在右侧时改用 left */
    borderPosition?: 'left' | 'right' | 'none'
  }>(),
  { width: 'nav', borderPosition: 'right' }
)

/* 仅作校验/未来扩展占位,当前无需读取具体值 */
inject(layoutKey, null)

const widthValue = computed(() => {
  if (props.width === 'nav') {
    return props.collapsed
      ? 'var(--axis-layout-sider-collapsed-width)'
      : 'var(--axis-layout-sider-width)'
  }
  if (props.width === 'sm' || props.width === 'md' || props.width === 'lg') {
    return `var(--axis-panel-width-${props.width})`
  }
  return props.width
})
</script>

<template>
  <aside
    :class="['ax-layout-sider', `ax-layout-sider--border-${borderPosition}`, { 'is-collapsed': collapsed }]"
    :style="{ width: widthValue, flexBasis: widthValue, padding: bodyPadding }"
  >
    <slot />
  </aside>
</template>

<style>
.ax-layout-sider {
  flex-shrink: 0;
  overflow: auto;
  background: var(--axis-color-bg-container);
  transition: width var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-layout-sider--border-right { border-right: 1px solid var(--axis-color-border-split); }
.ax-layout-sider--border-left { border-left: 1px solid var(--axis-color-border-split); }
</style>
