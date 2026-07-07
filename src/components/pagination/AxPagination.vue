<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AxPagination' })

const props = withDefaults(
  defineProps<{
    /** 当前页,v-model:current */
    current?: number
    /** 总条数 */
    total?: number
    /** 每页条数 */
    pageSize?: number
    /** 显示总数文案 */
    showTotal?: boolean
  }>(),
  { current: 1, total: 0, pageSize: 10 }
)

const emit = defineEmits<{
  (e: 'update:current', value: number): void
  (e: 'change', value: number): void
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

/** 生成页码序列,超过 7 页折叠为省略号 */
const pages = computed<(number | '...')[]>(() => {
  const count = pageCount.value
  const cur = props.current
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  if (cur <= 4) return [1, 2, 3, 4, 5, '...', count]
  if (cur >= count - 3) return [1, '...', count - 4, count - 3, count - 2, count - 1, count]
  return [1, '...', cur - 1, cur, cur + 1, '...', count]
})

function go(page: number) {
  const next = Math.min(Math.max(1, page), pageCount.value)
  if (next === props.current) return
  emit('update:current', next)
  emit('change', next)
}
</script>

<template>
  <nav class="ax-pagination" role="navigation" aria-label="分页">
    <span v-if="showTotal" class="ax-pagination__total">共 {{ total }} 条</span>
    <button
      class="ax-pagination__item"
      type="button"
      :disabled="current <= 1"
      aria-label="上一页"
      @click="go(current - 1)"
    >‹</button>
    <template v-for="(page, index) in pages" :key="index">
      <span v-if="page === '...'" class="ax-pagination__ellipsis">…</span>
      <button
        v-else
        :class="['ax-pagination__item', { 'is-active': page === current }]"
        type="button"
        @click="go(page)"
      >{{ page }}</button>
    </template>
    <button
      class="ax-pagination__item"
      type="button"
      :disabled="current >= pageCount"
      aria-label="下一页"
      @click="go(current + 1)"
    >›</button>
  </nav>
</template>

<style>
.ax-pagination {
  display: inline-flex;
  align-items: center;
  gap: var(--axis-space-2);
  font-size: var(--axis-font-size-base);
}

.ax-pagination__total {
  margin-right: var(--axis-space-2);
  color: var(--axis-color-text-secondary);
}

.ax-pagination__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--axis-control-height-md);
  height: var(--axis-control-height-md);
  padding: 0 var(--axis-space-1);
  border: 1px solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-md);
  background: var(--axis-color-bg-container);
  color: var(--axis-color-text-primary);
  font-size: inherit;
  cursor: pointer;
  transition:
    color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    border-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-pagination__item:hover:not(:disabled):not(.is-active) {
  color: var(--axis-color-primary);
  border-color: var(--axis-color-primary);
}
.ax-pagination__item.is-active {
  border-color: var(--axis-color-primary);
  color: var(--axis-color-primary);
  font-weight: var(--axis-font-weight-medium);
  cursor: default;
}
.ax-pagination__item:disabled {
  color: var(--axis-color-text-disabled);
  cursor: not-allowed;
}

.ax-pagination__ellipsis {
  color: var(--axis-color-text-tertiary);
  padding: 0 var(--axis-space-1);
}
</style>
