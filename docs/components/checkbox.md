# Checkbox 多选框

多项选择。选中框 16×16、圆角 `radius-sm`,选中态填充 `color-primary`。

## 单独使用

```vue
<script setup>
import { ref } from 'vue'
const agree = ref(false)
</script>

<template>
  <ax-checkbox v-model="agree">同意用户协议</ax-checkbox>
</template>
```

## 选项组

组内 `AxCheckbox` 通过 `value` 标识自身取值,组的 `v-model` 为取值数组:

```vue
<script setup>
import { ref } from 'vue'
const perms = ref(['read'])
</script>

<template>
  <ax-checkbox-group v-model="perms">
    <ax-checkbox value="read">读取</ax-checkbox>
    <ax-checkbox value="write">写入</ax-checkbox>
    <ax-checkbox value="admin" disabled>管理(禁用)</ax-checkbox>
  </ax-checkbox-group>
</template>
```

## 半选态

常用于「全选」的中间状态,仅视觉表现:

```vue
<ax-checkbox :model-value="true" indeterminate>全选</ax-checkbox>
```

## API

### Checkbox Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 是否选中(单独使用时) | `boolean` | `false` |
| `value` | 在 Group 中的取值 | `string \| number` | — |
| `disabled` | 禁用 | `boolean` | `false` |
| `indeterminate` | 半选态(仅视觉) | `boolean` | `false` |

### Checkbox Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` / `change` | 状态变化(单独使用时) | `(value: boolean)` |

### CheckboxGroup Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 选中值数组 | `(string \| number)[]` | `[]` |
| `disabled` | 禁用组内全部选项 | `boolean` | `false` |

### CheckboxGroup Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` / `change` | 选中集合变化 | `(value: (string \| number)[])` |
