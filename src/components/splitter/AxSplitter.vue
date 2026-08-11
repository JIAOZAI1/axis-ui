<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  toRef,
  watch
} from 'vue'
import {
  splitterKey,
  type SplitterContext,
  type SplitterDirection,
  type SplitterPanelRegistration,
  type SplitterResizeEvent,
  type SplitterResizeTrigger,
  type SplitterSeparatorState
} from './context'

defineOptions({ name: 'AxSplitter' })

const props = withDefaults(
  defineProps<{
    /** horizontal 为左右分栏,vertical 为上下分栏 */
    direction?: SplitterDirection
    /** 首个面板像素尺寸的受控快捷模式 */
    size?: number
    /** 所有面板像素尺寸的受控模式,优先级高于 size */
    sizes?: number[]
    /** 方向键每次调整的像素尺寸 */
    keyboardStep?: number
    /** 分隔条的无障碍名称 */
    separatorLabel?: string
    disabled?: boolean
  }>(),
  {
    direction: 'horizontal',
    size: undefined,
    sizes: undefined,
    keyboardStep: 8,
    separatorLabel: '调整面板尺寸',
    disabled: false
  }
)

const emit = defineEmits<{
  'update:size': [value: number]
  'update:sizes': [value: number[]]
  'resize-start': [event: SplitterResizeEvent]
  resize: [event: SplitterResizeEvent]
  'resize-end': [event: SplitterResizeEvent]
}>()

const rootRef = ref<HTMLElement>()
const directionRef = toRef(props, 'direction')
const panels = ref<SplitterPanelRegistration[]>([])
const panelSizes = ref<number[]>([])
const activeSeparatorIndex = ref(-1)
const mounted = ref(false)
let initialized = false
let layoutQueued = false
let resizeObserver: ResizeObserver | undefined

interface DragState {
  pointerId: number
  index: number
  startCoordinate: number
  startSizes: number[]
  target: HTMLElement
}

let dragState: DragState | undefined

function finite(value: number | undefined, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

function limits(index: number) {
  const panel = panels.value[index]
  const min = Math.max(0, finite(panel?.getMinSize(), 0))
  const requestedMax = panel?.getMaxSize()
  const max = Math.max(min, finite(requestedMax, Number.POSITIVE_INFINITY))
  return { min, max }
}

function availableSize() {
  const root = rootRef.value
  if (!root) return 0
  const containerSize = props.direction === 'horizontal'
    ? root.clientWidth || root.getBoundingClientRect().width
    : root.clientHeight || root.getBoundingClientRect().height
  const separators = root.querySelectorAll<HTMLElement>('.ax-splitter__separator')
  let separatorSize = 0
  separators.forEach((separator) => {
    const rect = separator.getBoundingClientRect()
    separatorSize += props.direction === 'horizontal'
      ? separator.offsetWidth || rect.width
      : separator.offsetHeight || rect.height
  })
  return Math.max(0, containerSize - separatorSize)
}

function normalizeSizes(preferred: number[], available: number) {
  const count = panels.value.length
  if (!count || available <= 0) return []

  const panelLimits = panels.value.map((_, index) => limits(index))
  const minTotal = panelLimits.reduce((total, item) => total + item.min, 0)

  // 极窄容器下总最小尺寸可能无法同时满足。此时按比例压缩最小尺寸,
  // 优先保证 Splitter 自身不撑出页面滚动条。
  if (minTotal > available && minTotal > 0) {
    return panelLimits.map((item) => round((item.min / minTotal) * available))
  }

  const next = panelLimits.map((item, index) => {
    const requested = finite(preferred[index], item.min)
    return Math.min(item.max, Math.max(item.min, requested))
  })

  let difference = available - next.reduce((total, size) => total + size, 0)
  const grow = difference > 0

  // 末尾面板默认承担容器伸缩,从而让常见的“固定列表 + 自适应内容”保持稳定。
  for (let index = count - 1; index >= 0 && Math.abs(difference) > 0.01; index -= 1) {
    const item = panelLimits[index]
    const capacity = grow ? item.max - next[index] : next[index] - item.min
    if (capacity <= 0) continue
    const amount = Math.min(Math.abs(difference), capacity)
    next[index] += grow ? amount : -amount
    difference += grow ? -amount : amount
  }

  return next.map(round)
}

function initialPreferred(available: number) {
  const count = panels.value.length
  const source: Array<number | undefined> = props.sizes
    ? Array.from({ length: count }, (_, index) => props.sizes?.[index])
    : Array.from({ length: count }, (_, index) => (
        index === 0 && props.size !== undefined
          ? props.size
          : panels.value[index]?.getDefaultSize()
      ))

  const explicitTotal = source.reduce<number>(
    (total, size) => total + (typeof size === 'number' && Number.isFinite(size) ? Math.max(0, size) : 0),
    0
  )
  const unspecifiedCount = source.filter((size) => typeof size !== 'number' || !Number.isFinite(size)).length
  const fallback = unspecifiedCount > 0 ? Math.max(0, available - explicitTotal) / unspecifiedCount : 0
  return source.map((size) => finite(size, fallback))
}

function hasSizeChanged(previous: number[], next: number[]) {
  return previous.length !== next.length || next.some((size, index) => Math.abs(size - previous[index]) > 0.01)
}

function payload(index: number, trigger: SplitterResizeTrigger): SplitterResizeEvent {
  const sizes = [...panelSizes.value]
  return {
    index,
    size: sizes[index] ?? 0,
    sizes,
    direction: props.direction,
    trigger
  }
}

function emitModels(index: number, trigger: SplitterResizeTrigger) {
  const event = payload(index, trigger)
  emit('update:size', event.sizes[0] ?? 0)
  emit('update:sizes', event.sizes)
  emit('resize', event)
}

function applyLayout(options: { reset?: boolean; emitChange?: boolean } = {}) {
  const available = availableSize()
  if (!available || !panels.value.length) return
  const previous = [...panelSizes.value]
  const preferred = options.reset || !initialized || previous.length !== panels.value.length
    ? initialPreferred(available)
    : previous
  const next = normalizeSizes(preferred, available)
  panelSizes.value = next
  initialized = true
  if (options.emitChange && hasSizeChanged(previous, next) && previous.length) {
    emitModels(Math.max(0, next.length - 2), 'container')
  }
}

function queueLayout(options: { reset?: boolean; emitChange?: boolean } = {}) {
  if (!mounted.value || layoutQueued) return
  layoutQueued = true
  nextTick(() => {
    layoutQueued = false
    applyLayout(options)
  })
}

function registerPanel(panel: SplitterPanelRegistration) {
  if (panels.value.some((item) => item.id === panel.id)) return
  panels.value = [...panels.value, panel]
  initialized = false
  queueLayout({ reset: true })
}

function unregisterPanel(id: string) {
  const index = panels.value.findIndex((panel) => panel.id === id)
  if (index < 0) return
  panels.value = panels.value.filter((panel) => panel.id !== id)
  panelSizes.value = panelSizes.value.filter((_, panelIndex) => panelIndex !== index)
  initialized = false
  queueLayout({ reset: true })
}

function requestLayout() {
  queueLayout({ emitChange: true })
}

function panelIndex(id: string) {
  return panels.value.findIndex((panel) => panel.id === id)
}

function pairBounds(index: number, sizes = panelSizes.value) {
  const leading = limits(index)
  const trailing = limits(index + 1)
  const pairTotal = (sizes[index] ?? 0) + (sizes[index + 1] ?? 0)
  const min = Math.max(leading.min, pairTotal - trailing.max)
  const max = Math.min(leading.max, pairTotal - trailing.min)
  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
    pairTotal
  }
}

function setLeadingSize(index: number, requested: number, trigger: SplitterResizeTrigger, base = panelSizes.value) {
  if (index < 0 || index >= panels.value.length - 1) return false
  const bounds = pairBounds(index, base)
  const leading = Math.min(bounds.max, Math.max(bounds.min, requested))
  const next = [...base]
  next[index] = round(leading)
  next[index + 1] = round(bounds.pairTotal - leading)
  if (!hasSizeChanged(panelSizes.value, next)) return false
  panelSizes.value = next
  emitModels(index, trigger)
  return true
}

function getSeparatorState(id: string): SplitterSeparatorState {
  const index = panelIndex(id)
  const bounds = pairBounds(index)
  const now = panelSizes.value[index] ?? 0
  return {
    index,
    min: round(bounds.min),
    max: round(bounds.max),
    now: round(now),
    disabled: props.disabled || index < 0 || bounds.max - bounds.min <= 0.01,
    controls: `${id} ${panels.value[index + 1]?.id ?? ''}`.trim(),
    label: props.separatorLabel
  }
}

function coordinate(event: PointerEvent) {
  return props.direction === 'horizontal' ? event.clientX : event.clientY
}

function addDraggingClass() {
  const root = document.documentElement
  root.classList.add('ax-splitter-resizing', `ax-splitter-resizing--${props.direction}`)
}

function removeDraggingClass() {
  const root = document.documentElement
  root.classList.remove(
    'ax-splitter-resizing',
    'ax-splitter-resizing--horizontal',
    'ax-splitter-resizing--vertical'
  )
}

function onPointerMove(event: PointerEvent) {
  const current = dragState
  if (!current || event.pointerId !== current.pointerId) return
  event.preventDefault()
  setLeadingSize(
    current.index,
    current.startSizes[current.index] + coordinate(event) - current.startCoordinate,
    'pointer',
    current.startSizes
  )
}

function finishPointerResize(event?: PointerEvent) {
  const current = dragState
  if (!current || (event && event.pointerId !== current.pointerId)) return
  try {
    if (current.target.hasPointerCapture?.(current.pointerId)) {
      current.target.releasePointerCapture(current.pointerId)
    }
  } catch {
    // 节点已离开文档时浏览器可能拒绝释放 capture,清理仍需继续。
  }
  window.removeEventListener('pointermove', onPointerMove, true)
  window.removeEventListener('pointerup', finishPointerResize, true)
  window.removeEventListener('pointercancel', finishPointerResize, true)
  window.removeEventListener('blur', onWindowBlur)
  activeSeparatorIndex.value = -1
  dragState = undefined
  removeDraggingClass()
  emit('resize-end', payload(current.index, 'pointer'))
}

function onWindowBlur() {
  finishPointerResize()
}

function onSeparatorPointerDown(event: PointerEvent, id: string) {
  if (dragState) return
  if (event.pointerType === 'mouse' && event.button !== 0) return
  const state = getSeparatorState(id)
  if (state.disabled) return
  event.preventDefault()
  const target = event.currentTarget as HTMLElement
  target.focus()
  try {
    target.setPointerCapture?.(event.pointerId)
  } catch {
    // Window 级监听仍可保证拖动完成。
  }
  dragState = {
    pointerId: event.pointerId,
    index: state.index,
    startCoordinate: coordinate(event),
    startSizes: [...panelSizes.value],
    target
  }
  activeSeparatorIndex.value = state.index
  addDraggingClass()
  window.addEventListener('pointermove', onPointerMove, true)
  window.addEventListener('pointerup', finishPointerResize, true)
  window.addEventListener('pointercancel', finishPointerResize, true)
  window.addEventListener('blur', onWindowBlur)
  emit('resize-start', payload(state.index, 'pointer'))
}

function onSeparatorKeydown(event: KeyboardEvent, id: string) {
  const state = getSeparatorState(id)
  if (state.disabled) return
  const step = Math.max(1, finite(props.keyboardStep, 8)) * (event.shiftKey ? 10 : 1)
  let requested: number | undefined
  if (props.direction === 'horizontal') {
    if (event.key === 'ArrowLeft') requested = state.now - step
    if (event.key === 'ArrowRight') requested = state.now + step
  } else {
    if (event.key === 'ArrowUp') requested = state.now - step
    if (event.key === 'ArrowDown') requested = state.now + step
  }
  if (event.key === 'Home') requested = state.min
  if (event.key === 'End') requested = state.max
  if (requested === undefined) return
  event.preventDefault()
  emit('resize-start', payload(state.index, 'keyboard'))
  setLeadingSize(state.index, requested, 'keyboard')
  emit('resize-end', payload(state.index, 'keyboard'))
}

const context: SplitterContext = {
  direction: directionRef,
  registerPanel,
  unregisterPanel,
  requestLayout,
  isLastPanel: (id) => panelIndex(id) === panels.value.length - 1,
  isActiveSeparator: (id) => panelIndex(id) === activeSeparatorIndex.value,
  getPanelStyle: (id) => {
    const index = panelIndex(id)
    const size = panelSizes.value[index]
    return size === undefined
      ? { flex: '1 1 0', minWidth: 0, minHeight: 0 }
      : { flex: `0 0 ${size}px`, minWidth: 0, minHeight: 0 }
  },
  getSeparatorState,
  onSeparatorPointerDown,
  onSeparatorKeydown
}

provide(splitterKey, context)

const rootClasses = computed(() => [
  'ax-splitter',
  `ax-splitter--${props.direction}`,
  { 'is-resizing': activeSeparatorIndex.value >= 0, 'is-disabled': props.disabled }
])

watch(() => [props.size, props.sizes] as const, () => {
  if (!mounted.value) return
  applyLayout({ reset: true })
}, { deep: true })

watch(() => props.direction, () => {
  initialized = false
  queueLayout({ reset: true })
})

onMounted(() => {
  mounted.value = true
  nextTick(() => applyLayout({ reset: true }))
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    resizeObserver = new ResizeObserver(() => queueLayout({ emitChange: true }))
    resizeObserver.observe(rootRef.value)
  } else {
    window.addEventListener('resize', requestLayout)
  }
})

onBeforeUnmount(() => {
  finishPointerResize()
  resizeObserver?.disconnect()
  window.removeEventListener('resize', requestLayout)
  removeDraggingClass()
})
</script>

<template>
  <div ref="rootRef" :class="rootClasses">
    <slot />
  </div>
</template>

<style>
.ax-splitter {
  --ax-splitter-handle-size: var(--axis-space-2);
  --ax-splitter-line-size: var(--axis-border-width);
  --ax-splitter-line-color: var(--axis-color-border-default);
  --ax-splitter-line-color-hover: var(--axis-color-primary-border);
  --ax-splitter-line-color-active: var(--axis-color-primary);

  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.ax-splitter--horizontal { flex-direction: row; }
.ax-splitter--vertical { flex-direction: column; }

.ax-splitter-panel {
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

.ax-splitter__separator {
  position: relative;
  z-index: auto;
  display: block;
  flex: 0 0 var(--ax-splitter-handle-size);
  padding: 0;
  border: 0;
  outline: none;
  touch-action: none;
}

.ax-splitter__separator::before {
  position: absolute;
  content: '';
  background: var(--ax-splitter-line-color);
  transition: background-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}

.ax-splitter--horizontal > .ax-splitter__separator {
  width: var(--ax-splitter-handle-size);
  cursor: col-resize;
}

.ax-splitter--horizontal > .ax-splitter__separator::before {
  top: 0;
  bottom: 0;
  left: 50%;
  width: var(--ax-splitter-line-size);
  transform: translateX(-50%);
}

.ax-splitter--vertical > .ax-splitter__separator {
  height: var(--ax-splitter-handle-size);
  cursor: row-resize;
}

.ax-splitter--vertical > .ax-splitter__separator::before {
  right: 0;
  bottom: 50%;
  left: 0;
  height: var(--ax-splitter-line-size);
  transform: translateY(50%);
}

.ax-splitter__separator:hover::before,
.ax-splitter__separator:focus-visible::before {
  background: var(--ax-splitter-line-color-hover);
}

.ax-splitter__separator:focus-visible {
  background: var(--axis-color-primary-bg);
  box-shadow: inset 0 0 0 var(--axis-focus-ring-width) var(--axis-color-primary-border);
}

.ax-splitter__separator.is-active {
  background: var(--axis-color-primary-bg);
}

.ax-splitter__separator.is-active::before {
  background: var(--ax-splitter-line-color-active);
}

.ax-splitter.is-disabled > .ax-splitter__separator,
.ax-splitter__separator[aria-disabled="true"] {
  cursor: not-allowed;
}

html.ax-splitter-resizing,
html.ax-splitter-resizing * {
  user-select: none !important;
}

html.ax-splitter-resizing--horizontal,
html.ax-splitter-resizing--horizontal * {
  cursor: col-resize !important;
}

html.ax-splitter-resizing--vertical,
html.ax-splitter-resizing--vertical * {
  cursor: row-resize !important;
}
</style>
