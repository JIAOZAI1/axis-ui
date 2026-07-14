<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AxTable' })

export type TableSortOrder = 'asc' | 'desc' | null

export interface TableColumn {
  /** 数据字段名 */
  key: string
  /** 列标题 */
  title: string
  /** 特殊列类型 */
  type?: 'index'
  /** 可点击排序 */
  sortable?: boolean
  /** 列宽 */
  width?: number | string
  /** 内容对齐方式(不传 headerAlign 时同时作为表头对齐) */
  align?: 'left' | 'center' | 'right'
  /** 表头对齐方式,独立于内容;不传回落到 align */
  headerAlign?: 'left' | 'center' | 'right'
}

export interface TableSortChangePayload {
  key: string
  order: TableSortOrder
  column: TableColumn
}

const props = withDefaults(
  defineProps<{
    columns?: TableColumn[]
    data?: Record<string, unknown>[]
    /** 当前排序字段,v-model:sort-key */
    sortKey?: string
    /** 当前排序方向,v-model:sort-order */
    sortOrder?: TableSortOrder
    /** 序号列偏移量,分页场景传 (page - 1) * pageSize */
    indexOffset?: number
    /** 斑马纹 */
    striped?: boolean
    /** 外描边 + 单元格竖线 */
    bordered?: boolean
    /** 行高密度 */
    size?: 'sm' | 'md'
    /** 空数据文案 */
    emptyText?: string
  }>(),
  {
    columns: () => [],
    data: () => [],
    sortKey: '',
    sortOrder: null,
    indexOffset: 0,
    size: 'md',
    emptyText: '暂无数据'
  }
)

const emit = defineEmits<{
  (e: 'update:sortKey', value: string): void
  (e: 'update:sortOrder', value: TableSortOrder): void
  (e: 'sort-change', payload: TableSortChangePayload): void
}>()

const normalizedSortOrder = computed<TableSortOrder>(() =>
  props.sortOrder === 'asc' || props.sortOrder === 'desc' ? props.sortOrder : null
)

/**
 * 可排序表头的内容在 flex 按钮内,th 的 text-align 传导不到 flex 布局;
 * 需把 align 映射为 justify-content 直接作用在排序按钮上
 */
const alignToJustify: Record<NonNullable<TableColumn['align']>, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
}

/** 表头对齐:headerAlign 优先,回落到 align(与内容一致) */
function headerAlignOf(col: TableColumn) {
  return col.headerAlign ?? col.align
}

function getCellValue(row: Record<string, unknown>, col: TableColumn, index: number) {
  if (col.type === 'index') return props.indexOffset + index + 1
  return row[col.key]
}

function getNextSortOrder(col: TableColumn): TableSortOrder {
  if (props.sortKey !== col.key) return 'asc'
  if (normalizedSortOrder.value === null) return 'asc'
  if (normalizedSortOrder.value === 'asc') return 'desc'
  return null
}

function onSort(col: TableColumn) {
  if (!col.sortable) return
  const nextOrder = getNextSortOrder(col)
  const nextKey = nextOrder ? col.key : ''
  emit('update:sortKey', nextKey)
  emit('update:sortOrder', nextOrder)
  emit('sort-change', {
    key: col.key,
    order: nextOrder,
    column: col
  })
}
</script>

<template>
  <div :class="['ax-table', `ax-table--${size}`, { 'is-striped': striped, 'is-bordered': bordered }]">
    <table class="ax-table__inner">
      <colgroup>
        <col v-for="col in columns" :key="col.key" :style="col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : undefined" />
      </colgroup>
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              {
                'is-sortable': col.sortable,
                'is-sort-active': col.sortable && sortKey === col.key && normalizedSortOrder
              }
            ]"
            :style="headerAlignOf(col) ? { textAlign: headerAlignOf(col) } : undefined"
          >
            <button
              v-if="col.sortable"
              class="ax-table__sorter"
              type="button"
              :style="headerAlignOf(col) ? { justifyContent: alignToJustify[headerAlignOf(col)!] } : undefined"
              :aria-label="`按${col.title}排序`"
              :aria-sort="sortKey === col.key && normalizedSortOrder ? (normalizedSortOrder === 'asc' ? 'ascending' : 'descending') : 'none'"
              @click="onSort(col)"
            >
              <span class="ax-table__sort-title">{{ col.title }}</span>
              <span class="ax-table__sort-icons" aria-hidden="true">
                <span :class="['ax-table__sort-icon', 'ax-table__sort-icon--asc', { 'is-active': sortKey === col.key && normalizedSortOrder === 'asc' }]" />
                <span :class="['ax-table__sort-icon', 'ax-table__sort-icon--desc', { 'is-active': sortKey === col.key && normalizedSortOrder === 'desc' }]" />
              </span>
            </button>
            <template v-else>{{ col.title }}</template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td
            v-for="col in columns"
            :key="col.key"
            :style="col.align ? { textAlign: col.align } : undefined"
          >
            <!-- 单元格插槽:#cell-[key]="{ row, value, index }" -->
            <slot
              :name="`cell-${col.key}`"
              :row="row"
              :value="getCellValue(row, col, index)"
              :index="index"
              :column="col"
            >
              {{ getCellValue(row, col, index) }}
            </slot>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td class="ax-table__empty" :colspan="columns.length">
            <slot name="empty">{{ emptyText }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.ax-table {
  /* L3 组件 Token */
  --ax-table-header-bg: var(--axis-color-fill-hover);
  --ax-table-cell-padding: var(--axis-space-3) var(--axis-space-4);

  width: 100%;
  overflow-x: auto;
  background: var(--axis-color-bg-container);
  border-radius: var(--axis-radius-lg);
}
.ax-table--sm { --ax-table-cell-padding: var(--axis-space-2) var(--axis-space-3); }

.ax-table__inner {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
  color: var(--axis-color-text-primary);
}
.ax-table--sm .ax-table__inner { font-size: var(--axis-font-size-sm); }

.ax-table__inner th {
  padding: var(--ax-table-cell-padding);
  background: var(--ax-table-header-bg);
  border-bottom: 1px solid var(--axis-color-border-split);
  font-weight: var(--axis-font-weight-medium);
  color: var(--axis-color-text-secondary);
  text-align: left;
  white-space: nowrap;
  transition:
    background-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-table__inner th.is-sortable { padding: 0; }
.ax-table__inner th.is-sortable:hover { background: var(--axis-color-fill-default); }
.ax-table__inner th.is-sort-active {
  background: var(--axis-color-primary-bg);
  color: var(--axis-color-primary);
}

.ax-table__sorter {
  position: relative;
  display: inline-flex;
  align-items: center;
  /* 默认靠左;align 列经内联 justify-content 覆盖(text-align 传导不进 flex) */
  justify-content: flex-start;
  width: 100%;
  min-height: var(--axis-control-height-md);
  padding: var(--ax-table-cell-padding);
  /* 排序图标绝对定位在右侧,预留其空间(图标 8px + 右距 8px + 间隙 4px) */
  padding-right: var(--axis-space-5);
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: inherit;
  text-align: inherit;
  cursor: pointer;
}

.ax-table__sort-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

/**
 * 图标脱离文档流固定在按钮右侧:
 * 标题因此独立参与 justify-content 对齐,居中列的文字是真正的列宽正中,
 * 不再被图标宽度挤出左偏(0.5.1 遗留的视觉偏移)
 */
.ax-table__sort-icons {
  position: absolute;
  right: var(--axis-space-2);
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  flex-direction: column;
  gap: var(--axis-space-1);
}

.ax-table__sort-icon {
  width: 0;
  height: 0;
  border-right: var(--axis-space-1) solid transparent;
  border-left: var(--axis-space-1) solid transparent;
  color: var(--axis-color-text-disabled);
  transition: color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}

.ax-table__sort-icon--asc {
  border-bottom: var(--axis-space-1) solid currentColor;
}

.ax-table__sort-icon--desc {
  border-top: var(--axis-space-1) solid currentColor;
}

.ax-table__sort-icon.is-active {
  color: var(--axis-color-primary);
}

.ax-table__inner td {
  padding: var(--ax-table-cell-padding);
  border-bottom: 1px solid var(--axis-color-border-split);
}

.ax-table__inner tbody tr {
  transition: background-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-table__inner tbody tr:hover { background: var(--axis-color-fill-hover); }
.ax-table.is-striped tbody tr:nth-child(even) { background: var(--axis-color-fill-hover); }
.ax-table.is-striped tbody tr:hover { background: var(--axis-color-fill-default); }

.ax-table.is-bordered { border: 1px solid var(--axis-color-border-split); }
.ax-table.is-bordered th,
.ax-table.is-bordered td { border-right: 1px solid var(--axis-color-border-split); }
.ax-table.is-bordered th:last-child,
.ax-table.is-bordered td:last-child { border-right: none; }

.ax-table__empty {
  padding: var(--axis-space-10) !important;
  text-align: center;
  color: var(--axis-color-text-tertiary);
}
</style>
