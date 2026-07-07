# 快速上手

## 安装

axis-ui 发布在 GitHub Packages,先在项目根目录创建 `.npmrc` 指定该作用域的 registry:

```
@jiaozai1:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_只读Token
```

然后安装:

```bash
npm install @jiaozai1/axis-ui vue
```

> axis-ui 以 Vue `^3.4` 为 peer dependency,需要项目自行安装 Vue 3。
> Token 配置与作用域替换说明见[发布与安装指南](./publishing.md)。
> 下文示例中的导入名 `axis-ui` 在实际项目中替换为 `@jiaozai1/axis-ui`。

## 全量引入

```ts
// main.ts
import { createApp } from 'vue'
import AxisUI from 'axis-ui'
import 'axis-ui/dist/axis-ui.css'
import App from './App.vue'

createApp(App).use(AxisUI).mount('#app')
```

注册后即可在任意模板中使用 `ax-` 前缀的组件:

```vue
<template>
  <ax-card title="用户信息">
    <ax-input v-model="name" placeholder="请输入姓名" clearable />
    <ax-button type="primary" @click="save">保存</ax-button>
  </ax-card>
</template>
```

## 按需引入

不使用 `app.use` 时,可单独导入组件(样式仍需引入一次):

```vue
<script setup lang="ts">
import { AxButton, AxTable, AxMessage } from 'axis-ui'
import 'axis-ui/dist/axis-ui.css'

function onSave() {
  AxMessage.success('保存成功')
}
</script>

<template>
  <AxButton type="primary" @click="onSave">保存</AxButton>
</template>
```

## 在业务代码中使用设计 Token

引入 `axis-ui.css` 后,全部 `--axis-*` 语义 Token 挂载在 `:root` 上,业务样式直接消费:

```css
/* ✅ 正确:消费语义 Token */
.page-card {
  background: var(--axis-color-bg-container);
  border-radius: var(--axis-radius-lg);
  padding: var(--axis-space-6);
  box-shadow: var(--axis-shadow-sm);
}

/* ❌ 禁止:硬编码 & 直接引用全局 Token */
.bad {
  background: #fff;                 /* 硬编码 */
  color: var(--axis-blue-6);        /* 全局 Token 不允许直接消费 */
  padding: 17px;                    /* 8px 网格外的魔法数字 */
}
```

完整 Token 清单见 [设计 Token 速查表](./design-tokens.md)。

## 切换暗色模式

```ts
import { setTheme, toggleTheme } from 'axis-ui'

setTheme('dark')    // 开启暗色
setTheme('light')   // 回到亮色
toggleTheme()       // 切换并返回当前模式
```

原理:在 `<html>` 上设置 `data-theme="dark"`,暗色语义映射自动生效,组件与业务代码零改动。详见[主题定制](./theming.md)。

## TypeScript

组件均以 `<script setup lang="ts">` 编写,并导出常用类型:

```ts
import type { SelectOption, TableColumn, ThemeMode } from 'axis-ui'
```

## 浏览器兼容性

依赖 CSS Custom Properties 与 ES2020,支持所有现代浏览器(Chrome / Edge / Firefox / Safari 最近两个大版本)。
