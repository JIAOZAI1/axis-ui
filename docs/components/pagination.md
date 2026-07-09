# Pagination 分页

分页浏览大数据集。超过 7 页自动折叠为省略号,页码项尺寸取 `control-height-md`。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <ax-pagination
    v-model:current="page"
    v-model:page-size="pageSize"
    :total="86"
    show-total
    show-size-changer
  />
</template>
```

## 自定义每页条数

默认支持 `10 / 20 / 50 / 100 / 200` 条/页,也可以通过 `page-sizes` 覆盖。

```vue
<ax-pagination
  v-model:current="page"
  v-model:page-size="pageSize"
  :total="1000"
  :page-sizes="[20, 50, 100]"
  show-size-changer
/>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `current` (v-model:current) | 当前页码 | `number` | `1` |
| `total` | 总条数 | `number` | `0` |
| `pageSize` (v-model:page-size) | 每页条数 | `number` | `10` |
| `pageSizes` | 每页条数选项 | `number[]` | `[10,20,50,100,200]` |
| `showSizeChanger` | 显示每页条数选择器 | `boolean` | `false` |
| `showTotal` | 显示「共 N 条」 | `boolean` | `false` |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:current` | 页码变化 | `(page: number)` |
| `update:pageSize` | 每页条数变化 | `(pageSize: number)` |
| `change` | 页码或每页条数变化 | `(page:number, pageSize:number)` |
| `pageSizeChange` | 每页条数变化 | `(pageSize:number, page:number)` |

### 折叠规则

- 总页数 ≤ 7:全部平铺;
- 当前页靠前(≤ 4):`1 2 3 4 5 … N`;
- 当前页靠后(≥ N-3):`1 … N-4 N-3 N-2 N-1 N`;
- 其余:`1 … c-1 c c+1 … N`。
