# Table 表格

展示结构化数据。表头背景取组件 Token `--ax-table-header-bg`(默认 `color-fill-hover`),行悬浮高亮,空数据占位。

## 基础用法

```vue
<script setup lang="ts">
import type { TableColumn } from 'axis-ui'

const columns: TableColumn[] = [
  { key: 'name', title: '项目', width: 200 },
  { key: 'owner', title: '负责人' },
  { key: 'coverage', title: '覆盖率', align: 'right' }
]
const data = [
  { name: '交易中台', owner: '张三', coverage: '98.2%' },
  { name: '运营后台', owner: '李四', coverage: '91.7%' }
]
</script>

<template>
  <ax-table :columns="columns" :data="data" />
</template>
```

## 斑马纹 / 边框 / 密集尺寸

```vue
<ax-table :columns="columns" :data="data" striped />
<ax-table :columns="columns" :data="data" bordered />
<ax-table :columns="columns" :data="data" size="sm" />
```

## 服务端分页 + 排序 + 序号列

`AxTable` 只展示排序状态并触发事件,不会在组件内部重排 `data`,适合服务端分页/排序。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import type { TableColumn, TableSortOrder } from 'axis-ui'

const columns: TableColumn[] = [
  { key: 'index', title: '序号', type: 'index', width: 72, align: 'center' },
  { key: 'id', title: 'ID', sortable: true },
  { key: 'createdAt', title: '创建时间', sortable: true },
  { key: 'nextRunAt', title: '下次执行时间', sortable: true }
]

const pagination = reactive({ page: 1, pageSize: 20 })
const sort = reactive<{ key: string; order: TableSortOrder }>({
  key: '',
  order: null
})

function loadJobs() {
  // 请求参数示例:
  // page=pagination.page&pageSize=pagination.pageSize&sortKey=sort.key&sortOrder=sort.order
}
</script>

<template>
  <ax-table
    v-model:sort-key="sort.key"
    v-model:sort-order="sort.order"
    :columns="columns"
    :data="jobs"
    :index-offset="(pagination.page - 1) * pagination.pageSize"
    @sort-change="loadJobs"
  />
  <ax-pagination
    v-model:current="pagination.page"
    v-model:page-size="pagination.pageSize"
    :total="total"
    show-total
    show-size-changer
  />
</template>
```

## 表头与内容分开对齐

统一诉求「表头居中、内容按数据类型对齐」时,用 `headerAlign` 单独控制表头;不传则表头跟随 `align`,现有代码零改动:

```js
{ key: 'id', title: 'ID', align: 'center', sortable: true },               // 表头/内容都居中
{ key: 'name', title: '实例名称', headerAlign: 'center', sortable: true }, // 表头居中,内容仍靠左
{ key: 'amount', title: '金额', align: 'right', headerAlign: 'center' },   // 表头居中,内容靠右
```

## 自定义单元格

用 `#cell-[key]` 具名插槽自定义某列渲染:

```vue
<ax-table :columns="columns" :data="data">
  <template #cell-status="{ row, value, index }">
    <ax-tag :type="value">{{ statusText[value] }}</ax-tag>
  </template>
</ax-table>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `columns` | 列定义 | `TableColumn[]` | `[]` |
| `data` | 行数据 | `Record<string, unknown>[]` | `[]` |
| `sortKey` (v-model:sort-key) | 当前排序字段 | `string` | `''` |
| `sortOrder` (v-model:sort-order) | 当前排序方向 | `'asc' \| 'desc' \| null` | `null` |
| `indexOffset` | 序号列偏移量 | `number` | `0` |
| `striped` | 斑马纹 | `boolean` | `false` |
| `bordered` | 外描边 + 单元格竖线 | `boolean` | `false` |
| `size` | 行高密度 | `'sm' \| 'md'` | `'md'` |
| `emptyText` | 空数据文案 | `string` | `'暂无数据'` |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:sortKey` | 排序字段变化 | `(key:string)` |
| `update:sortOrder` | 排序方向变化 | `(order:'asc' \| 'desc' \| null)` |
| `sort-change` | 点击可排序表头后触发 | `{ key, order, column }` |

### TableColumn 类型

```ts
interface TableColumn {
  key: string                          // 数据字段名
  title: string                        // 列标题
  type?: 'index'                       // 特殊列类型:序号列
  sortable?: boolean                   // 是否可点击排序
  width?: number | string              // 列宽
  align?: 'left' | 'center' | 'right'  // 内容对齐(不传 headerAlign 时兼作表头对齐)
  headerAlign?: 'left' | 'center' | 'right'  // 表头对齐,独立于内容;不传回落到 align
}
```

### Slots

| 插槽 | 说明 | 作用域参数 |
|------|------|-----------|
| `cell-[key]` | 自定义某列单元格 | `{ row, value, index, column }` |
| `empty` | 自定义空数据内容 | — |

### 组件 Token

| Token | 默认引用 |
|-------|----------|
| `--ax-table-header-bg` | `--axis-color-fill-hover` |
| `--ax-table-cell-padding` | `--axis-space-3` `--axis-space-4` |
