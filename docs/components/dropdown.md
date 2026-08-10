# Dropdown 下拉操作菜单

`AxDropdown` 用于管理触发、展开状态、视口定位和焦点;`AxDropdownMenu` / `AxDropdownItem` / `AxDropdownDivider` 组成语义正确的操作菜单。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)

function handleSelect(value: string | number) {
  if (value === 'edit') editProject()
  if (value === 'delete') deleteProject()
}
</script>

<template>
  <ax-dropdown
    v-model:open="open"
    placement="bottom-end"
    aria-label="Axis Admin 项目操作"
    @select="handleSelect"
    @open-change="console.log"
  >
    <template #trigger><ax-icon name="more" /></template>

    <ax-dropdown-menu>
      <ax-dropdown-item value="edit">
        <template #icon><ax-icon name="edit" size="sm" /></template>
        编辑项目
      </ax-dropdown-item>
      <ax-dropdown-divider />
      <ax-dropdown-item value="delete" danger>
        <template #icon><ax-icon name="delete" size="sm" /></template>
        删除项目
      </ax-dropdown-item>
    </ax-dropdown-menu>
  </ax-dropdown>
</template>
```

`AxDropdown` 自身渲染原生触发按钮,`trigger` 插槽只负责自定义按钮内容。图标触发器必须通过 `aria-label` 提供可读名称。

## 项目列表中的三点操作

操作按钮可在鼠标移入或 `focus-within` 时显示。不要使用 `display: none` 或 `visibility: hidden`,否则隐藏按钮无法被键盘聚焦。

```vue
<div class="project-item" tabindex="0">
  <span class="project-item__name">Axis Admin</span>
  <ax-dropdown class="project-item__actions" placement="bottom-end" aria-label="Axis Admin 项目操作">
    <template #trigger><ax-icon name="more" /></template>
    <ax-dropdown-menu>
      <ax-dropdown-item value="edit">编辑项目</ax-dropdown-item>
      <ax-dropdown-item value="delete" danger>删除项目</ax-dropdown-item>
    </ax-dropdown-menu>
  </ax-dropdown>
</div>
```

```css
.project-item__actions {
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.project-item:hover .project-item__actions,
.project-item:focus-within .project-item__actions {
  opacity: 1;
  pointer-events: auto;
}
```

## 触发方式

```vue
<ax-dropdown trigger="click">...</ax-dropdown>
<ax-dropdown trigger="hover">...</ax-dropdown>
```

- `click`:默认,点击触发器切换菜单。
- `hover`:鼠标移入或键盘聚焦触发器时展开;按 `Enter` / `Space` 同样可操作,不依赖指针设备。

## 弹出位置与视口边界

```vue
<ax-dropdown placement="bottom-start">...</ax-dropdown>
<ax-dropdown placement="bottom-end">...</ax-dropdown>
<ax-dropdown placement="top-start">...</ax-dropdown>
<ax-dropdown placement="top-end">...</ax-dropdown>
```

菜单展开后会测量触发器、弹层和视口:

- 下方空间不足且上方更充足时,`bottom-*` 自动翻转为 `top-*`;
- 左右对齐会在 `start` / `end` 之间翻转,并将弹层约束在视口安全边距内;
- 页面或滚动容器滚动、视口尺寸变化时自动重新定位。

`teleported` 默认为 `true`,弹层通过 Teleport 挂载到 `body`,避免被列表滚动容器的 `overflow` 裁切。可用 `teleportTo` 指定其他挂载容器。

## 选择后保持展开

```vue
<ax-dropdown :close-on-select="false" @select="handleBatchAction">
  ...
</ax-dropdown>
```

默认点击可用菜单项后关闭并将焦点返回触发器。`closeOnSelect=false` 适用于需要连续执行的批量操作菜单。点击外部时保留用户的新焦点,`Escape` 关闭时将焦点返回触发器。

## 键盘与无障碍

| 按键 | 行为 |
|------|------|
| `Enter` / `Space` | 展开菜单并聚焦第一个可用项 |
| `ArrowDown` | 展开并聚焦第一项;菜单内聚焦下一个可用项 |
| `ArrowUp` | 展开并聚焦最后一项;菜单内聚焦上一个可用项 |
| `Home` / `End` | 聚焦第一个 / 最后一个可用项 |
| `Escape` | 关闭菜单并将焦点返回触发器 |
| `Tab` | 关闭菜单并继续正常焦点顺序 |

触发器始终设置 `aria-haspopup="menu"` 和动态 `aria-expanded`;菜单使用 `role="menu"`,菜单项使用 `role="menuitem"`。禁用项使用原生 `disabled` 和 `aria-disabled`,并被方向键导航自动跳过。

## AxDropdown API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `open` (`v-model:open`) | 受控展开状态 | `boolean` | — |
| `defaultOpen` | 非受控初始展开状态 | `boolean` | `false` |
| `trigger` | 触发方式 | `'click' \| 'hover'` | `'click'` |
| `placement` | 期望弹出位置 | `DropdownPlacement` | `'bottom-start'` |
| `closeOnSelect` | 选择后关闭 | `boolean` | `true` |
| `teleported` | 启用 Teleport | `boolean` | `true` |
| `teleportTo` | Teleport 目标 | `string \| HTMLElement` | `'body'` |
| `ariaLabel` | 触发器无障碍名称 | `string` | — |
| `disabled` | 禁用触发器 | `boolean` | `false` |

### Slots

| 插槽 | 说明 | 参数 |
|------|------|------|
| `trigger` | 触发按钮内容 | `{ open: boolean }` |
| `default` | 弹层内容,通常为 `AxDropdownMenu` | — |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:open` | 展开状态变化 | `(open: boolean)` |
| `open-change` | 展开状态变化 | `(open: boolean)` |
| `select` | 选择可用菜单项 | `(value: DropdownValue)` |

## AxDropdownItem API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `value` | `select` 事件值 | `string \| number` | 必填 |
| `disabled` | 禁用 | `boolean` | `false` |
| `danger` | 危险操作样式 | `boolean` | `false` |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 菜单项文字 |
| `icon` | 左侧图标 |

`AxDropdownMenu` 是菜单容器,`AxDropdownDivider` 是 `role="separator"` 分隔线,均无 Props。

## 类型导出

```ts
import type {
  DropdownPlacement,
  DropdownTrigger,
  DropdownValue
} from '@jiaozai1/axis-ui'
```

## 组件 Token

| Token | 默认引用 |
|-------|----------|
| `--ax-dropdown-offset` | `--axis-space-1` |
| `--ax-dropdown-viewport-padding` | `--axis-space-2` |
| `--ax-dropdown-enter-scale` | `0.96` |

弹层 z-index 固定使用 `--axis-z-dropdown`;背景、文字、描边、危险态、间距、圆角、阴影、字号与动效全部消费 Axis UI 语义或组件 Token,因此自动适配亮色、暗色与品牌主题。
