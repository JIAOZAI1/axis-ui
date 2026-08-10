import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AxDropdown from '../../src/components/dropdown/AxDropdown.vue'
import AxDropdownDivider from '../../src/components/dropdown/AxDropdownDivider.vue'
import AxDropdownItem from '../../src/components/dropdown/AxDropdownItem.vue'
import AxDropdownMenu from '../../src/components/dropdown/AxDropdownMenu.vue'

function menuItems() {
  return h(AxDropdownMenu, null, {
    default: () => [
      h(AxDropdownItem, { value: 'edit' }, { default: () => '编辑项目' }),
      h(AxDropdownItem, { value: 'copy', disabled: true }, { default: () => '复制项目' }),
      h(AxDropdownDivider),
      h(AxDropdownItem, { value: 'delete', danger: true }, { default: () => '删除项目' })
    ]
  })
}

function mountDropdown(props: Record<string, unknown> = {}) {
  return mount(AxDropdown, {
    attachTo: document.body,
    props,
    slots: {
      trigger: () => '项目操作',
      default: menuItems
    }
  })
}

function menuItemElements() {
  return [...document.body.querySelectorAll<HTMLButtonElement>('.ax-dropdown-item')]
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('AxDropdown', () => {
  it('点击触发器同步 open 状态和 ARIA', async () => {
    const wrapper = mountDropdown()
    const trigger = wrapper.get('button.ax-dropdown__trigger')

    expect(trigger.attributes('aria-haspopup')).toBe('menu')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    await trigger.trigger('click')

    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('update:open')).toEqual([[true]])
    expect(wrapper.emitted('open-change')).toEqual([[true]])
    expect(document.body.querySelector('[role="menu"]')).not.toBeNull()
    wrapper.unmount()
  })

  it('支持 v-model:open 受控展开状态', async () => {
    const wrapper = mountDropdown({ open: false })
    const trigger = wrapper.get('button.ax-dropdown__trigger')

    await trigger.trigger('click')
    expect(wrapper.emitted('update:open')).toEqual([[true]])
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await wrapper.setProps({ open: true })
    expect(trigger.attributes('aria-expanded')).toBe('true')
    await wrapper.setProps({ open: false })
    expect(trigger.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('选择菜单项后发出 select、关闭并将焦点返回触发器', async () => {
    const wrapper = mountDropdown()
    const trigger = wrapper.get<HTMLButtonElement>('button.ax-dropdown__trigger')
    await trigger.trigger('click')

    menuItemElements()[0].click()
    await nextTick()
    await nextTick()

    expect(wrapper.emitted('select')).toEqual([['edit']])
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger.element)

    await trigger.trigger('keydown', { key: ' ' })
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(menuItemElements()[0])
    wrapper.unmount()
  })

  it('closeOnSelect=false 时选择后保持展开', async () => {
    const wrapper = mountDropdown({ closeOnSelect: false })
    const trigger = wrapper.get('button.ax-dropdown__trigger')
    await trigger.trigger('click')

    menuItemElements()[0].click()
    await nextTick()

    expect(wrapper.emitted('select')).toEqual([['edit']])
    expect(trigger.attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('Enter、方向键、Home、End 和 Escape 完成键盘导航', async () => {
    const wrapper = mountDropdown()
    const trigger = wrapper.get<HTMLButtonElement>('button.ax-dropdown__trigger')

    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    const items = menuItemElements()
    expect(document.activeElement).toBe(items[0])

    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(items[2])

    items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(items[0])

    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(items[2])

    items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })

  it('点击外部会关闭,hover 模式移入会展开', async () => {
    const clickWrapper = mountDropdown()
    const clickTrigger = clickWrapper.get('button.ax-dropdown__trigger')
    await clickTrigger.trigger('click')
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await nextTick()
    expect(clickTrigger.attributes('aria-expanded')).toBe('false')
    clickWrapper.unmount()

    const hoverWrapper = mountDropdown({ trigger: 'hover' })
    await hoverWrapper.trigger('mouseenter')
    await nextTick()
    expect(hoverWrapper.get('button.ax-dropdown__trigger').attributes('aria-expanded')).toBe('true')
    hoverWrapper.unmount()
  })

  it('视口底部和右侧空间不足时翻转为 top-end', async () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
      if (this.classList.contains('ax-dropdown__trigger')) {
        return DOMRect.fromRect({ x: 750, y: 560, width: 32, height: 32 })
      }
      if (this.classList.contains('ax-dropdown__popup')) {
        return DOMRect.fromRect({ width: 180, height: 120 })
      }
      return DOMRect.fromRect()
    })

    const wrapper = mountDropdown({ placement: 'bottom-start' })
    await wrapper.get('button.ax-dropdown__trigger').trigger('click')
    await nextTick()

    expect(document.body.querySelector('.ax-dropdown__popup--top-end')).not.toBeNull()
    wrapper.unmount()
  })

  it('禁用项不可聚焦,危险项和分隔线具有正确语义', async () => {
    const wrapper = mountDropdown()
    await wrapper.get('button.ax-dropdown__trigger').trigger('click')
    const items = menuItemElements()

    expect(items[1].disabled).toBe(true)
    expect(items[1].getAttribute('aria-disabled')).toBe('true')
    expect(items[2].classList.contains('is-danger')).toBe(true)
    expect(document.body.querySelector('[role="separator"]')).not.toBeNull()
    wrapper.unmount()
  })
})
