<script setup lang="ts">
import { computed, inject, onBeforeUnmount, toRef } from 'vue'
import { tabsKey } from './context'

defineOptions({ name: 'AxTabPane' })

const props = defineProps<{
  /** 唯一标识,与 AxTabs 的 v-model 对应 */
  name: string | number
  /** 页签文字 */
  label: string
}>()

const tabs = inject(tabsKey, null)
tabs?.registerPane(props.name, toRef(props, 'label'))
onBeforeUnmount(() => tabs?.unregisterPane(props.name))

const active = computed(() => tabs?.active.value === props.name)
</script>

<template>
  <div v-if="active" class="ax-tab-pane" role="tabpanel">
    <slot />
  </div>
</template>
