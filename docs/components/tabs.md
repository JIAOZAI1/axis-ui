# Tabs 标签页

平级内容分组切换。激活页签下划线取 `color-primary`,切换动效 `motion-duration-mid`。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const active = ref('spec')
</script>

<template>
  <ax-tabs v-model="active">
    <ax-tab-pane name="spec" label="设计规范">三层 Token 架构…</ax-tab-pane>
    <ax-tab-pane name="theme" label="主题定制">品牌主题包机制…</ax-tab-pane>
    <ax-tab-pane name="a11y" label="无障碍">WCAG AA 对比度…</ax-tab-pane>
  </ax-tabs>
</template>
```

## API

### Tabs Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `modelValue` (v-model) | 当前激活页签的 `name` | `string \| number` |

### Tabs Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` / `change` | 切换页签 | `(name: string \| number)` |

### TabPane Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `name` | 唯一标识(必填) | `string \| number` |
| `label` | 页签文字(必填,响应式) | `string` |

### 说明

- 页签导航由 `AxTabPane` 挂载时自动注册生成,`AxTabPane` 动态增删时导航同步更新;
- 非激活面板不渲染(`v-if`),适合含重组件的内容。
