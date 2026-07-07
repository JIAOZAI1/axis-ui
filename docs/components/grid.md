# Grid 栅格

24 列 flex 栅格,配合 8px 网格的 `gutter` 间距使用。中后台以 1440×900 为设计基准。

## 基础用法

```vue
<ax-row :gutter="16">
  <ax-col :span="6">1/4</ax-col>
  <ax-col :span="6">1/4</ax-col>
  <ax-col :span="6">1/4</ax-col>
  <ax-col :span="6">1/4</ax-col>
</ax-row>
```

## 偏移与对齐

```vue
<ax-row :gutter="16" justify="center" align="middle">
  <ax-col :span="8">span=8</ax-col>
  <ax-col :span="8" :offset="8">span=8 offset=8</ax-col>
</ax-row>
```

## API

### Row Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `gutter` | 列间距(px),建议取 8 的倍数 | `number` | `0` |
| `justify` | 主轴对齐 | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `'start'` |
| `align` | 交叉轴对齐 | `'top' \| 'middle' \| 'bottom'` | `'top'` |

### Col Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `span` | 占据列数(1–24) | `number` | `24` |
| `offset` | 左侧偏移列数 | `number` | `0` |

### 断点与容器

断点与容器宽度已收敛为 Token(`--axis-screen-*` / `--axis-container-*`)与 JS 常量(`breakpoints` / `mediaUp()` 等),
并提供 `.ax-container` 响应式居中容器类,详见 [design-tokens.md 断点与容器宽度](../design-tokens.md#断点与容器宽度)。

> 当前版本 `span/offset` 不含响应式断点属性,响应式布局可配合 `mediaUp()/matchBreakpoint()` 或 CSS 媒体查询;断点属性在路线图中。
