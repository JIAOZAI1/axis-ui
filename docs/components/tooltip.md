# Tooltip 文字提示

悬浮 / 聚焦时展示的简短说明。深色气泡 + `shadow-md + z-tooltip`,淡入淡出 `motion-duration-fast`。

## 基础用法

```vue
<ax-tooltip content="删除后不可恢复" placement="top">
  <ax-button type="danger">删除</ax-button>
</ax-tooltip>
```

## 四个方向 / 富内容

```vue
<ax-tooltip content="上方" placement="top"><ax-button>Top</ax-button></ax-tooltip>
<ax-tooltip content="下方" placement="bottom"><ax-button>Bottom</ax-button></ax-tooltip>
<ax-tooltip content="左侧" placement="left"><ax-button>Left</ax-button></ax-tooltip>
<ax-tooltip content="右侧" placement="right"><ax-button>Right</ax-button></ax-tooltip>

<ax-tooltip placement="bottom">
  <template #content>快捷键 <kbd>⌘S</kbd></template>
  <ax-button>保存</ax-button>
</ax-tooltip>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `content` | 提示文本(也可用 `content` 插槽) | `string` | `''` |
| `placement` | 弹出位置 | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 触发元素 |
| `content` | 富文本提示内容,优先于 `content` 属性 |

### 说明

- 鼠标悬浮与键盘聚焦(`focusin`)均可触发,满足无障碍要求;
- 气泡相对触发元素绝对定位;若触发元素处于 `overflow: hidden` 容器边缘,气泡可能被裁剪,此时建议调整 `placement`。
