# Typography 排版

提供 `AxText` 与 `AxTitle` 两个基础排版组件,统一正文、辅助文字、错误文本、代码、ID、省略和复制等场景。

按需引入时也可使用别名 `AxTypographyText` / `AxTypographyTitle`。

## 基础用法

```vue
<ax-space direction="vertical" align="start">
  <ax-title :level="4">作业详情</ax-title>
  <ax-text type="secondary" size="sm">状态每 5 秒自动刷新</ax-text>
  <ax-text type="error" block>{{ errorMessage }}</ax-text>
</ax-space>
```

## 代码、复制与省略

```vue
<ax-text
  code
  ellipsis
  copyable
  text="SamplePlugin.EchoTaskHandler"
  style="max-width: 240px"
/>

<ax-text type="secondary" :line-clamp="2" text="较长说明文本">
  较长说明文本会在两行后省略,并通过 title 展示完整内容。
</ax-text>
```

## API

### Text Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 文字语义 | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'warning' \| 'error'` | `'primary'` |
| `size` | 字号尺寸 | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` |
| `weight` | 字重 | `'regular' \| 'medium' \| 'semibold'` | `'regular'` |
| `code` | 代码样式 | `boolean` | `false` |
| `ellipsis` | 单行省略 | `boolean` | `false` |
| `copyable` | 显示复制动作 | `boolean` | `false` |
| `block` | 撑满整行 | `boolean` | `false` |
| `lineClamp` | 多行省略行数 | `number` | — |
| `tooltip` | 省略时用 `title` 展示完整内容 | `boolean` | `true` |
| `text` | 文本内容,也作为复制和省略提示的来源 | `string` | — |

### Text Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `copy` | 点击复制后触发 | `(value:string)` |

### Title Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `level` | 标题层级 | `1 \| 2 \| 3 \| 4` | `3` |
| `type` | 标题语义色 | 同 Text `type` | `'primary'` |
| `weight` | 字重 | `'regular' \| 'medium' \| 'semibold'` | `'semibold'` |
| `ellipsis` | 单行省略 | `boolean` | `false` |
