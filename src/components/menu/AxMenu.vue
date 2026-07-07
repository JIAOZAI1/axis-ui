<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { menuKey } from './context'

defineOptions({ name: 'AxMenu' })

const props = withDefaults(
  defineProps<{
    /** 当前选中项的 name,v-model */
    modelValue?: string | number
    /** 垂直(侧边栏) / 水平(顶栏) */
    mode?: 'vertical' | 'horizontal'
    /** 折叠为图标栏(仅 vertical),宽度建议用 --axis-layout-sider-collapsed-width */
    collapsed?: boolean
    /** 初始展开的子菜单 name 列表(仅 vertical 内联) */
    defaultOpenKeys?: (string | number)[]
  }>(),
  { mode: 'vertical', collapsed: false, defaultOpenKeys: () => [] }
)

const emit = defineEmits<{
  (e: 'update:modelValue', name: string | number): void
  (e: 'select', name: string | number): void
}>()

const openKeys = ref(new Set<string | number>(props.defaultOpenKeys))

/* 折叠时收起全部内联子菜单,展开改走悬浮弹出 */
watch(
  () => props.collapsed,
  (collapsed) => {
    if (collapsed) openKeys.value = new Set()
  }
)

provide(menuKey, {
  active: computed(() => props.modelValue),
  mode: computed(() => props.mode),
  collapsed: computed(() => props.collapsed),
  select(name) {
    emit('update:modelValue', name)
    emit('select', name)
  },
  isOpen: (name) => openKeys.value.has(name),
  toggleOpen(name) {
    const next = new Set(openKeys.value)
    next.has(name) ? next.delete(name) : next.add(name)
    openKeys.value = next
  }
})
</script>

<template>
  <ul
    :class="['ax-menu', `ax-menu--${mode}`, { 'is-collapsed': mode === 'vertical' && collapsed }]"
    role="menubar"
  >
    <slot />
  </ul>
</template>

<style>
.ax-menu {
  /* L3 组件 Token */
  --ax-menu-item-height: 40px;
  --ax-menu-popup-min-width: 160px;

  margin: 0;
  padding: var(--axis-space-2);
  list-style: none;
  background: var(--axis-color-bg-container);
  color: var(--axis-color-text-primary);
  font-size: var(--axis-font-size-base);
}

.ax-menu--vertical {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
}

.ax-menu--horizontal {
  display: flex;
  align-items: center;
  gap: var(--axis-space-1);
  padding: 0 var(--axis-space-2);
  border-bottom: 1px solid var(--axis-color-border-split);
}

/* 折叠态:仅显示图标,标签与箭头隐藏 */
.ax-menu--vertical.is-collapsed > .ax-menu-item > .ax-menu-item__label,
.ax-menu--vertical.is-collapsed > .ax-sub-menu > .ax-sub-menu__title > .ax-menu-item__label,
.ax-menu--vertical.is-collapsed > .ax-sub-menu > .ax-sub-menu__title > .ax-sub-menu__arrow {
  display: none;
}
.ax-menu--vertical.is-collapsed > .ax-menu-item,
.ax-menu--vertical.is-collapsed > .ax-sub-menu > .ax-sub-menu__title {
  justify-content: center;
  padding-left: 0 !important;
  padding-right: 0;
}
</style>
