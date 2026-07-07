# Pagination 分页

分页浏览大数据集。超过 7 页自动折叠为省略号,页码项尺寸取 `control-height-md`。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const page = ref(1)
</script>

<template>
  <ax-pagination v-model:current="page" :total="86" :page-size="10" show-total />
</template>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `current` (v-model:current) | 当前页码 | `number` | `1` |
| `total` | 总条数 | `number` | `0` |
| `pageSize` | 每页条数 | `number` | `10` |
| `showTotal` | 显示「共 N 条」 | `boolean` | `false` |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:current` / `change` | 页码变化 | `(page: number)` |

### 折叠规则

- 总页数 ≤ 7:全部平铺;
- 当前页靠前(≤ 4):`1 2 3 4 5 … N`;
- 当前页靠后(≥ N-3):`1 … N-4 N-3 N-2 N-1 N`;
- 其余:`1 … c-1 c c+1 … N`。
