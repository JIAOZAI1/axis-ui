# Tabs 标签页

平级内容分组切换。激活页签下划线取 `color-primary`,切换动效 `motion-duration-mid`;支持可关闭页签,可与 Menu 组合成多页签工作区。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const active = ref('spec')
</script>

<template>
  <ax-tabs v-model="active">
    <ax-tab-pane name="spec" label="设计规范">三层 Token 架构…</ax-tab-pane>
    <ax-tab-pane name="theme" label="主题定制">品牌主题包机制…</ax-tab-pane>
    <ax-tab-pane name="a11y" label="无障碍">WCAG AA 对比度…</ax-tab-pane>
  </ax-tabs>
</template>
```

## 可关闭页签

`closable` 开启后页签带 ✕ 按钮。**组件只发出 `close` 事件、不自己删数据**(与 AxTag 的 close 语义一致),由业务从数组中移除对应面板;若关闭的是激活页签,Tabs 自动切换到相邻页签(先右后左):

```vue
<script setup lang="ts">
import { ref } from 'vue'

const tabs = ref([
  { name: 'a', label: '页签 A' },
  { name: 'b', label: '页签 B' }
])
const active = ref<string | number>('a')

function onClose(name: string | number) {
  tabs.value = tabs.value.filter((t) => t.name !== name)
}
</script>

<template>
  <ax-tabs v-model="active" closable @close="onClose">
    <ax-tab-pane v-for="t in tabs" :key="t.name" :name="t.name" :label="t.label">
      {{ t.label }} 的内容
    </ax-tab-pane>
  </ax-tabs>
</template>
```

单个面板可用 `closable` 覆盖全局设置,如固定首页:

```vue
<ax-tab-pane name="home" label="工作台" :closable="false" />
```

## 多页签工作区(配合 Menu)

中后台经典形态:点击左侧菜单打开页面页签,页签可关闭、可切换,首页固定:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const pages: Record<string, string> = {
  home: '工作台', users: '用户管理', roles: '角色权限'
}
const open = ref<string[]>(['home'])
const active = ref<string | number>('home')

function openPage(name: string | number) {
  if (!open.value.includes(name as string)) open.value.push(name as string)
  active.value = name
}
function closePage(name: string | number) {
  open.value = open.value.filter((n) => n !== name)
  // 关闭激活页后的自动切换由 Tabs 内部完成,无需处理
}
</script>

<template>
  <div style="display: flex">
    <ax-menu :model-value="active" @select="openPage" style="width: 224px">
      <ax-menu-item v-for="(label, name) in pages" :key="name" :name="name">
        {{ label }}
      </ax-menu-item>
    </ax-menu>
    <div style="flex: 1">
      <ax-tabs v-model="active" closable @close="closePage">
        <ax-tab-pane
          v-for="name in open"
          :key="name"
          :name="name"
          :label="pages[name]"
          :closable="name === 'home' ? false : undefined"
        >
          <!-- 页面内容 / <router-view> -->
        </ax-tab-pane>
      </ax-tabs>
    </div>
  </div>
</template>
```

要点:Menu 的 `:model-value` 绑定同一个 `active`,页签切换/关闭后菜单高亮自动跟随;配合 Vue Router 时在 `openPage` 里 `router.push`、面板内放 `<router-view>` 即可。

## API

### Tabs Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 当前激活页签的 `name` | `string \| number` | — |
| `closable` | 页签可关闭(可被 TabPane 覆盖) | `boolean` | `false` |

### Tabs Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` / `change` | 切换页签(含关闭激活页后的自动切换) | `(name: string \| number)` |
| `close` | 点击关闭按钮(组件不删数据,由业务移除面板) | `(name: string \| number)` |

### TabPane Props

| 属性 | 说明 | 类型 |
|------|------|------|
| `name` | 唯一标识(必填) | `string \| number` |
| `label` | 页签文字(必填,响应式) | `string` |
| `closable` | 覆盖 Tabs 的 `closable`(如固定页签设 `false`) | `boolean` |

### 说明

- 页签导航由 `AxTabPane` 挂载时自动注册生成,`AxTabPane` 动态增删时导航同步更新;
- 关闭激活页签时自动切换到相邻页签:优先右侧,右侧没有则左侧;
- 非激活面板不渲染(`v-if`),适合含重组件的内容。
