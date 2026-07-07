<script setup lang="ts">
import { computed, inject } from 'vue'
import { rowKey } from './context'

defineOptions({ name: 'AxCol' })

const props = withDefaults(
  defineProps<{
    /** 占据列数,24 列栅格 */
    span?: number
    /** 左侧偏移列数 */
    offset?: number
  }>(),
  { span: 24, offset: 0 }
)

const row = inject(rowKey, null)

const style = computed(() => {
  const gutter = row?.gutter.value ?? 0
  return {
    flex: `0 0 ${(props.span / 24) * 100}%`,
    maxWidth: `${(props.span / 24) * 100}%`,
    marginLeft: props.offset ? `${(props.offset / 24) * 100}%` : undefined,
    paddingLeft: gutter ? `${gutter / 2}px` : undefined,
    paddingRight: gutter ? `${gutter / 2}px` : undefined
  }
})
</script>

<template>
  <div class="ax-col" :style="style">
    <slot />
  </div>
</template>

<style>
.ax-col {
  min-width: 0;
}
</style>
