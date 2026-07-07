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

### 断点参考(设计规范)

| Token | 视口宽度 | 典型设备 |
|-------|---------|---------|
| screen-xs | < 576px | 手机 |
| screen-sm | ≥ 576px | 大屏手机 |
| screen-md | ≥ 768px | 平板 |
| screen-lg | ≥ 992px | 小尺寸笔记本 |
| screen-xl | ≥ 1200px | 桌面(设计基准 1440px) |
| screen-xxl | ≥ 1600px | 大屏显示器 |

> 当前版本 `span/offset` 不含响应式断点属性,响应式布局可配合 CSS 媒体查询;断点属性在路线图中。
