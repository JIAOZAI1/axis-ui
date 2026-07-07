# Tag 标签

标记与分类。高度 22px,圆角 `radius-sm`,彩色标签使用各语义色的 `-bg / -border` 浅色组合。

## 基础用法

```vue
<ax-tag>默认</ax-tag>
<ax-tag type="primary">品牌</ax-tag>
<ax-tag type="success">已通过</ax-tag>
<ax-tag type="warning">待审核</ax-tag>
<ax-tag type="error">已驳回</ax-tag>
```

## 可关闭 / 胶囊

```vue
<ax-tag closable @close="onClose">可关闭</ax-tag>
<ax-tag type="primary" round>胶囊标签</ax-tag>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 语义类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error'` | `'default'` |
| `closable` | 显示关闭按钮 | `boolean` | `false` |
| `round` | 胶囊圆角 | `boolean` | `false` |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `close` | 点击关闭按钮(组件不自动移除,由业务控制) | `(ev: MouseEvent)` |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 标签内容 |
