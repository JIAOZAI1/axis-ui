# Collapse 折叠面板

用于在有限空间中分组展示可展开、收起的辅助信息。`AxCollapse` 管理展开状态,`AxCollapseItem` 提供标题、内容与扩展区。

## 基础用法

`v-model` 始终是 `(string | number)[]`;空数组表示全部收起。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { CollapseModelValue } from '@jiaozai1/axis-ui'

const activeNames = ref<CollapseModelValue>(['summary'])
</script>

<template>
  <ax-collapse v-model="activeNames">
    <ax-collapse-item name="summary" title="任务概要">
      最近一次运行成功,耗时 2.4 秒。
    </ax-collapse-item>
    <ax-collapse-item name="runtime" title="运行参数">
      环境:production;重试:3 次。
    </ax-collapse-item>
  </ax-collapse>
</template>
```

## 默认展开与全部收起

不使用 `v-model` 时,`defaultActiveNames` 设置非受控的初始展开项。受控模式下将值设为 `[]` 即可全部收起。

```vue
<ax-collapse :default-active-names="['guide']">
  <ax-collapse-item name="guide" title="使用说明">默认展开。</ax-collapse-item>
</ax-collapse>

<ax-button @click="activeNames = []">全部收起</ax-button>
```

也可通过组件 ref 调用 `expandAll()` / `collapseAll()`;手风琴模式下 `expandAll()` 只展开第一项。

## 手风琴

```vue
<ax-collapse v-model="activeNames" accordion>
  <ax-collapse-item name="security" title="安全策略">...</ax-collapse-item>
  <ax-collapse-item name="audit" title="审计策略">...</ax-collapse-item>
</ax-collapse>
```

`accordion` 开启后最多展开一项;再次触发当前项会收起它。

## 外观

```vue
<ax-collapse type="bordered">...</ax-collapse>
<ax-collapse type="borderless">...</ax-collapse>
<ax-collapse type="simple">...</ax-collapse>
```

- `bordered`:外框、项间分隔线与内容分隔线,默认。
- `borderless`:去掉外框,保留项间分隔线。
- `simple`:去掉外框和分隔线,适合嵌入卡片或详情区。

## 插槽与禁用项

```vue
<ax-collapse-item name="runtime" disabled>
  <template #title="{ expanded }">
    运行参数{{ expanded ? '(已展开)' : '' }}
  </template>
  <template #extra>
    <ax-tag type="success">正常</ax-tag>
  </template>
  详细内容
</ax-collapse-item>
```

`extra` 位于标题右侧且不包含在展开按钮内,因此可安全放置 Tag、Link 或 Button 等交互内容。禁用项不可被点击,也会被键盘焦点导航跳过。

## 键盘与无障碍

| 按键 | 行为 |
|------|------|
| `Enter` / `Space` | 展开或收起当前项 |
| `ArrowDown` | 聚焦下一个可用标题,末尾循环到开头 |
| `ArrowUp` | 聚焦上一个可用标题,开头循环到末尾 |
| `Home` / `End` | 聚焦第一个 / 最后一个可用标题 |

标题使用原生 `button`,同步 `aria-expanded` 与 `aria-controls`;内容区使用 `role="region"` 和 `aria-labelledby` 反向关联标题。焦点态使用品牌语义 Token。

## AxCollapse API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (`v-model`) | 当前展开项 | `(string \| number)[]` | — |
| `defaultActiveNames` | 非受控模式的初始展开项 | `(string \| number)[]` | `[]` |
| `accordion` | 手风琴模式 | `boolean` | `false` |
| `type` | 外观 | `'bordered' \| 'borderless' \| 'simple'` | `'bordered'` |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` | 展开项变化 | `(value: CollapseModelValue)` |
| `change` | 展开项变化 | `(value: CollapseModelValue)` |

### Expose

| 方法 | 说明 |
|------|------|
| `expandAll()` | 展开全部;手风琴模式只展开第一项 |
| `collapseAll()` | 收起全部 |

## AxCollapseItem API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `name` | 唯一标识 | `string \| number` | 必填 |
| `title` | 标题 | `string` | `''` |
| `disabled` | 禁用交互 | `boolean` | `false` |

### Slots

| 插槽 | 说明 | 参数 |
|------|------|------|
| `default` | 面板内容 | — |
| `title` | 标题 | `{ expanded: boolean }` |
| `extra` | 标题右侧扩展内容 | `{ expanded: boolean }` |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `change` | 用户切换当前项 | `(expanded: boolean)` |

## 类型导出

```ts
import type {
  CollapseExpose,
  CollapseModelValue,
  CollapseName,
  CollapseType
} from '@jiaozai1/axis-ui'
```

## 组件 Token

| Token | 默认引用 |
|-------|----------|
| `--ax-collapse-border-width` | `--axis-border-width` |
| `--ax-collapse-focus-ring-width` | `--axis-focus-ring-width` |
| `--ax-collapse-arrow-expanded-rotation` | `90deg` |
| `--ax-collapse-header-min-height` | `--axis-control-height-lg` |
| `--ax-collapse-header-padding-block` | `--axis-space-3` |
| `--ax-collapse-header-padding-inline` | `--axis-space-4` |
| `--ax-collapse-content-padding-block` | `--axis-space-4` |
| `--ax-collapse-content-padding-inline` | `--axis-space-4` |
| `--ax-collapse-header-font-size` | `--axis-font-size-base` |
| `--ax-collapse-content-font-size` | `--axis-font-size-base` |

展开、收起和图标旋转统一使用 `--axis-motion-duration-mid` 与 `--axis-motion-ease-in-out`;全局 `prefers-reduced-motion` 降级自动生效。颜色仅消费语义 Token,因此无需组件改动即可适配亮色、暗色和品牌主题。
