# Alert 警告提示

页面内的静态提示条。四类语义色使用各自的 `-bg / -border` 浅色组合,圆角 `radius-lg`。

## 基础用法

```vue
<ax-alert type="info" title="信息提示" description="中性通知内容。" />
<ax-alert type="success" title="操作成功" />
<ax-alert type="warning" title="即将过期" closable />
<ax-alert type="error" title="发布被阻断" description="对比度低于 WCAG AA。" closable />
```

## 用插槽自定义描述

```vue
<ax-alert type="warning" title="配额提醒">
  剩余调用量 <strong>1,024</strong> 次,可前往控制台扩容。
</ax-alert>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 语义类型 | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` |
| `title` | 标题 | `string` | — |
| `description` | 描述文本(与默认插槽二选一) | `string` | — |
| `closable` | 可关闭(带淡出动效) | `boolean` | `false` |
| `showIcon` | 显示语义图标 | `boolean` | `true` |

### Events

| 事件 | 说明 |
|------|------|
| `close` | 点击关闭后触发 |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 描述内容,优先于 `description` |
