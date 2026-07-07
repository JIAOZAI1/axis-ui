<script setup lang="ts">
defineOptions({ name: 'AxTable' })

export interface TableColumn {
  /** 数据字段名 */
  key: string
  /** 列标题 */
  title: string
  /** 列宽 */
  width?: number | string
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
}

withDefaults(
  defineProps<{
    columns?: TableColumn[]
    data?: Record<string, unknown>[]
    /** 斑马纹 */
    striped?: boolean
    /** 外描边 + 单元格竖线 */
    bordered?: boolean
    /** 行高密度 */
    size?: 'sm' | 'md'
    /** 空数据文案 */
    emptyText?: string
  }>(),
  { columns: () => [], data: () => [], size: 'md', emptyText: '暂无数据' }
)
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
            :style="col.align ? { textAlign: col.align } : undefined"
          >
            {{ col.title }}
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
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="index">
              {{ row[col.key] }}
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
