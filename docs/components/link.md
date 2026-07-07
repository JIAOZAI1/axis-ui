# Link 链接

文字超链接。统一链接的语义色、下划线策略与禁用态,替代业务里散落的一次性 `<a>` 样式类;颜色全部取语义 Token,悬浮/激活态与 Button 同源。

## 基础用法

```vue
<ax-link href="#">忘记密码?</ax-link>
<ax-link href="/register" type="default">注册账号</ax-link>
```

## 语义色

```vue
<ax-link href="#" type="default">默认</ax-link>
<ax-link href="#" type="primary">品牌(默认值)</ax-link>
<ax-link href="#" type="success">成功</ax-link>
<ax-link href="#" type="warning">警告</ax-link>
<ax-link href="#" type="danger">危险</ax-link>
```

## 下划线策略

```vue
<ax-link href="#" underline="hover">悬浮时下划线(默认)</ax-link>
<ax-link href="#" underline="always">始终下划线</ax-link>
<ax-link href="#" underline="never">从不下划线</ax-link>
```

## 字号与字重

默认继承上下文字号;需要独立控制时用 `size`(预设档位取字号 Token 并带配套行高,也接受任意 CSS 值)和 `weight`(字重 Token):

```vue
<ax-link href="#" size="xs">辅助说明 12px</ax-link>
<ax-link href="#" size="sm">表格密集 13px</ax-link>
<ax-link href="#" size="md">正文 14px</ax-link>
<ax-link href="#" size="lg" weight="medium">强调 16px + Medium</ax-link>
<ax-link href="#" size="20px" weight="semibold">自定义 20px + Semibold</ax-link>
```

> 优先使用预设档位(对应字号阶梯 Token);自定义 CSS 值仅在营销页等特殊场景使用,避免出现阶梯之外的字号。

## 外链与禁用

```vue
<!-- target="_blank" 自动补 rel="noopener noreferrer" -->
<ax-link href="https://example.com" target="_blank">外部文档 ↗</ax-link>

<!-- 禁用:不渲染 href、阻止点击、aria-disabled -->
<ax-link disabled>已失效的链接</ax-link>
```

## 无 href 的动作链接

不传 `href` 时作为纯动作触发器使用(配合 `click` 事件):

```vue
<ax-link @click="showResetDialog">忘记密码?</ax-link>
```

> 无跳转语义、纯触发行为的场景,也可以考虑 `<ax-button type="text">`;
> Link 适合出现在句子/表单底部等文字流中,随上下文字号继承。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `href` | 跳转地址,禁用时不渲染 | `string` | — |
| `type` | 语义色 | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` |
| `underline` | 下划线策略 | `'always' \| 'hover' \| 'never'` | `'hover'` |
| `disabled` | 禁用(阻止点击 + `aria-disabled`) | `boolean` | `false` |
| `target` | 原生 target,`_blank` 时自动补 `rel="noopener noreferrer"` | `'_self' \| '_blank' \| '_parent' \| '_top'` | — |
| `size` | 字号:预设档位取字号 Token(含配套行高),也接受任意 CSS 值 | `'xs' \| 'sm' \| 'md' \| 'lg' \| string` | 继承上下文 |
| `weight` | 字重,取 `font-weight-*` Token | `'regular' \| 'medium' \| 'semibold'` | 继承上下文 |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `click` | 点击(禁用时不触发且阻止默认跳转) | `(ev: MouseEvent)` |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 链接内容 |

### 说明

- 字号、行高继承上下文(`font-size: inherit`),嵌在正文、表格、表单底部均不破坏排版;
- 键盘聚焦(`:focus-visible`)带品牌色聚焦环,满足无障碍要求;
- 配合 Vue Router 时可包裹 `<router-link custom>` 或直接监听 `click` 后编程式导航。
