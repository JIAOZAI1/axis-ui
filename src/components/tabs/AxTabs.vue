<script setup lang="ts">
import { computed, provide, shallowReactive } from 'vue'
import { tabsKey, type TabsPane } from './context'

defineOptions({ name: 'AxTabs' })

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    /** 页签可关闭(可被单个 TabPane 的 closable 覆盖) */
    closable?: boolean
    /** 页签风格:line 下划线 / card 卡片(多页签工作区推荐) */
    type?: 'line' | 'card'
  }>(),
  { closable: false, type: 'line' }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  /** 点击页签关闭按钮:组件只通知,由业务移除对应 TabPane */
  (e: 'close', name: string | number): void
}>()

/* 必须是 shallowReactive:深层 reactive 的 Map 取值时会自动解包 pane 里的 label/closable ref,
   导致模板里 pane.label.value 读到 undefined(页签文字与关闭按钮全部失效) */
const panes = shallowReactive(new Map<string | number, TabsPane>())

provide(tabsKey, {
  active: computed(() => props.modelValue),
  registerPane(name, pane) {
    panes.set(name, pane)
  },
  unregisterPane(name) {
    /* 被移除的是当前激活页签时,自动切到相邻页签(先右后左) */
    if (name === props.modelValue) {
      const keys = [...panes.keys()]
      const index = keys.indexOf(name)
      const neighbor = keys[index + 1] ?? keys[index - 1]
      if (neighbor !== undefined) {
        emit('update:modelValue', neighbor)
        emit('change', neighbor)
      }
    }
    panes.delete(name)
  }
})

function select(name: string | number) {
  if (name === props.modelValue) return
  emit('update:modelValue', name)
  emit('change', name)
}

function isClosable(pane: TabsPane): boolean {
  return pane.closable.value ?? props.closable
}

function close(name: string | number) {
  emit('close', name)
}
</script>

<template>
  <div :class="['ax-tabs', `ax-tabs--${type}`]">
    <div class="ax-tabs__nav" role="tablist">
      <button
        v-for="[name, pane] in panes"
        :key="name"
        :class="['ax-tabs__tab', { 'is-active': name === modelValue }]"
        type="button"
        role="tab"
        :aria-selected="name === modelValue"
        @click="select(name)"
      >
        {{ pane.label.value }}
        <span
          v-if="isClosable(pane)"
          class="ax-tabs__close"
          role="button"
          aria-label="关闭页签"
          @click.stop="close(name)"
        >✕</span>
      </button>
    </div>
    <div class="ax-tabs__content">
      <slot />
    </div>
  </div>
</template>

<style>
.ax-tabs__nav {
  display: flex;
  gap: var(--axis-space-8);
  border-bottom: 1px solid var(--axis-color-border-split);
}

.ax-tabs__tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--axis-space-1);
  padding: var(--axis-space-3) 0;
  border: none;
  background: transparent;
  font-size: var(--axis-font-size-base);
  color: var(--axis-color-text-secondary);
  cursor: pointer;
  transition: color var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-tabs__tab:hover { color: var(--axis-color-primary-hover); }
.ax-tabs__tab.is-active {
  color: var(--axis-color-primary);
  font-weight: var(--axis-font-weight-medium);
}
.ax-tabs__tab::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--axis-color-primary);
  transform: scaleX(0);
  transition: transform var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-tabs__tab.is-active::after { transform: scaleX(1); }

.ax-tabs__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: -4px;
  border-radius: var(--axis-radius-sm);
  color: var(--axis-color-text-tertiary);
  font-size: 10px;
  line-height: 1;
  transition:
    color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    background-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-tabs__close:hover {
  color: var(--axis-color-text-primary);
  background: var(--axis-color-fill-default);
}

.ax-tabs__content {
  padding-top: var(--axis-space-4);
  color: var(--axis-color-text-primary);
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
}

/* ---- card 卡片风格:独立背景块 + 描边 + 上圆角,激活页签与内容区连成一体 ---- */
.ax-tabs--card .ax-tabs__nav {
  gap: var(--axis-space-1);
}
.ax-tabs--card .ax-tabs__tab {
  padding: var(--axis-space-2) var(--axis-space-4);
  background: var(--axis-color-fill-hover);
  border: 1px solid var(--axis-color-border-split);
  border-bottom: none;
  border-radius: var(--axis-radius-md) var(--axis-radius-md) 0 0;
  transition:
    color var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out),
    background-color var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-tabs--card .ax-tabs__tab:hover:not(.is-active) {
  background: var(--axis-color-fill-default);
}
.ax-tabs--card .ax-tabs__tab.is-active {
  background: var(--axis-color-bg-container);
}
/* 复用 ::after 作为「缝隙遮盖条」:盖住 nav 底线,让激活页签与内容区无缝相连 */
.ax-tabs--card .ax-tabs__tab::after {
  height: 1px;
  background: var(--axis-color-bg-container);
  transform: none;
  transition: none;
  opacity: 0;
}
.ax-tabs--card .ax-tabs__tab.is-active::after {
  opacity: 1;
}
</style>
