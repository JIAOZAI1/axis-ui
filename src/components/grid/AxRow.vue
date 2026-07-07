<script setup lang="ts">
import { computed, provide } from 'vue'
import { rowKey } from './context'

defineOptions({ name: 'AxRow' })

const props = withDefaults(
  defineProps<{
    /** 列间距(px),基于 8px 网格取值 */
    gutter?: number
    /** 主轴对齐 */
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
    /** 交叉轴对齐 */
    align?: 'top' | 'middle' | 'bottom'
  }>(),
  { gutter: 0, justify: 'start', align: 'top' }
)

provide(rowKey, { gutter: computed(() => props.gutter) })

const style = computed(() => ({
  marginLeft: props.gutter ? `-${props.gutter / 2}px` : undefined,
  marginRight: props.gutter ? `-${props.gutter / 2}px` : undefined,
  justifyContent: ({ start: 'flex-start', center: 'center', end: 'flex-end', 'space-between': 'space-between', 'space-around': 'space-around' } as const)[props.justify],
  alignItems: ({ top: 'flex-start', middle: 'center', bottom: 'flex-end' } as const)[props.align]
}))
</script>

<template>
  <div class="ax-row" :style="style">
    <slot />
  </div>
</template>

<style>
.ax-row {
  display: flex;
  flex-wrap: wrap;
}
</style>
