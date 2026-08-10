<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowReactive,
  type CSSProperties,
  useId,
  watch
} from 'vue'
import {
  dropdownKey,
  type DropdownFocusDirection,
  type DropdownItemRegistration,
  type DropdownPlacement,
  type DropdownTrigger,
  type DropdownValue
} from './context'

defineOptions({ name: 'AxDropdown' })

const props = withDefaults(
  defineProps<{
    /** v-model:open 受控展开状态 */
    open?: boolean
    /** 未使用 v-model:open 时的初始展开状态 */
    defaultOpen?: boolean
    trigger?: DropdownTrigger
    placement?: DropdownPlacement
    /** 选择菜单项后自动关闭 */
    closeOnSelect?: boolean
    /** 将弹层传送到 teleportTo,避免被滚动容器裁切 */
    teleported?: boolean
    teleportTo?: string | HTMLElement
    /** 图标触发器等无可见文字场景的无障碍名称 */
    ariaLabel?: string
    disabled?: boolean
  }>(),
  {
    /* 必须保留 undefined 才能区分非受控模式;Boolean Prop 缺省会被 Vue 转成 false */
    open: undefined,
    defaultOpen: false,
    trigger: 'click',
    placement: 'bottom-start',
    closeOnSelect: true,
    teleported: true,
    teleportTo: 'body',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
  (e: 'open-change', open: boolean): void
  (e: 'select', value: DropdownValue): void
}>()

const internalOpen = ref(props.defaultOpen)
const triggerRef = ref<HTMLButtonElement | null>(null)
const rootRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const positioned = ref(false)
const actualPlacement = ref<DropdownPlacement>(props.placement)
const popupPosition = ref({ top: 0, left: 0 })
const items = shallowReactive(new Map<symbol, DropdownItemRegistration>())
const popupId = `ax-dropdown-popup-${useId()}`
let hoverCloseTimer: ReturnType<typeof setTimeout> | undefined
let positionFrame: number | undefined

const isOpen = computed(() => props.open ?? internalOpen.value)
const popupStyle = computed<CSSProperties>(() => ({
  top: `${popupPosition.value.top}px`,
  left: `${popupPosition.value.left}px`,
  visibility: positioned.value ? 'visible' : 'hidden'
}))

function setOpen(open: boolean, returnFocus = false) {
  if (props.disabled && open) return
  if (open === isOpen.value) {
    if (!open && returnFocus) nextTick(() => triggerRef.value?.focus())
    return
  }
  if (props.open === undefined) internalOpen.value = open
  emit('update:open', open)
  emit('open-change', open)
  if (!open) {
    positioned.value = false
    if (returnFocus) nextTick(() => triggerRef.value?.focus())
  }
}

function close(returnFocus = false) {
  setOpen(false, returnFocus)
}

function enabledItems() {
  return [...items.entries()].filter(([, item]) => !item.disabled.value)
}

function focusItem(direction: DropdownFocusDirection, currentId?: symbol) {
  const available = enabledItems()
  if (!available.length) return
  const foundIndex = currentId === undefined
    ? -1
    : available.findIndex(([id]) => id === currentId)
  const currentIndex = Math.max(0, foundIndex)
  let nextIndex = currentIndex
  if (direction === 'first') nextIndex = 0
  if (direction === 'last') nextIndex = available.length - 1
  if (direction === 'next') {
    nextIndex = foundIndex < 0 ? 0 : (currentIndex + 1) % available.length
  }
  if (direction === 'previous') {
    nextIndex = foundIndex < 0
      ? available.length - 1
      : (currentIndex - 1 + available.length) % available.length
  }
  available[nextIndex]?.[1].elementRef.value?.focus()
}

function select(value: DropdownValue) {
  emit('select', value)
  if (props.closeOnSelect) close(true)
}

provide(dropdownKey, {
  registerItem(id, item) {
    items.set(id, item)
  },
  unregisterItem(id) {
    items.delete(id)
  },
  select,
  focusItem,
  close
})

function tokenPixels(element: Element, token: string): number {
  const raw = window.getComputedStyle(element).getPropertyValue(token)
  return Number.parseFloat(raw) || 0
}

function updatePosition() {
  const triggerElement = triggerRef.value
  const popupElement = popupRef.value
  if (!isOpen.value || !triggerElement || !popupElement) return

  const triggerRect = triggerElement.getBoundingClientRect()
  const popupRect = popupElement.getBoundingClientRect()
  const popupWidth = popupElement.offsetWidth || popupRect.width
  const popupHeight = popupElement.offsetHeight || popupRect.height
  const offset = tokenPixels(popupElement, '--ax-dropdown-offset')
  const viewportPadding = tokenPixels(popupElement, '--ax-dropdown-viewport-padding')
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  let [vertical, horizontal] = props.placement.split('-') as ['top' | 'bottom', 'start' | 'end']

  const spaceAbove = triggerRect.top - viewportPadding
  const spaceBelow = viewportHeight - triggerRect.bottom - viewportPadding
  const requiredHeight = popupHeight + offset
  if (vertical === 'bottom' && requiredHeight > spaceBelow && spaceAbove > spaceBelow) {
    vertical = 'top'
  } else if (vertical === 'top' && requiredHeight > spaceAbove && spaceBelow > spaceAbove) {
    vertical = 'bottom'
  }

  const startLeft = triggerRect.left
  const endLeft = triggerRect.right - popupWidth
  if (
    horizontal === 'start' &&
    startLeft + popupWidth > viewportWidth - viewportPadding &&
    endLeft >= viewportPadding
  ) {
    horizontal = 'end'
  } else if (
    horizontal === 'end' &&
    endLeft < viewportPadding &&
    startLeft + popupWidth <= viewportWidth - viewportPadding
  ) {
    horizontal = 'start'
  }

  const preferredLeft = horizontal === 'start' ? startLeft : endLeft
  const maxLeft = Math.max(viewportPadding, viewportWidth - popupWidth - viewportPadding)
  const left = Math.min(Math.max(preferredLeft, viewportPadding), maxLeft)
  const preferredTop = vertical === 'bottom'
    ? triggerRect.bottom + offset
    : triggerRect.top - popupHeight - offset
  const maxTop = Math.max(viewportPadding, viewportHeight - popupHeight - viewportPadding)
  const top = Math.min(Math.max(preferredTop, viewportPadding), maxTop)

  actualPlacement.value = `${vertical}-${horizontal}`
  popupPosition.value = { top, left }
  positioned.value = true
}

function queuePositionUpdate() {
  if (!isOpen.value) return
  if (positionFrame !== undefined) cancelAnimationFrame(positionFrame)
  positionFrame = requestAnimationFrame(() => {
    positionFrame = undefined
    updatePosition()
  })
}

async function openMenu(focus: 'first' | 'last' | false = false) {
  if (props.disabled) return
  setOpen(true)
  await nextTick()
  updatePosition()
  if (focus) focusItem(focus)
}

function onTriggerClick() {
  if (props.trigger !== 'click') return
  isOpen.value ? close(true) : openMenu(false)
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (
    event.key === 'Enter' ||
    event.key === ' ' ||
    event.key === 'Space' ||
    event.key === 'Spacebar' ||
    event.code === 'Space'
  ) {
    event.preventDefault()
    isOpen.value ? focusItem('first') : openMenu('first')
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    openMenu(event.key === 'ArrowDown' ? 'first' : 'last')
  } else if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    close(true)
  }
}

function clearHoverClose() {
  if (hoverCloseTimer !== undefined) clearTimeout(hoverCloseTimer)
  hoverCloseTimer = undefined
}

function hoverCloseDelay() {
  const raw = window.getComputedStyle(document.documentElement)
    .getPropertyValue('--axis-motion-duration-fast')
    .trim()
  if (raw.endsWith('ms')) return Number.parseFloat(raw) || 0
  if (raw.endsWith('s')) return (Number.parseFloat(raw) || 0) * 1000
  return 0
}

function scheduleHoverClose() {
  if (props.trigger !== 'hover') return
  clearHoverClose()
  hoverCloseTimer = setTimeout(() => close(false), hoverCloseDelay())
}

function onTriggerMouseEnter() {
  if (props.trigger !== 'hover') return
  clearHoverClose()
  openMenu(false)
}

function onTriggerFocus() {
  if (props.trigger === 'hover') openMenu(false)
}

function onTriggerBlur(event: FocusEvent) {
  if (props.trigger !== 'hover') return
  const nextTarget = event.relatedTarget as Node | null
  if (nextTarget && popupRef.value?.contains(nextTarget)) return
  scheduleHoverClose()
}

function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node
  if (!isOpen.value || rootRef.value?.contains(target) || popupRef.value?.contains(target)) return
  close(false)
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || event.defaultPrevented || !isOpen.value) return
  event.preventDefault()
  close(true)
}

watch(
  isOpen,
  async (open) => {
    if (!open) return
    positioned.value = false
    await nextTick()
    updatePosition()
  },
  { immediate: true }
)

watch(() => props.placement, () => queuePositionUpdate())

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
  document.addEventListener('keydown', onDocumentKeydown)
  window.addEventListener('resize', queuePositionUpdate)
  window.addEventListener('scroll', queuePositionUpdate, true)
})

onBeforeUnmount(() => {
  clearHoverClose()
  if (positionFrame !== undefined) cancelAnimationFrame(positionFrame)
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onDocumentKeydown)
  window.removeEventListener('resize', queuePositionUpdate)
  window.removeEventListener('scroll', queuePositionUpdate, true)
})
</script>

<template>
  <span
    ref="rootRef"
    :class="['ax-dropdown', { 'is-open': isOpen, 'is-disabled': disabled }]"
    @mouseenter="onTriggerMouseEnter"
    @mouseleave="scheduleHoverClose"
  >
    <button
      ref="triggerRef"
      class="ax-dropdown__trigger"
      type="button"
      :disabled="disabled"
      :aria-label="ariaLabel"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? popupId : undefined"
      @click="onTriggerClick"
      @focus="onTriggerFocus"
      @blur="onTriggerBlur"
      @keydown="onTriggerKeydown"
    >
      <slot name="trigger" :open="isOpen" />
    </button>

    <Teleport :to="teleportTo" :disabled="!teleported">
      <Transition name="ax-dropdown-popup">
        <div
          v-if="isOpen"
          :id="popupId"
          ref="popupRef"
          :class="['ax-dropdown__popup', `ax-dropdown__popup--${actualPlacement}`]"
          :style="popupStyle"
          @mouseenter="clearHoverClose"
          @mouseleave="scheduleHoverClose"
          @focusin="clearHoverClose"
          @focusout="scheduleHoverClose"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<style>
.ax-dropdown {
  display: inline-flex;
}

.ax-dropdown__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--axis-control-height-md);
  min-height: var(--axis-control-height-md);
  padding: var(--axis-space-1);
  border: none;
  border-radius: var(--axis-radius-md);
  outline: none;
  background: transparent;
  color: var(--axis-color-text-secondary);
  font: inherit;
  cursor: pointer;
  transition:
    background-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    box-shadow var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}

.ax-dropdown__trigger:hover,
.ax-dropdown.is-open .ax-dropdown__trigger {
  background: var(--axis-color-fill-hover);
  color: var(--axis-color-text-primary);
}

.ax-dropdown__trigger:focus-visible {
  box-shadow: 0 0 0 var(--axis-focus-ring-width) var(--axis-color-primary-border);
}

.ax-dropdown__trigger:disabled {
  color: var(--axis-color-text-disabled);
  cursor: not-allowed;
}

.ax-dropdown__popup {
  --ax-dropdown-offset: var(--axis-space-1);
  --ax-dropdown-viewport-padding: var(--axis-space-2);
  --ax-dropdown-enter-scale: 0.96;

  position: fixed;
  z-index: var(--axis-z-dropdown);
  width: max-content;
  max-width: calc(100vw - var(--axis-space-4));
  max-height: calc(100vh - var(--axis-space-4));
}

.ax-dropdown__popup--bottom-start,
.ax-dropdown__popup--bottom-end {
  transform-origin: top;
}

.ax-dropdown__popup--top-start,
.ax-dropdown__popup--top-end {
  transform-origin: bottom;
}

.ax-dropdown-popup-enter-active {
  transition:
    opacity var(--axis-motion-duration-mid) var(--axis-motion-ease-out),
    transform var(--axis-motion-duration-mid) var(--axis-motion-ease-out);
}

.ax-dropdown-popup-leave-active {
  transition:
    opacity var(--axis-motion-duration-fast) var(--axis-motion-ease-in),
    transform var(--axis-motion-duration-fast) var(--axis-motion-ease-in);
}

.ax-dropdown-popup-enter-from,
.ax-dropdown-popup-leave-to {
  opacity: 0;
  transform: scale(var(--ax-dropdown-enter-scale));
}
</style>
