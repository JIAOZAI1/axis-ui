<script setup lang="ts">
import { computed, inject, onBeforeUnmount, toRef } from 'vue'
import { tabsKey } from './context'

defineOptions({ name: 'AxTabPane' })

const props = withDefaults(
  defineProps<{
    /** 唯一标识,与 AxTabs 的 v-model 对应 */
    name: string | number
    /** 页签文字 */
    label: string
    /** 覆盖 Tabs 的 closable(如固定首页设为 false) */
    closable?: boolean
  }>(),
  /* closable 默认必须是 undefined 而不是 Boolean 缺省的 false,否则「未设置时继承 Tabs 级 closable」永远不生效 */
  { closable: undefined }
)

const tabs = inject(tabsKey, null)
tabs?.registerPane(props.name, {
  label: toRef(props, 'label'),
  closable: toRef(props, 'closable')
})
onBeforeUnmount(() => tabs?.unregisterPane(props.name))

const active = computed(() => tabs?.active.value === props.name)
</script>

<template>
  <div v-if="active" class="ax-tab-pane" role="tabpanel">
    <slot />
  </div>
</template>
