# Modal 对话框

模态对话框。面板 `bg-elevated + shadow-lg + z-modal`,出入场 `motion-duration-slow`(遮罩淡入 + 面板缩放),打开时锁定页面滚动。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <ax-button type="primary" @click="open = true">打开对话框</ax-button>

  <ax-modal v-model="open" title="发布确认" @confirm="onConfirm" @cancel="onCancel">
    即将发布 v2.4.0,是否继续?
  </ax-modal>
</template>
```

## 自定义底部 / 无底部

```vue
<ax-modal v-model="open" title="详情" :show-footer="false">
  只读内容,无操作按钮
</ax-modal>

<ax-modal v-model="open" title="危险操作">
  <template #footer>
    <ax-button @click="open = false">再想想</ax-button>
    <ax-button type="danger" @click="doDelete">删除</ax-button>
  </template>
</ax-modal>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 显隐 | `boolean` | `false` |
| `title` | 标题(也可用 `title` 插槽) | `string` | — |
| `width` | 面板宽度 | `string` | `'520px'` |
| `maskClosable` | 点击遮罩关闭 | `boolean` | `true` |
| `closable` | 右上角关闭按钮 | `boolean` | `true` |
| `showFooter` | 显示默认底部(取消/确定) | `boolean` | `true` |
| `confirmText` | 确定按钮文案 | `string` | `'确定'` |
| `cancelText` | 取消按钮文案 | `string` | `'取消'` |

### Events

| 事件 | 说明 |
|------|------|
| `update:modelValue` | 显隐变化 |
| `confirm` | 点击确定 |
| `cancel` | 点击取消 / 关闭按钮 / 遮罩 |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 内容区 |
| `title` | 自定义标题 |
| `footer` | 自定义底部,替换默认按钮组 |

### 说明

- 面板经 `<teleport to="body">` 渲染,不受父容器 `overflow/transform` 影响;
- 打开时 `body` 滚动锁定,关闭自动恢复;
- 带 `role="dialog" aria-modal="true"`。
