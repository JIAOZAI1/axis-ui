import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import AxCollapse from '../../src/components/collapse/AxCollapse.vue'
import AxCollapseItem from '../../src/components/collapse/AxCollapseItem.vue'
import type { CollapseModelValue } from '../../src/components/collapse/context'

function items() {
  return [
    h(AxCollapseItem, { name: 'first', title: '第一项' }, () => '第一项内容'),
    h(AxCollapseItem, { name: 'disabled', title: '禁用项', disabled: true }, () => '禁用内容'),
    h(AxCollapseItem, { name: 3, title: '第三项' }, () => '第三项内容')
  ]
}

function mountControlled(options: { accordion?: boolean; initial?: CollapseModelValue } = {}) {
  return mount(defineComponent({
    setup() {
      const activeNames = ref<CollapseModelValue>(options.initial ?? [])
      return () => h(
        AxCollapse,
        {
          modelValue: activeNames.value,
          accordion: options.accordion,
          'onUpdate:modelValue': (value: CollapseModelValue) => {
            activeNames.value = value
          }
        },
        { default: items }
      )
    }
  }))
}

describe('AxCollapse', () => {
  it('支持默认展开、内容关联和收起', async () => {
    const wrapper = mount(AxCollapse, {
      props: { defaultActiveNames: ['first'] },
      slots: { default: items }
    })
    const buttons = wrapper.findAll('button.ax-collapse-item__trigger')
    const firstButton = buttons[0]
    const firstPanel = wrapper.find('[role="region"]')

    expect(firstButton.attributes('aria-expanded')).toBe('true')
    expect(firstButton.attributes('aria-controls')).toBe(firstPanel.attributes('id'))
    expect(firstPanel.attributes('aria-labelledby')).toBe(firstButton.attributes('id'))
    expect(firstPanel.attributes('aria-hidden')).toBe('false')

    await firstButton.trigger('click')
    expect(firstButton.attributes('aria-expanded')).toBe('false')
    expect(firstPanel.attributes('aria-hidden')).toBe('true')
  })

  it('通过 v-model 同步多个展开项', async () => {
    const wrapper = mountControlled()
    const buttons = wrapper.findAll('button.ax-collapse-item__trigger')

    await buttons[0].trigger('click')
    await buttons[2].trigger('click')

    expect(buttons[0].attributes('aria-expanded')).toBe('true')
    expect(buttons[2].attributes('aria-expanded')).toBe('true')
  })

  it('手风琴模式只保留一个展开项', async () => {
    const wrapper = mountControlled({ accordion: true })
    const buttons = wrapper.findAll('button.ax-collapse-item__trigger')

    await buttons[0].trigger('click')
    await buttons[2].trigger('click')

    expect(buttons[0].attributes('aria-expanded')).toBe('false')
    expect(buttons[2].attributes('aria-expanded')).toBe('true')

    await buttons[2].trigger('click')
    expect(buttons[2].attributes('aria-expanded')).toBe('false')
  })

  it('禁用项不会发出状态更新', async () => {
    const wrapper = mount(AxCollapse, { slots: { default: items } })
    const disabledButton = wrapper.findAll('button.ax-collapse-item__trigger')[1]

    expect(disabledButton.attributes('disabled')).toBeDefined()
    expect(disabledButton.attributes('aria-disabled')).toBe('true')
    await disabledButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('方向键导航会跳过禁用项并支持循环', async () => {
    const wrapper = mount(AxCollapse, { slots: { default: items }, attachTo: document.body })
    const buttons = wrapper.findAll<HTMLButtonElement>('button.ax-collapse-item__trigger')

    buttons[0].element.focus()
    await buttons[0].trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(buttons[2].element)

    await buttons[2].trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(buttons[0].element)

    await buttons[0].trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(buttons[2].element)
    wrapper.unmount()
  })

  it('暴露展开全部和收起全部方法', async () => {
    const wrapper = mount(AxCollapse, { slots: { default: items } })
    const buttons = wrapper.findAll('button.ax-collapse-item__trigger')
    const exposed = wrapper.vm as unknown as {
      expandAll: () => void
      collapseAll: () => void
    }

    exposed.expandAll()
    await nextTick()
    expect(buttons.every((button) => button.attributes('aria-expanded') === 'true')).toBe(true)

    exposed.collapseAll()
    await nextTick()
    expect(buttons.every((button) => button.attributes('aria-expanded') === 'false')).toBe(true)
  })
})
