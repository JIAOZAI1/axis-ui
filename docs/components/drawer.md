# Drawer 抽屉

从侧边滑出的浮层面板。交互模式与 [Modal](./modal.md) 一致(遮罩、Esc 关闭、body 滚动锁定),区别是从边缘滑入而非居中弹出;`width` 默认取 [panel-width-*](../design-tokens.md#功能性面板宽度panel-width-) Token,专为会话列表、工具面板、详情等"可收纳的侧边内容"设计。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <ax-button type="primary" @click="open = true">打开工具面板</ax-button>

  <ax-drawer v-model="open" title="工具面板" width="md">
    内容区域
  </ax-drawer>
</template>
```

## 滑出方向与宽度

```vue
<ax-drawer v-model="open" placement="right" width="sm">从右滑入,240px</ax-drawer>
<ax-drawer v-model="open" placement="left" width="lg">从左滑入,360px</ax-drawer>
<ax-drawer v-model="open" placement="bottom" width="240px">从下滑入,自定义高度</ax-drawer>
```

## 自定义底部

```vue
<ax-drawer v-model="open" title="编辑属性">
  表单内容
  <template #footer>
    <ax-button @click="open = false">取消</ax-button>
    <ax-button type="primary" @click="save">保存</ax-button>
  </template>
</ax-drawer>
```

## 无遮罩(常驻工具面板)

`mask="false"` 时不渲染遮罩、不锁定页面滚动,面板悬浮于内容之上但不阻塞下方操作,适合"常驻但可关闭"的辅助面板:

```vue
<ax-drawer v-model="open" :mask="false" :mask-closable="false" width="sm">
  常驻侧边提示,不遮挡主内容操作
</ax-drawer>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 显隐 | `boolean` | `false` |
| `title` | 标题(也可用 `title` 插槽) | `string` | — |
| `width` | 宽度(`placement` 为 left/right 时)或高度(top/bottom 时):`'sm'/'md'/'lg'` 取 panel-width-* Token,也接受任意 CSS 值 | `'sm' \| 'md' \| 'lg' \| string` | `'md'` |
| `placement` | 滑出方向 | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| `maskClosable` | 点击遮罩关闭 | `boolean` | `true` |
| `closable` | 右上角关闭按钮 | `boolean` | `true` |
| `mask` | 是否渲染遮罩(`false` 时不锁定页面滚动) | `boolean` | `true` |

### Events

| 事件 | 说明 |
|------|------|
| `update:modelValue` | 显隐变化 |
| `close` | 点击关闭按钮 / 遮罩 / Esc |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 内容区 |
| `title` | 自定义标题 |
| `footer` | 自定义底部(不传则无底部区域) |

### 与 Modal 的选择

| 场景 | 组件 |
|------|------|
| 居中的表单提交、二次确认 | [Modal](./modal.md) |
| 侧边展开的详情、工具面板、会话列表 | Drawer |
| 分步表单的链式确认 | [WizardModal](./wizard-modal.md) |
