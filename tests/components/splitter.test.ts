import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AxSplitter from '../../src/components/splitter/AxSplitter.vue'
import AxSplitterPanel from '../../src/components/splitter/AxSplitterPanel.vue'

let containerWidth = 600
let containerHeight = 400
let resizeCallbacks: ResizeObserverCallback[] = []

class ResizeObserverMock {
  private readonly callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    resizeCallbacks.push(callback)
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}

function panels(options: {
  first?: Record<string, unknown>
  second?: Record<string, unknown>
} = {}) {
  return [
    h(AxSplitterPanel, { defaultSize: 240, minSize: 160, maxSize: 400, ...options.first }, () => '项目列表'),
    h(AxSplitterPanel, { minSize: 200, ...options.second }, () => '讨论区')
  ]
}

async function mountSplitter(
  props: Record<string, unknown> = {},
  panelOptions: Parameters<typeof panels>[0] = {}
) {
  const wrapper = mount(AxSplitter, {
    attachTo: document.body,
    props,
    slots: { default: () => panels(panelOptions) }
  })
  await nextTick()
  await nextTick()
  return wrapper
}

function panelSizes(wrapper: Awaited<ReturnType<typeof mountSplitter>>) {
  return wrapper.findAll<HTMLElement>('.ax-splitter-panel').map((panel) => (
    Number.parseFloat(panel.element.style.flexBasis)
  ))
}

function notifyResize() {
  resizeCallbacks.forEach((callback) => callback([], {} as ResizeObserver))
}

beforeEach(() => {
  containerWidth = 600
  containerHeight = 400
  resizeCallbacks = []
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function () {
    return this.classList.contains('ax-splitter') ? containerWidth : 0
  })
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function () {
    return this.classList.contains('ax-splitter') ? containerHeight : 0
  })
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
    return this.classList.contains('ax-splitter__separator') ? 8 : 0
  })
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
    return this.classList.contains('ax-splitter__separator') ? 8 : 0
  })
})

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.className = ''
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('AxSplitter', () => {
  it('按默认尺寸分配面板并设置分隔条 ARIA', async () => {
    const wrapper = await mountSplitter()
    const separator = wrapper.get('[role="separator"]')

    expect(panelSizes(wrapper)).toEqual([240, 352])
    expect(separator.attributes('aria-orientation')).toBe('vertical')
    expect(separator.attributes('aria-valuemin')).toBe('160')
    expect(separator.attributes('aria-valuemax')).toBe('392')
    expect(separator.attributes('aria-valuenow')).toBe('240')
    expect(separator.attributes('aria-controls').split(' ')).toHaveLength(2)
    wrapper.unmount()
  })

  it('支持 size 和 sizes 受控尺寸,sizes 优先', async () => {
    const wrapper = await mountSplitter({ size: 280 })
    expect(panelSizes(wrapper)).toEqual([280, 312])

    await wrapper.setProps({ sizes: [208, 384] })
    await nextTick()
    expect(panelSizes(wrapper)).toEqual([208, 384])

    await wrapper.setProps({ sizes: undefined, size: 296 })
    await nextTick()
    expect(panelSizes(wrapper)).toEqual([296, 296])
    wrapper.unmount()
  })

  it('指针拖动发出完整事件并在结束后清理防选中状态', async () => {
    const wrapper = await mountSplitter()
    const separator = wrapper.get('[role="separator"]')

    await separator.trigger('pointerdown', {
      pointerId: 7,
      pointerType: 'mouse',
      button: 0,
      clientX: 240
    })
    expect(document.documentElement.classList.contains('ax-splitter-resizing')).toBe(true)

    window.dispatchEvent(new PointerEvent('pointermove', {
      pointerId: 7,
      pointerType: 'mouse',
      clientX: 280,
      bubbles: true,
      cancelable: true
    }))
    await nextTick()

    expect(panelSizes(wrapper)).toEqual([280, 312])
    expect(wrapper.emitted('resize-start')).toHaveLength(1)
    expect(wrapper.emitted('resize')).toHaveLength(1)
    expect(wrapper.emitted('update:size')?.at(-1)).toEqual([280])
    expect(wrapper.emitted('update:sizes')?.at(-1)).toEqual([[280, 312]])

    window.dispatchEvent(new PointerEvent('pointercancel', {
      pointerId: 7,
      pointerType: 'mouse'
    }))
    await nextTick()
    expect(wrapper.emitted('resize-end')).toHaveLength(1)
    expect(document.documentElement.classList.contains('ax-splitter-resizing')).toBe(false)
    wrapper.unmount()
  })

  it('键盘调整共用尺寸约束并支持 Home/End', async () => {
    const wrapper = await mountSplitter({ keyboardStep: 8 })
    const separator = wrapper.get('[role="separator"]')

    await separator.trigger('keydown', { key: 'ArrowRight' })
    expect(panelSizes(wrapper)).toEqual([248, 344])
    expect(separator.attributes('aria-valuenow')).toBe('248')

    await separator.trigger('keydown', { key: 'End' })
    expect(panelSizes(wrapper)).toEqual([392, 200])

    await separator.trigger('keydown', { key: 'Home' })
    expect(panelSizes(wrapper)).toEqual([160, 432])
    expect(wrapper.emitted('resize-start')).toHaveLength(3)
    expect(wrapper.emitted('resize-end')).toHaveLength(3)
    wrapper.unmount()
  })

  it('垂直分栏使用水平 separator 并响应上下方向键', async () => {
    const wrapper = await mountSplitter(
      { direction: 'vertical' },
      { first: { defaultSize: 120, minSize: 80 }, second: { minSize: 96 } }
    )
    const separator = wrapper.get('[role="separator"]')

    expect(panelSizes(wrapper)).toEqual([120, 272])
    expect(separator.attributes('aria-orientation')).toBe('horizontal')
    await separator.trigger('keydown', { key: 'ArrowDown' })
    expect(panelSizes(wrapper)).toEqual([128, 264])
    wrapper.unmount()
  })

  it('容器缩小时自动约束总尺寸,极窄时也不外溢', async () => {
    const wrapper = await mountSplitter()
    containerWidth = 420
    notifyResize()
    await nextTick()
    await nextTick()

    expect(panelSizes(wrapper)).toEqual([212, 200])
    expect(panelSizes(wrapper).reduce((total, size) => total + size, 0)).toBe(412)
    expect(wrapper.emitted('resize')?.at(-1)?.[0]).toMatchObject({ trigger: 'container' })
    wrapper.unmount()

    containerWidth = 360
    const narrowWrapper = await mountSplitter({}, {
      first: { minSize: 200 },
      second: { minSize: 240 }
    })
    const sizes = panelSizes(narrowWrapper)
    expect(sizes.reduce((total, size) => total + size, 0)).toBe(352)
    expect(sizes).toEqual([160, 192])
    narrowWrapper.unmount()
  })

  it('禁用时分隔条不可通过指针或键盘调整', async () => {
    const wrapper = await mountSplitter({ disabled: true })
    const separator = wrapper.get('[role="separator"]')

    expect(separator.attributes('aria-disabled')).toBe('true')
    await separator.trigger('keydown', { key: 'ArrowRight' })
    await separator.trigger('pointerdown', { pointerId: 1, pointerType: 'touch', clientX: 240 })
    expect(panelSizes(wrapper)).toEqual([240, 352])
    expect(wrapper.emitted('resize')).toBeUndefined()
    wrapper.unmount()
  })
})
