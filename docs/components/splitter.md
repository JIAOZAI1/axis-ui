# Splitter 可拖动分栏

`AxSplitter` 管理分栏方向、尺寸与交互,`AxSplitterPanel` 声明每个面板的默认、最小和最大尺寸。尺寸数值统一以像素为单位,组件只输出当前尺寸,持久化由业务端决定。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const projectPanelSize = ref(280)
</script>

<template>
  <ax-splitter v-model:size="projectPanelSize" style="height: 480px">
    <ax-splitter-panel :default-size="280" :min-size="200" :max-size="480">
      项目列表
    </ax-splitter-panel>
    <ax-splitter-panel :min-size="320">
      讨论区
    </ax-splitter-panel>
  </ax-splitter>
</template>
```

`v-model:size` 是首面板尺寸的快捷受控模式。如需读写全部面板尺寸,使用 `v-model:sizes`:

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const sizes = ref<number[]>(JSON.parse(localStorage.getItem('workspace-sizes') ?? '[280, 720]'))
watch(sizes, (value) => localStorage.setItem('workspace-sizes', JSON.stringify(value)))
</script>

<template>
  <ax-splitter v-model:sizes="sizes">
    <ax-splitter-panel :min-size="200">项目列表</ax-splitter-panel>
    <ax-splitter-panel :min-size="320">讨论区</ax-splitter-panel>
  </ax-splitter>
</template>
```

> `sizes` 的优先级高于 `size`,不建议同时传入两者。

## 垂直分栏

```vue
<ax-splitter direction="vertical" style="height: 560px">
  <ax-splitter-panel :default-size="320" :min-size="160">编辑区</ax-splitter-panel>
  <ax-splitter-panel :default-size="232" :min-size="96">控制台</ax-splitter-panel>
</ax-splitter>
```

## 交互与约束

- 分隔条使用 Pointer Events,同时支持鼠标、触摸板、触摸和手写笔;
- 拖动时使用 Pointer Capture 和 window 级监听,指针移出窗口、`pointercancel` 或窗口失焦都会正确结束操作;
- 水平分栏使用左右方向键,垂直分栏使用上下方向键;`Home` / `End` 可直接调整到当前边界,`Shift` 加速调整;
- 容器尺寸变化时,`ResizeObserver` 会重新应用面板约束;默认由末尾面板吸收容器尺寸变化;
- 当容器小于所有 `minSize` 之和时,组件会按比例临时压缩面板,以“不产生页面横向滚动条”为更高优先级;
- 视觉线条为单像素 Token,操作热区为 `--axis-space-2`,并通过语义颜色 Token 自动适配亮色、暗色及品牌主题。

## API

### AxSplitter Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `direction` | 分栏方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `size` | 首面板像素尺寸,支持 `v-model:size` | `number` | — |
| `sizes` | 所有面板像素尺寸,支持 `v-model:sizes` | `number[]` | — |
| `keyboardStep` | 方向键每次调整的像素数 | `number` | `8` |
| `separatorLabel` | 分隔条的无障碍名称 | `string` | `'调整面板尺寸'` |
| `disabled` | 禁止所有尺寸调整 | `boolean` | `false` |

### AxSplitterPanel Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `defaultSize` | 非受控模式的初始像素尺寸;未设置的面板平分剩余空间 | `number` | — |
| `minSize` | 最小像素尺寸 | `number` | `0` |
| `maxSize` | 最大像素尺寸 | `number` | — |

### Events

| 事件 | 说明 | 参数 |
|------|------|------|
| `update:size` | 首面板尺寸变化 | `number` |
| `update:sizes` | 所有面板尺寸变化 | `number[]` |
| `resize-start` | 指针或键盘开始调整 | `SplitterResizeEvent` |
| `resize` | 尺寸调整中,容器自动约束也会触发 | `SplitterResizeEvent` |
| `resize-end` | 指针或键盘结束调整 | `SplitterResizeEvent` |

```ts
interface SplitterResizeEvent {
  index: number
  size: number
  sizes: number[]
  direction: 'horizontal' | 'vertical'
  trigger: 'pointer' | 'keyboard' | 'container'
}
```

## 无障碍

分隔条使用 `role="separator"`,并设置 `aria-orientation`、`aria-valuemin`、`aria-valuemax`、`aria-valuenow`、`aria-controls` 与可见焦点状态。键盘调整与指针拖动使用同一套尺寸约束。
