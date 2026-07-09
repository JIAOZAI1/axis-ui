# Space 间距

统一排列按钮、标签、链接、工具栏内容,替代页面手写 `flex` / `gap`。

## 基础用法

```vue
<ax-space>
  <ax-button>取消</ax-button>
  <ax-button type="primary">保存</ax-button>
</ax-space>
```

## 工具栏

```vue
<ax-space justify="space-between" wrap block>
  <ax-space>
    <ax-input placeholder="输入作业 ID 添加" />
    <ax-button>添加</ax-button>
  </ax-space>

  <ax-space>
    <ax-button>刷新</ax-button>
    <ax-button type="primary">新建作业</ax-button>
  </ax-space>
</ax-space>
```

## 垂直排列与分隔符

```vue
<ax-space direction="vertical" align="start">
  <ax-text type="secondary">辅助说明</ax-text>
  <ax-text type="tertiary">更新时间:2026-07-10 12:00</ax-text>
</ax-space>

<ax-space split="/">
  <ax-link>详情</ax-link>
  <ax-link>日志</ax-link>
  <ax-link>重试</ax-link>
</ax-space>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `size` | 间距尺寸,映射 `space-1/2/3/4` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` |
| `direction` | 排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `align` | 交叉轴对齐 | `'start' \| 'center' \| 'end' \| 'baseline'` | `'center'` |
| `justify` | 主轴对齐 | `'start' \| 'end' \| 'center' \| 'space-between'` | `'start'` |
| `wrap` | 允许换行 | `boolean` | `false` |
| `block` | 撑满整行 | `boolean` | `false` |
| `split` | 子项间分隔符 | `string` | — |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 子项 |
| `split` | 自定义分隔符 |
