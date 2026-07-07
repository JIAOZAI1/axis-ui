<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue'
import { menuDepthKey, menuKey, menuPopupKey, subMenuKey } from './context'

defineOptions({ name: 'AxMenuItem' })

const props = defineProps<{
  /** 唯一标识,与 AxMenu 的 v-model 对应 */
  name: string | number
  disabled?: boolean
}>()

const menu = inject(menuKey, null)
const subMenu = inject(subMenuKey, null)
const depth = inject(menuDepthKey, computed(() => 0))
const inPopup = inject(menuPopupKey, computed(() => false))

/* 向祖先 SubMenu 注册,支持「后代选中时高亮父级标题」 */
subMenu?.registerChild(props.name)
onBeforeUnmount(() => subMenu?.unregisterChild(props.name))

const isActive = computed(() => menu?.active.value === props.name)

/* 内联(非弹出、非折叠)时按深度缩进 */
const style = computed(() => {
  if (!menu || menu.mode.value !== 'vertical') return undefined
  if (inPopup.value || menu.collapsed.value) return undefined
  return { paddingLeft: `${16 + depth.value * 16}px` }
})

function onClick() {
  if (props.disabled) return
  menu?.select(props.name)
}
</script>

<template>
  <li
    :class="['ax-menu-item', { 'is-active': isActive, 'is-disabled': disabled }]"
    :style="style"
    role="menuitem"
    :aria-disabled="disabled || undefined"
    @click="onClick"
  >
    <span v-if="$slots.icon" class="ax-menu-item__icon"><slot name="icon" /></span>
    <span class="ax-menu-item__label"><slot /></span>
  </li>
</template>

<style>
.ax-menu-item {
  display: flex;
  align-items: center;
  gap: var(--axis-space-2);
  height: var(--ax-menu-item-height);
  padding: 0 var(--axis-space-4);
  border-radius: var(--axis-radius-md);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition:
    background-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-menu-item:hover:not(.is-disabled):not(.is-active) {
  background: var(--axis-color-fill-hover);
}
.ax-menu-item.is-active {
  background: var(--axis-color-primary-bg);
  color: var(--axis-color-primary);
  font-weight: var(--axis-font-weight-medium);
}
.ax-menu-item.is-disabled {
  color: var(--axis-color-text-disabled);
  cursor: not-allowed;
}

.ax-menu-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--axis-icon-size-md);
  flex-shrink: 0;
}
.ax-menu-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 水平模式顶层:下划线式选中,与 Tabs 语义一致 */
.ax-menu--horizontal > .ax-menu-item {
  position: relative;
  height: 46px;
  border-radius: 0;
  padding: 0 var(--axis-space-4);
}
.ax-menu--horizontal > .ax-menu-item.is-active {
  background: transparent;
}
.ax-menu--horizontal > .ax-menu-item.is-active::after {
  content: "";
  position: absolute;
  left: var(--axis-space-4);
  right: var(--axis-space-4);
  bottom: 0;
  height: 2px;
  background: var(--axis-color-primary);
}
</style>
