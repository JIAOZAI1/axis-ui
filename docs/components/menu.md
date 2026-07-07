# Menu 菜单

为页面提供导航的菜单栏。垂直模式用于中后台侧边栏(配合 `--axis-layout-sider-width`),水平模式用于顶栏;选中态取 `color-primary-bg + color-primary`,弹出面板取 `bg-elevated + shadow-md + z-dropdown`。

## 垂直菜单(侧边栏)

```vue
<script setup>
import { ref } from 'vue'
const active = ref('dashboard')
</script>

<template>
  <div style="width: var(--axis-layout-sider-width)">
    <ax-menu v-model="active" :default-open-keys="['project']">
      <ax-menu-item name="dashboard">
        <template #icon>📊</template>
        工作台
      </ax-menu-item>
      <ax-sub-menu name="project" title="项目管理">
        <template #icon>📁</template>
        <ax-menu-item name="project-list">项目列表</ax-menu-item>
        <ax-menu-item name="project-archive">归档项目</ax-menu-item>
        <ax-sub-menu name="project-settings" title="项目设置">
          <ax-menu-item name="project-members">成员</ax-menu-item>
          <ax-menu-item name="project-perms">权限</ax-menu-item>
        </ax-sub-menu>
      </ax-sub-menu>
      <ax-menu-item name="audit" disabled>审计日志(无权限)</ax-menu-item>
    </ax-menu>
  </div>
</template>
```

## 折叠为图标栏

`collapsed` 为 true 时只显示图标(宽度建议 `--axis-layout-sider-collapsed-width`),悬浮顶层子菜单时以浮层弹出下级:

```vue
<div :style="{ width: collapsed
  ? 'var(--axis-layout-sider-collapsed-width)'
  : 'var(--axis-layout-sider-width)' }">
  <ax-menu v-model="active" :collapsed="collapsed">…</ax-menu>
</div>
```

## 水平菜单(顶栏)

子菜单悬浮下拉,顶层选中为品牌色下划线(与 Tabs 语义一致):

```vue
<ax-menu v-model="active" mode="horizontal">
  <ax-menu-item name="home">首页</ax-menu-item>
  <ax-sub-menu name="products" title="产品">
    <ax-menu-item name="ui">组件库</ax-menu-item>
    <ax-menu-item name="tokens">设计 Token</ax-menu-item>
  </ax-sub-menu>
  <ax-menu-item name="docs">文档</ax-menu-item>
</ax-menu>
```

## 配合 Vue Router

```vue
<ax-menu :model-value="route.name" @select="(name) => router.push({ name })">
  …
</ax-menu>
```

## API

### Menu Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 当前选中项的 `name` | `string \| number` | — |
| `mode` | 布局方向 | `'vertical' \| 'horizontal'` | `'vertical'` |
| `collapsed` | 折叠为图标栏(仅 vertical) | `boolean` | `false` |
| `defaultOpenKeys` | 初始展开的子菜单 `name` 列表(仅 vertical 内联) | `(string \| number)[]` | `[]` |

### Menu Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` / `select` | 点击菜单项 | `(name: string \| number)` |

### SubMenu Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `name` | 唯一标识(必填,记录展开状态) | `string \| number` |
| `title` | 子菜单标题(必填) | `string` |
| `disabled` | 禁用(不可展开) | `boolean` |

### MenuItem Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `name` | 唯一标识(必填,与 Menu 的 v-model 对应) | `string \| number` |
| `disabled` | 禁用 | `boolean` |

### Slots

| 组件 | 插槽 | 说明 |
|------|------|------|
| MenuItem / SubMenu | `icon` | 图标(建议 `--axis-icon-size-md` 20px,颜色 `currentColor` 自动随态) |
| MenuItem | `default` | 菜单项文字 |

### 行为说明

- **后代选中高亮父级**:任意层级的子项被选中时,其全部祖先 SubMenu 标题显示品牌色;
- **展开状态与选中状态互不干扰**:收起的子菜单内的选中项依然保持记录(子项常驻挂载);
- 垂直内联模式按嵌套深度自动缩进(每级 16px);
- 弹出面板场景:水平模式的所有子菜单、折叠模式的顶层子菜单(悬浮触发),嵌套弹出向右展开;
- 支持无限层级嵌套。

### 组件 Token

| Token | 默认值 | 说明 |
|-------|--------|------|
| `--ax-menu-item-height` | 40px | 菜单项高度 |
| `--ax-menu-popup-min-width` | 160px | 弹出面板最小宽度 |
