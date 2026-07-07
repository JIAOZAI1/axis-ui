<script setup lang="ts">
import { computed, inject, provide, reactive, ref } from 'vue'
import { menuDepthKey, menuKey, menuPopupKey, subMenuKey } from './context'

defineOptions({ name: 'AxSubMenu' })

const props = defineProps<{
  /** 唯一标识(用于展开状态记录) */
  name: string | number
  /** 子菜单标题 */
  title: string
  disabled?: boolean
}>()

const menu = inject(menuKey, null)
const parentSub = inject(subMenuKey, null)
const depth = inject(menuDepthKey, computed(() => 0))
const inPopup = inject(menuPopupKey, computed(() => false))

/* 收集后代 item,后代选中时高亮本级标题;并向上层 SubMenu 透传 */
const childNames = reactive(new Set<string | number>())
provide(subMenuKey, {
  registerChild(name) {
    childNames.add(name)
    parentSub?.registerChild(name)
  },
  unregisterChild(name) {
    childNames.delete(name)
    parentSub?.unregisterChild(name)
  }
})

const hasActiveChild = computed(
  () => menu?.active.value !== undefined && childNames.has(menu.active.value)
)

/* 弹出模式:水平菜单一律弹出;垂直折叠时顶层弹出 */
const isPopup = computed(() => {
  if (!menu) return false
  if (menu.mode.value === 'horizontal') return true
  return menu.collapsed.value && depth.value === 0 && !inPopup.value
})

/* 弹出方向:水平顶层向下,其余(嵌套/折叠)向右 */
const popupPlacement = computed(() =>
  menu?.mode.value === 'horizontal' && depth.value === 0 && !inPopup.value
    ? 'bottom'
    : 'right'
)

const hoverOpen = ref(false)
const opened = computed(() =>
  isPopup.value ? hoverOpen.value : (menu?.isOpen(props.name) ?? false)
)

/* 子级上下文:弹出面板内缩进重置、标记处于 popup 子树 */
provide(menuDepthKey, computed(() => (isPopup.value ? 0 : depth.value + 1)))
provide(menuPopupKey, computed(() => isPopup.value || inPopup.value))

const titleStyle = computed(() => {
  if (!menu || menu.mode.value !== 'vertical') return undefined
  if (inPopup.value || menu.collapsed.value) return undefined
  return { paddingLeft: `${16 + depth.value * 16}px` }
})

function onTitleClick() {
  if (props.disabled || isPopup.value) return
  menu?.toggleOpen(props.name)
}
function onEnter() {
  if (isPopup.value && !props.disabled) hoverOpen.value = true
}
function onLeave() {
  hoverOpen.value = false
}
</script>

<template>
  <li
    :class="['ax-sub-menu', {
      'is-open': opened,
      'is-active': hasActiveChild,
      'is-disabled': disabled,
      'is-popup-mode': isPopup
    }]"
    role="none"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div
      class="ax-sub-menu__title"
      :style="titleStyle"
      role="menuitem"
      :aria-haspopup="true"
      :aria-expanded="opened"
      @click="onTitleClick"
    >
      <span v-if="$slots.icon" class="ax-menu-item__icon"><slot name="icon" /></span>
      <span class="ax-menu-item__label">{{ title }}</span>
      <span class="ax-sub-menu__arrow" aria-hidden="true">
        <svg viewBox="0 0 12 12" width="10" height="10">
          <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </div>

    <transition name="ax-sub-menu-fade">
      <!-- v-show 保持子项常驻挂载,保证注册/高亮在收起时依然生效 -->
      <ul
        v-show="opened"
        :class="['ax-sub-menu__list', isPopup ? `is-popup is-popup--${popupPlacement}` : 'is-inline']"
        role="menu"
      >
        <slot />
      </ul>
    </transition>
  </li>
</template>

<style>
.ax-sub-menu {
  position: relative;
}

.ax-sub-menu__title {
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
.ax-sub-menu__title:hover {
  background: var(--axis-color-fill-hover);
}
.ax-sub-menu.is-active > .ax-sub-menu__title {
  color: var(--axis-color-primary);
}
.ax-sub-menu.is-disabled > .ax-sub-menu__title {
  color: var(--axis-color-text-disabled);
  cursor: not-allowed;
}

.ax-sub-menu__arrow {
  display: inline-flex;
  margin-left: auto;
  color: var(--axis-color-text-tertiary);
  transition: transform var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-sub-menu.is-open > .ax-sub-menu__title > .ax-sub-menu__arrow {
  transform: rotate(180deg);
}
/* 向右弹出的箭头朝右 */
.ax-sub-menu.is-popup-mode > .ax-sub-menu__title > .ax-sub-menu__arrow {
  transform: rotate(-90deg);
}

/* ---- 内联展开列表 ---- */
.ax-sub-menu__list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.ax-sub-menu__list.is-inline {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 2px;
}

/* ---- 弹出面板:bg-elevated + shadow-md + z-dropdown ---- */
.ax-sub-menu__list.is-popup {
  position: absolute;
  z-index: var(--axis-z-dropdown);
  min-width: var(--ax-menu-popup-min-width);
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--axis-space-1);
  background: var(--axis-color-bg-elevated);
  border-radius: var(--axis-radius-lg);
  box-shadow: var(--axis-shadow-md);
}
.ax-sub-menu__list.is-popup--bottom {
  top: 100%;
  left: 0;
}
.ax-sub-menu__list.is-popup--right {
  left: 100%;
  top: 0;
  margin-left: 2px;
}

/* 水平模式顶层标题:与顶栏等高 */
.ax-menu--horizontal > .ax-sub-menu > .ax-sub-menu__title {
  height: 46px;
  border-radius: 0;
}

.ax-sub-menu-fade-enter-active {
  transition: all var(--axis-motion-duration-mid) var(--axis-motion-ease-out);
}
.ax-sub-menu-fade-leave-active {
  transition: all var(--axis-motion-duration-fast) var(--axis-motion-ease-in);
}
.ax-sub-menu-fade-enter-from,
.ax-sub-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
