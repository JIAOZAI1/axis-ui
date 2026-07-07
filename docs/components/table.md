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
| `striped` | 斑马纹 | `boolean` | `false` |
| `bordered` | 外描边 + 单元格竖线 | `boolean` | `false` |
| `size` | 行高密度 | `'sm' \| 'md'` | `'md'` |
| `emptyText` | 空数据文案 | `string` | `'暂无数据'` |

### TableColumn 类型

```ts
interface TableColumn {
  key: string                          // 数据字段名
  title: string                        // 列标题
  width?: number | string              // 列宽
  align?: 'left' | 'center' | 'right'  // 对齐
}
```

### Slots

| 插槽 | 说明 | 作用域参数 |
|------|------|-----------|
| `cell-[key]` | 自定义某列单元格 | `{ row, value, index }` |
| `empty` | 自定义空数据内容 | — |

### 组件 Token

| Token | 默认引用 |
|-------|----------|
| `--ax-table-header-bg` | `--axis-color-fill-hover` |
| `--ax-table-cell-padding` | `--axis-space-3` `--axis-space-4` |
