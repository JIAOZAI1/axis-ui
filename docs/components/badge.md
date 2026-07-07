# Badge 徽标

右上角的数字或小红点提醒。默认使用 `color-error`,白色描边保证在任意底色上清晰。

## 基础用法

```vue
<ax-badge :value="5">
  <ax-button>消息</ax-button>
</ax-badge>
```

## 封顶 / 小红点 / 独立使用

```vue
<ax-badge :value="128" :max="99"><ax-button>通知</ax-button></ax-badge>
<ax-badge dot><ax-button>待办</ax-button></ax-badge>
<ax-badge :value="8" type="primary" />   <!-- 无默认插槽时独立显示 -->
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `value` | 显示值 | `number \| string` | — |
| `max` | 封顶值,超出显示 `{max}+` | `number` | `99` |
| `dot` | 仅显示小红点 | `boolean` | `false` |
| `type` | 语义色 | `'error' \| 'primary' \| 'success' \| 'warning'` | `'error'` |
| `showZero` | 值为 0 时也显示 | `boolean` | `false` |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 被标记的元素;为空时徽标独立显示 |
