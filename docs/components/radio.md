# Radio 单选框

在一组互斥选项中选择一项。选中圆点动效取 `motion-duration-fast + motion-ease-out`。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const freq = ref('daily')
</script>

<template>
  <ax-radio-group v-model="freq">
    <ax-radio value="daily">每日</ax-radio>
    <ax-radio value="weekly">每周</ax-radio>
    <ax-radio value="monthly">每月</ax-radio>
  </ax-radio-group>
</template>
```

## 单独使用

不在 Group 内时,`v-model` 与 `value` 相等即为选中:

```vue
<ax-radio v-model="picked" value="a">选项 A</ax-radio>
<ax-radio v-model="picked" value="b">选项 B</ax-radio>
```

## API

### Radio Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 当前选中值(单独使用时) | `string \| number` | — |
| `value` | 本选项取值(必填) | `string \| number` | — |
| `disabled` | 禁用 | `boolean` | `false` |

### Radio Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` / `change` | 选中本项时触发(单独使用时) | `(value: string \| number)` |

### RadioGroup Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 选中值 | `string \| number` | — |
| `disabled` | 禁用组内全部选项 | `boolean` | `false` |

### RadioGroup Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` / `change` | 选中项变化 | `(value: string \| number)` |
