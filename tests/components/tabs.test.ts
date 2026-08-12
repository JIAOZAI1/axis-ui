import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import AxTabPane from '../../src/components/tabs/AxTabPane.vue'
import AxTabs from '../../src/components/tabs/AxTabs.vue'

function panes() {
  return [
    h(AxTabPane, { name: 'first', label: '第一页' }, () => '第一页内容'),
    h(AxTabPane, { name: 'second', label: '第二页' }, () => '第二页内容')
  ]
}

describe('AxTabs', () => {
  it('默认使用 md 尺寸并支持 sm 紧凑尺寸', async () => {
    const wrapper = mount(AxTabs, {
      props: { modelValue: 'first' },
      slots: { default: panes }
    })
    await nextTick()

    expect(wrapper.classes()).toContain('ax-tabs--md')

    await wrapper.setProps({ size: 'sm' })
    expect(wrapper.classes()).toContain('ax-tabs--sm')
  })

  it('紧凑尺寸保留页签切换和关闭行为', async () => {
    const wrapper = mount(AxTabs, {
      props: { modelValue: 'first', size: 'sm', closable: true },
      slots: { default: panes }
    })
    await nextTick()

    await wrapper.findAll('.ax-tabs__tab')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['second'])

    await wrapper.find('.ax-tabs__close').trigger('click')
    expect(wrapper.emitted('close')?.[0]).toEqual(['first'])
    expect(wrapper.find('.ax-tabs__close-icon').exists()).toBe(true)
  })
})
