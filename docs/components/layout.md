# Layout 布局容器

页面骨架:顶栏 + 侧栏 + 内容区。`AxLayout` 是 flex 容器,`AxLayoutSider` / `AxLayoutHeader` / `AxLayoutContent` 是三种区域,可自由组合与嵌套。

## 基础用法(侧栏 + 内容)

```vue
<ax-layout style="min-height: 100vh">
  <ax-layout-sider width="nav">
    <ax-menu v-model="active">…</ax-menu>
  </ax-layout-sider>
  <ax-layout-content>
    主内容区
  </ax-layout-content>
</ax-layout>
```

## 顶栏 + 侧栏 + 内容(嵌套)

```vue
<ax-layout direction="column" style="min-height: 100vh">
  <ax-layout-header>顶栏</ax-layout-header>
  <ax-layout>
    <ax-layout-sider width="nav">侧栏</ax-layout-sider>
    <ax-layout-content>内容</ax-layout-content>
  </ax-layout>
</ax-layout>
```

## 侧栏宽度:导航侧栏 vs 功能面板

`AxLayoutSider` 的 `width` 区分两种语义(详见 [design-tokens.md](../design-tokens.md#功能性面板宽度panel-width-)):

```vue
<!-- 全局导航侧栏,224px,可折叠 -->
<ax-layout-sider width="nav" :collapsed="collapsed">…</ax-layout-sider>

<!-- 功能性面板(会话列表等),取 panel-width-* -->
<ax-layout-sider width="sm">会话列表(240px)</ax-layout-sider>
<ax-layout-sider width="md">工具面板(300px)</ax-layout-sider>
<ax-layout-sider width="lg">宽面板(360px)</ax-layout-sider>
```

## 多栏组合(会话列表 + 详情)

```vue
<ax-layout style="min-height: 100vh">
  <ax-layout-sider width="nav"><ax-menu>…</ax-menu></ax-layout-sider>
  <ax-layout-sider width="sm" border-position="right">会话列表</ax-layout-sider>
  <ax-layout-content>对话详情</ax-layout-content>
</ax-layout>
```

## API

### AxLayout Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `direction` | 排列方向:`row` 侧栏+内容 / `column` 顶栏+内容 | `'row' \| 'column'` | `'row'` |

### AxLayoutSider Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `width` | `'nav'` 全局导航侧栏(224px);`'sm'/'md'/'lg'` 取 panel-width-*;也接受任意 CSS 值 | `'nav' \| 'sm' \| 'md' \| 'lg' \| string` | `'nav'` |
| `collapsed` | 折叠为图标栏宽度(仅 `width="nav"` 时有意义) | `boolean` | `false` |
| `bodyPadding` | 内容区内边距 | `string` | — |
| `borderPosition` | 描边位置 | `'left' \| 'right' \| 'none'` | `'right'` |

### AxLayoutContent Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `bodyPadding` | 内容区内边距 | `string` | `space-6`(24px) |

### 说明

- `AxLayoutHeader` 高度固定取 `--axis-layout-header-height`(56px),无可配置 props;
- 三个区域组件均为纯展示容器,不处理响应式折叠逻辑,折叠状态由业务通过 `collapsed` 传入(参考 [Menu 折叠图标栏](./menu.md));
- 需要"点击展开的浮层面板"而非"常驻布局区域"时,使用 [Drawer 抽屉](./drawer.md)。
