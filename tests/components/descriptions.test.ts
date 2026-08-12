import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import AxDescriptions from '../../src/components/descriptions/AxDescriptions.vue'
import AxDescriptionsItem from '../../src/components/descriptions/AxDescriptionsItem.vue'

function item() {
  return h(AxDescriptionsItem, { label: '项目描述' }, () => '多行项目描述')
}

describe('AxDescriptions', () => {
  it('标签默认保持顶部对齐', async () => {
    const wrapper = mount(AxDescriptions, {
      props: { column: 1, bordered: true },
      slots: { default: item }
    })
    await nextTick()

    expect(wrapper.attributes('style')).toContain('--ax-descriptions-label-align: start')
  })

  it('支持公开 API 将横向标签垂直居中', async () => {
    const wrapper = mount(AxDescriptions, {
      props: { column: 1, bordered: true, labelAlign: 'center' },
      slots: { default: item }
    })
    await nextTick()

    expect(wrapper.attributes('style')).toContain('--ax-descriptions-label-align: center')
    expect(wrapper.find('.ax-descriptions-item__label').exists()).toBe(true)
  })
})
