# Input 输入框

单行文本输入。聚焦态使用 `color-primary` 描边 + `color-primary-bg` 光晕,占位符取 `color-text-tertiary`。

> **浏览器自动填充**:WebKit/Blink 内核对命中自动填充的输入框会强制涂 UA 浅色背景(`:-webkit-autofill`),
> 组件已内置适配——以 inset box-shadow 恢复主题背景、`-webkit-text-fill-color` 恢复文字色,
> 亮色/暗色/品牌主题下均自动正确,业务无需处理。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
</script>

<template>
  <ax-input v-model="value" placeholder="请输入内容" />
</template>
```

## 可清空 / 字数统计

```vue
<ax-input v-model="value" clearable placeholder="可清空" />
<ax-input v-model="value" :maxlength="20" show-count placeholder="最多 20 字" />
```

## 前后缀

```vue
<ax-input v-model="value" placeholder="搜索">
  <template #prefix>🔍</template>
  <template #suffix>.com</template>
</ax-input>
```

## 校验状态

```vue
<ax-input v-model="value" status="error" />
<ax-input v-model="value" status="warning" />
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 绑定值 | `string` | `''` |
| `type` | 原生 input 类型 | `string` | `'text'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `placeholder` | 占位文本 | `string` | — |
| `disabled` | 禁用 | `boolean` | `false` |
| `clearable` | 显示清空按钮 | `boolean` | `false` |
| `maxlength` | 最大长度 | `number` | — |
| `showCount` | 显示字数统计(需配合 `maxlength`) | `boolean` | `false` |
| `status` | 校验状态 | `'error' \| 'warning'` | — |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` | 输入时触发 | `(value: string)` |
| `change` | 原生 change | `(value: string)` |
| `clear` | 点击清空按钮 | — |
| `focus` / `blur` | 聚焦 / 失焦 | `(ev: FocusEvent)` |

### Slots

| 插槽 | 说明 |
|------|------|
| `prefix` | 输入框头部内容 |
| `suffix` | 输入框尾部内容 |

### 组件 Token

| Token | 默认引用 |
|-------|----------|
| `--ax-input-height` | `--axis-control-height-md` |
| `--ax-input-font-size` | `--axis-font-size-base` |
