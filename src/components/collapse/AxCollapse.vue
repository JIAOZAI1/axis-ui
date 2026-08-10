<script setup lang="ts">
import { computed, provide, ref, shallowReactive } from 'vue'
import {
  collapseKey,
  type CollapseExpose,
  type CollapseFocusDirection,
  type CollapseItemRegistration,
  type CollapseModelValue,
  type CollapseName,
  type CollapseType
} from './context'

defineOptions({ name: 'AxCollapse' })

const props = withDefaults(
  defineProps<{
    /** 受控展开项;空数组表示全部收起 */
    modelValue?: CollapseModelValue
    /** 未使用 v-model 时的初始展开项 */
    defaultActiveNames?: CollapseModelValue
    /** 同一时间只允许展开一个面板 */
    accordion?: boolean
    /** bordered 有外框 / borderless 仅保留分隔线 / simple 极简 */
    type?: CollapseType
  }>(),
  {
    defaultActiveNames: () => [],
    accordion: false,
    type: 'bordered'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: CollapseModelValue): void
  (e: 'change', value: CollapseModelValue): void
}>()

const internalActiveNames = ref<CollapseModelValue>([...props.defaultActiveNames])
const items = shallowReactive(new Map<CollapseName, CollapseItemRegistration>())

function normalize(names: CollapseModelValue): CollapseModelValue {
  const unique = [...new Set(names)]
  return props.accordion ? unique.slice(0, 1) : unique
}

const activeNames = computed<CollapseModelValue>(() =>
  normalize(props.modelValue ?? internalActiveNames.value)
)

function setActiveNames(names: CollapseModelValue) {
  const next = normalize(names)
  if (props.modelValue === undefined) internalActiveNames.value = next
  emit('update:modelValue', next)
  emit('change', next)
}

function toggle(name: CollapseName) {
  if (props.accordion) {
    setActiveNames(activeNames.value.includes(name) ? [] : [name])
    return
  }

  setActiveNames(
    activeNames.value.includes(name)
      ? activeNames.value.filter((itemName) => itemName !== name)
      : [...activeNames.value, name]
  )
}

function focusHeader(name: CollapseName, direction: CollapseFocusDirection) {
  const enabledItems = [...items.entries()].filter(([, item]) => !item.disabled.value)
  if (!enabledItems.length) return

  const currentIndex = Math.max(0, enabledItems.findIndex(([itemName]) => itemName === name))
  let nextIndex = currentIndex
  if (direction === 'first') nextIndex = 0
  if (direction === 'last') nextIndex = enabledItems.length - 1
  if (direction === 'next') nextIndex = (currentIndex + 1) % enabledItems.length
  if (direction === 'previous') {
    nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length
  }
  enabledItems[nextIndex]?.[1].headerRef.value?.focus()
}

function expandAll() {
  const names = [...items.keys()]
  setActiveNames(props.accordion ? names.slice(0, 1) : names)
}

function collapseAll() {
  setActiveNames([])
}

provide(collapseKey, {
  activeNames,
  toggle,
  registerItem(name, item) {
    items.set(name, item)
  },
  unregisterItem(name) {
    items.delete(name)
  },
  focusHeader
})

defineExpose<CollapseExpose>({ expandAll, collapseAll })
</script>

<template>
  <div :class="['ax-collapse', `ax-collapse--${type}`]">
    <slot />
  </div>
</template>

<style>
.ax-collapse {
  --ax-collapse-border-width: var(--axis-border-width);
  --ax-collapse-focus-ring-width: var(--axis-focus-ring-width);
  --ax-collapse-arrow-expanded-rotation: 90deg;
  --ax-collapse-header-min-height: var(--axis-control-height-lg);
  --ax-collapse-header-padding-block: var(--axis-space-3);
  --ax-collapse-header-padding-inline: var(--axis-space-4);
  --ax-collapse-content-padding-block: var(--axis-space-4);
  --ax-collapse-content-padding-inline: var(--axis-space-4);
  --ax-collapse-header-font-size: var(--axis-font-size-base);
  --ax-collapse-content-font-size: var(--axis-font-size-base);

  overflow: hidden;
  width: 100%;
  border: var(--ax-collapse-border-width) solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-md);
  background: var(--axis-color-bg-container);
  color: var(--axis-color-text-primary);
}

.ax-collapse--borderless,
.ax-collapse--simple {
  border: none;
  border-radius: 0;
}

.ax-collapse--simple {
  background: transparent;
}
</style>
