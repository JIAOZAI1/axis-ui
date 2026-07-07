# Button 按钮

触发操作的基础组件。高度取 `control-height-sm/md/lg`(24/32/40px),圆角 `radius-md`,微反馈动效 `motion-duration-fast`。

## 基础用法

```vue
<template>
  <ax-button>默认按钮</ax-button>
  <ax-button type="primary">主要按钮</ax-button>
  <ax-button type="success">成功按钮</ax-button>
  <ax-button type="warning">警告按钮</ax-button>
  <ax-button type="danger">危险按钮</ax-button>
  <ax-button type="text">文字按钮</ax-button>
</template>
```

## 描边(plain)与胶囊(round)

```vue
<ax-button type="primary" plain>Plain 主要</ax-button>
<ax-button type="danger" plain>Plain 危险</ax-button>
<ax-button type="primary" round>胶囊按钮</ax-button>
```

## 尺寸

```vue
<ax-button type="primary" size="sm">小号 24px</ax-button>
<ax-button type="primary">中号 32px</ax-button>
<ax-button type="primary" size="lg">大号 40px</ax-button>
```

## 加载与禁用

```vue
<ax-button type="primary" loading>提交中</ax-button>
<ax-button disabled>禁用</ax-button>
<ax-button type="primary" block>撑满整行</ax-button>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 按钮类型 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'text'` | `'default'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 禁用 | `boolean` | `false` |
| `loading` | 加载中(同时禁止点击) | `boolean` | `false` |
| `block` | 撑满父容器宽度 | `boolean` | `false` |
| `round` | 胶囊圆角(`radius-full`) | `boolean` | `false` |
| `plain` | 浅底描边风格,配合彩色 `type` 使用 | `boolean` | `false` |
| `nativeType` | 原生 `type` 属性 | `'button' \| 'submit' \| 'reset'` | `'button'` |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `click` | 点击(禁用/加载中不触发) | `(ev: MouseEvent)` |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 按钮内容 |

### 组件 Token

| Token | 默认引用 |
|-------|----------|
| `--ax-button-height` | `--axis-control-height-md` |
| `--ax-button-font-size` | `--axis-font-size-base` |
| `--ax-button-padding-x` | `--axis-space-4` |
