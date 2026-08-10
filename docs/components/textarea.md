# Textarea 多行文本框

用于输入较长的多行文本。边框、背景、文字、圆角与动效均消费语义或组件 Token,可直接适配暗色与品牌主题。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'

const description = ref('')
</script>

<template>
  <ax-textarea
    v-model="description"
    :rows="4"
    placeholder="请输入详细说明"
  />
</template>
```

## 字数统计

```vue
<ax-textarea
  v-model="description"
  :maxlength="200"
  show-count
  placeholder="最多 200 字"
/>
```

`showCount` 未配合 `maxlength` 时只显示当前字数;设置 `maxlength` 后显示“当前字数/最大字数”,并由原生 textarea 限制输入长度。

## 自动高度

传入 `autosize` 后,文本框随内容增高且关闭用户拖拽。对象形式可以限制最少和最多行数;达到 `maxRows` 后改为内部滚动。

```vue
<!-- 最少保持 rows 指定的 3 行,不限制最大高度 -->
<ax-textarea v-model="description" autosize :rows="3" />

<!-- 保持在 2–6 行之间 -->
<ax-textarea
  v-model="description"
  :autosize="{ minRows: 2, maxRows: 6 }"
/>
```

## 调整尺寸与状态

```vue
<ax-textarea v-model="description" resize="none" />
<ax-textarea v-model="description" resize="both" />
<ax-textarea model-value="内容有误" status="error" />
<ax-textarea model-value="请确认内容" status="warning" />
<ax-textarea model-value="不可编辑" disabled />
```

放在 `AxFormItem` 内时,组件会自动继承字段的错误状态,输入与失焦也会触发表单联动校验。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 绑定值 | `string` | `''` |
| `rows` | 默认可见行数;自动高度时也是默认最少行数 | `number` | `3` |
| `placeholder` | 占位文本 | `string` | — |
| `disabled` | 禁用 | `boolean` | `false` |
| `maxlength` | 最大输入长度 | `number` | — |
| `showCount` | 显示字数统计 | `boolean` | `false` |
| `status` | 校验状态 | `'error' \| 'warning'` | — |
| `resize` | 用户拖拽调整方向 | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` |
| `autosize` | 根据内容自动调整高度 | `boolean \| { minRows?: number; maxRows?: number }` | `false` |

未声明的原生 textarea 属性会透传到内部元素,例如 `name`、`readonly`、`autocomplete` 和 `aria-*`。

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` | 输入时触发 | `(value: string)` |
| `change` | 原生 change | `(value: string)` |
| `focus` / `blur` | 聚焦 / 失焦 | `(ev: FocusEvent)` |

### Expose (Template Ref)

| 方法 | 说明 |
|------|------|
| `focus()` | 聚焦文本框,返回 `Promise<void>` |
| `resize()` | 重新计算自动高度,返回 `Promise<void>` |

### 组件 Token

| Token | 默认引用 |
|-------|----------|
| `--ax-textarea-font-size` | `--axis-font-size-base` |
| `--ax-textarea-line-height` | `--axis-line-height-base` |
