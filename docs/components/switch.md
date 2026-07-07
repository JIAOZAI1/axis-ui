# Switch 开关

两种状态间切换,立即生效(区别于 Checkbox 的提交型场景)。滑块动效取 `motion-duration-mid`。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const on = ref(true)
</script>

<template>
  <ax-switch v-model="on" />
</template>
```

## 带文案 / 尺寸 / 禁用

```vue
<ax-switch v-model="on" checked-text="开" unchecked-text="关" />
<ax-switch v-model="on" size="sm" />
<ax-switch :model-value="true" disabled />
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 是否开启 | `boolean` | `false` |
| `disabled` | 禁用 | `boolean` | `false` |
| `size` | 尺寸 | `'sm' \| 'md'` | `'md'` |
| `checkedText` | 开启态文案 | `string` | — |
| `uncheckedText` | 关闭态文案 | `string` | — |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` / `change` | 状态切换 | `(value: boolean)` |

### 无障碍

渲染为 `<button role="switch" aria-checked>`,支持键盘 `Space`/`Enter` 切换。

### 组件 Token

| Token | 说明 |
|-------|------|
| `--ax-switch-height` | 开关高度(md: 22px / sm: 16px) |
| `--ax-switch-min-width` | 最小宽度 |
| `--ax-switch-handle` | 滑块直径 |
