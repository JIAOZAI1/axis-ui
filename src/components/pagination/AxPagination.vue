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
    /** 每页条数选项 */
    pageSizes?: number[]
    /** 显示每页条数选择器 */
    showSizeChanger?: boolean
    /** 显示总数文案 */
    showTotal?: boolean
  }>(),
  {
    current: 1,
    total: 0,
    pageSize: 10,
    pageSizes: () => [10, 20, 50, 100, 200],
    showSizeChanger: false
  }
)

const emit = defineEmits<{
  (e: 'update:current', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'change', page: number, pageSize: number): void
  (e: 'pageSizeChange', pageSize: number, page: number): void
}>()

const mergedPageSize = computed(() => Math.max(1, props.pageSize))
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / mergedPageSize.value)))
const currentPage = computed(() => Math.min(Math.max(1, props.current), pageCount.value))
const mergedPageSizes = computed(() => {
  const sizes = [...new Set([...props.pageSizes, props.pageSize])]
    .filter((size) => Number.isFinite(size) && size > 0)
    .sort((a, b) => a - b)
  return sizes.length > 0 ? sizes : [10, 20, 50, 100, 200]
})

/** 生成页码序列,超过 7 页折叠为省略号 */
const pages = computed<(number | '...')[]>(() => {
  const count = pageCount.value
  const cur = currentPage.value
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  if (cur <= 4) return [1, 2, 3, 4, 5, '...', count]
  if (cur >= count - 3) return [1, '...', count - 4, count - 3, count - 2, count - 1, count]
  return [1, '...', cur - 1, cur, cur + 1, '...', count]
})

function go(page: number) {
  const next = Math.min(Math.max(1, page), pageCount.value)
  if (next === currentPage.value) return
  emit('update:current', next)
  emit('change', next, mergedPageSize.value)
}

function onPageSizeChange(ev: Event) {
  const nextSize = Number((ev.target as HTMLSelectElement).value)
  if (!Number.isFinite(nextSize) || nextSize <= 0) return
  const nextPageCount = Math.max(1, Math.ceil(props.total / nextSize))
  const nextPage = Math.min(currentPage.value, nextPageCount)
  emit('update:pageSize', nextSize)
  emit('update:current', nextPage)
  emit('pageSizeChange', nextSize, nextPage)
  emit('change', nextPage, nextSize)
}
</script>

<template>
  <nav class="ax-pagination" role="navigation" aria-label="分页">
    <span v-if="showTotal" class="ax-pagination__total">共 {{ total }} 条</span>
    <label v-if="showSizeChanger" class="ax-pagination__sizes">
      <select
        class="ax-pagination__select"
        :value="mergedPageSize"
        aria-label="每页条数"
        @change="onPageSizeChange"
      >
        <option v-for="size in mergedPageSizes" :key="size" :value="size">
          {{ size }} 条/页
        </option>
      </select>
    </label>
    <button
      class="ax-pagination__item"
      type="button"
      :disabled="currentPage <= 1"
      aria-label="上一页"
      @click="go(currentPage - 1)"
    >‹</button>
    <template v-for="(page, index) in pages" :key="index">
      <span v-if="page === '...'" class="ax-pagination__ellipsis">…</span>
      <button
        v-else
        :class="['ax-pagination__item', { 'is-active': page === currentPage }]"
        type="button"
        @click="go(page)"
      >{{ page }}</button>
    </template>
    <button
      class="ax-pagination__item"
      type="button"
      :disabled="currentPage >= pageCount"
      aria-label="下一页"
      @click="go(currentPage + 1)"
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

.ax-pagination__sizes {
  display: inline-flex;
  align-items: center;
}

.ax-pagination__select {
  height: var(--axis-control-height-md);
  padding: 0 var(--axis-space-3);
  border: 1px solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-md);
  background: var(--axis-color-bg-container);
  color: var(--axis-color-text-primary);
  font: inherit;
  cursor: pointer;
  transition:
    color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    border-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    box-shadow var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-pagination__select:hover {
  border-color: var(--axis-color-primary-hover);
}
.ax-pagination__select:focus {
  outline: none;
  border-color: var(--axis-color-primary);
  box-shadow: 0 0 0 var(--axis-space-1) var(--axis-color-primary-bg);
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
