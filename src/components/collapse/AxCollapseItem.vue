<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, toRef, useId, watch } from 'vue'
import AxIcon from '../icon/AxIcon.vue'
import {
  collapseKey,
  type CollapseFocusDirection,
  type CollapseName
} from './context'

defineOptions({ name: 'AxCollapseItem' })

const props = withDefaults(
  defineProps<{
    /** 唯一标识,与 AxCollapse 的 v-model 对应 */
    name: CollapseName
    /** 标题;也可由 title 插槽提供 */
    title?: string
    /** 禁止用户展开、收起或聚焦此项 */
    disabled?: boolean
  }>(),
  { title: '', disabled: false }
)

const emit = defineEmits<{
  (e: 'change', expanded: boolean): void
}>()

const collapse = inject(collapseKey, null)
const headerRef = ref<HTMLButtonElement | null>(null)
const disabledRef = toRef(props, 'disabled')
const uid = useId()
const headerId = `ax-collapse-header-${uid}`
const contentId = `ax-collapse-content-${uid}`

const expanded = computed(() => collapse?.activeNames.value.includes(props.name) ?? false)

function register(name: CollapseName) {
  collapse?.registerItem(name, { headerRef, disabled: disabledRef })
}

register(props.name)
watch(
  () => props.name,
  (name, previousName) => {
    collapse?.unregisterItem(previousName)
    register(name)
  }
)
onBeforeUnmount(() => collapse?.unregisterItem(props.name))

function toggle() {
  if (props.disabled || !collapse) return
  const nextExpanded = !expanded.value
  collapse.toggle(props.name)
  emit('change', nextExpanded)
}

function onKeydown(event: KeyboardEvent) {
  const directions: Partial<Record<string, CollapseFocusDirection>> = {
    ArrowDown: 'next',
    ArrowUp: 'previous',
    Home: 'first',
    End: 'last'
  }
  const direction = directions[event.key]
  if (!direction) return
  event.preventDefault()
  collapse?.focusHeader(props.name, direction)
}
</script>

<template>
  <section :class="['ax-collapse-item', { 'is-active': expanded, 'is-disabled': disabled }]">
    <div class="ax-collapse-item__header">
      <button
        :id="headerId"
        ref="headerRef"
        class="ax-collapse-item__trigger"
        type="button"
        :disabled="disabled"
        :aria-disabled="disabled"
        :aria-expanded="expanded"
        :aria-controls="contentId"
        @click="toggle"
        @keydown="onKeydown"
      >
        <AxIcon name="chevron-right" size="sm" class="ax-collapse-item__arrow" />
        <span class="ax-collapse-item__title">
          <slot name="title" :expanded="expanded">{{ title }}</slot>
        </span>
      </button>
      <span v-if="$slots.extra" class="ax-collapse-item__extra">
        <slot name="extra" :expanded="expanded" />
      </span>
    </div>

    <Transition name="ax-collapse-content">
      <div
        v-show="expanded"
        :id="contentId"
        class="ax-collapse-item__panel"
        role="region"
        :aria-labelledby="headerId"
        :aria-hidden="!expanded"
      >
        <div class="ax-collapse-item__clip">
          <div class="ax-collapse-item__content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style>
.ax-collapse-item {
  border-bottom: var(--ax-collapse-border-width) solid var(--axis-color-border-split);
}

.ax-collapse-item:last-child {
  border-bottom: none;
}

.ax-collapse-item__header {
  display: flex;
  align-items: center;
  min-height: var(--ax-collapse-header-min-height);
  background: var(--axis-color-bg-container);
  transition: background-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}

.ax-collapse-item__header:hover {
  background: var(--axis-color-fill-hover);
}

.ax-collapse-item__trigger {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--axis-space-2);
  min-width: 0;
  min-height: var(--ax-collapse-header-min-height);
  padding: var(--ax-collapse-header-padding-block) var(--ax-collapse-header-padding-inline);
  border: none;
  outline: none;
  background: transparent;
  color: var(--axis-color-text-primary);
  font: inherit;
  font-size: var(--ax-collapse-header-font-size);
  line-height: var(--axis-line-height-base);
  font-weight: var(--axis-font-weight-medium);
  text-align: left;
  cursor: pointer;
}

.ax-collapse-item__trigger:focus-visible {
  box-shadow: inset 0 0 0 var(--ax-collapse-focus-ring-width) var(--axis-color-primary-border);
}

.ax-collapse-item__arrow {
  transition: transform var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}

.ax-collapse-item.is-active .ax-collapse-item__arrow {
  transform: rotate(var(--ax-collapse-arrow-expanded-rotation));
}

.ax-collapse-item__title {
  min-width: 0;
}

.ax-collapse-item__extra {
  flex-shrink: 0;
  padding: var(--ax-collapse-header-padding-block) var(--ax-collapse-header-padding-inline);
  padding-left: 0;
  color: var(--axis-color-text-secondary);
  font-size: var(--axis-font-size-sm);
  line-height: var(--axis-line-height-sm);
}

.ax-collapse-item__panel {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  background: var(--axis-color-bg-container);
}

.ax-collapse-item__clip {
  min-height: 0;
  overflow: hidden;
}

.ax-collapse-item__content {
  padding: var(--ax-collapse-content-padding-block) var(--ax-collapse-content-padding-inline);
  border-top: var(--ax-collapse-border-width) solid var(--axis-color-border-split);
  color: var(--axis-color-text-secondary);
  font-size: var(--ax-collapse-content-font-size);
  line-height: var(--axis-line-height-base);
}

.ax-collapse-item.is-disabled .ax-collapse-item__header {
  background: var(--axis-color-fill-disabled);
}

.ax-collapse-item.is-disabled .ax-collapse-item__trigger {
  color: var(--axis-color-text-disabled);
  cursor: not-allowed;
}

.ax-collapse--borderless .ax-collapse-item__content,
.ax-collapse--simple .ax-collapse-item__content {
  border-top: none;
}

.ax-collapse--simple .ax-collapse-item {
  border-bottom: none;
}

.ax-collapse--simple .ax-collapse-item__header,
.ax-collapse--simple .ax-collapse-item__panel {
  background: transparent;
}

.ax-collapse--simple .ax-collapse-item__trigger {
  padding-left: 0;
  padding-right: 0;
}

.ax-collapse--simple .ax-collapse-item__extra {
  padding-right: 0;
}

.ax-collapse--simple .ax-collapse-item__content {
  padding-top: var(--axis-space-2);
  padding-right: 0;
  padding-bottom: var(--axis-space-3);
  padding-left: calc(var(--axis-icon-size-sm) + var(--axis-space-2));
}

.ax-collapse-content-enter-active,
.ax-collapse-content-leave-active {
  overflow: hidden;
  transition:
    grid-template-rows var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out),
    opacity var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}

.ax-collapse-content-enter-from,
.ax-collapse-content-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}
</style>
