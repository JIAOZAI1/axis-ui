# Card 卡片

通用内容容器。背景 `color-bg-container`,圆角 `radius-lg`,默认阴影 `shadow-sm`,内容区内边距 `space-6`。

## 基础用法

```vue
<ax-card title="卡片标题">
  卡片内容
</ax-card>
```

## 头部操作区与底部

```vue
<ax-card title="Token 覆盖率看板" hoverable>
  <template #extra>
    <ax-button type="text" size="sm">查看全部</ax-button>
  </template>
  内容区域
  <template #footer>
    更新于 5 分钟前
  </template>
</ax-card>
```

## 无描边 / 自定义内边距

```vue
<ax-card borderless>纯阴影卡片</ax-card>
<ax-card body-padding="0">内容区无内边距(如放置 Table)</ax-card>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `title` | 卡片标题(也可用 `title` 插槽) | `string` | — |
| `hoverable` | 悬浮时抬升至 `shadow-md` | `boolean` | `false` |
| `borderless` | 去掉描边 | `boolean` | `false` |
| `bodyPadding` | 内容区内边距,覆盖默认 `space-6` | `string` | — |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 内容区 |
| `title` | 自定义标题 |
| `extra` | 头部右侧操作区 |
| `footer` | 底部 |
