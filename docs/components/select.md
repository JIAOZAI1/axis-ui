# Select 选择器

下拉单选。下拉面板使用 `bg-elevated + shadow-md + z-dropdown`,选中项高亮 `color-primary-bg`。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { SelectOption } from 'axis-ui'

const value = ref<string | number>()
const options: SelectOption[] = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '深圳', value: 'shenzhen', disabled: true }
]
</script>

<template>
  <ax-select v-model="value" :options="options" placeholder="请选择城市" />
</template>
```

## 可清空

```vue
<ax-select v-model="value" :options="options" clearable />
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 选中值 | `string \| number \| undefined` | — |
| `options` | 选项列表 | `SelectOption[]` | `[]` |
| `placeholder` | 占位文本 | `string` | `'请选择'` |
| `disabled` | 禁用 | `boolean` | `false` |
| `clearable` | 可清空 | `boolean` | `false` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |

### SelectOption 类型

```ts
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}
```

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` | 选中 / 清空时触发 | `(value: string \| number \| undefined)` |
| `change` | 同上 | 同上 |

### 交互说明

- 点击组件外部自动收起下拉;
- 触发器支持键盘操作:`Enter` 展开/收起,`Escape` 收起;
- 无选项时显示「暂无数据」。

### 组件 Token

| Token | 默认引用 |
|-------|----------|
| `--ax-select-height` | `--axis-control-height-md` |
| `--ax-select-font-size` | `--axis-font-size-base` |
