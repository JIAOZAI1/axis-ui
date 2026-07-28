<script setup lang="ts">
import { provide } from 'vue'
import { layoutKey } from './context'

defineOptions({ name: 'AxLayout' })

withDefaults(
  defineProps<{
    /** 排列方向:row 侧栏+内容(默认)/ column 顶栏+内容 */
    direction?: 'row' | 'column'
  }>(),
  { direction: 'row' }
)

provide(layoutKey, true)
</script>

<template>
  <div :class="['ax-layout', `ax-layout--${direction}`]">
    <slot />
  </div>
</template>

<style>
.ax-layout {
  display: flex;
  min-height: 0;
  background: var(--axis-color-bg-layout);
}
.ax-layout--row { flex-direction: row; }
.ax-layout--column { flex-direction: column; }

/* 嵌套 AxLayout(如外层 column 顶栏+内容,内层 row 侧栏+内容)时,内层需能撑满剩余空间 */
.ax-layout--column > .ax-layout--row {
  flex: 1;
  min-height: 0;
}
</style>
