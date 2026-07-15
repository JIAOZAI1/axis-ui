# Icon 图标

内置线性图标库 + 统一图标容器。遵循设计规范 3.6:24×24 网格、2px 描边、线性风格,颜色继承 `currentColor` 随文字色自动换肤(暗色/品牌主题零改动);尺寸取 `--axis-icon-size-sm/md/lg`(16/20/24px)三档 Token。

## 基础用法

```vue
<ax-icon name="search" />
<ax-icon name="settings" />
<ax-icon name="user" />
```

## 尺寸与颜色

尺寸三档取 Token,也接受像素数字;颜色跟随上下文文字色,需要独立颜色时在外层设 `color`:

```vue
<ax-icon name="home" size="sm" />          <!-- 16px -->
<ax-icon name="home" />                    <!-- md 20px(默认) -->
<ax-icon name="home" size="lg" />          <!-- 24px -->
<ax-icon name="home" :size="32" />         <!-- 自定义像素 -->

<span style="color: var(--axis-color-error)">
  <ax-icon name="delete" /> 危险操作      <!-- 图标随文字同色 -->
</span>
```

## 加载态(spin)

```vue
<ax-icon name="loading" spin />
<ax-icon name="refresh" spin />
```

## 在组件插槽中使用

```vue
<ax-menu-item name="dashboard">
  <template #icon><ax-icon name="home" /></template>
  工作台
</ax-menu-item>

<ax-button type="primary"><ax-icon name="plus" size="sm" /> 新建</ax-button>
<ax-input v-model="keyword"><template #prefix><ax-icon name="search" size="sm" /></template></ax-input>
```

## 自定义 SVG

不传 `name` 时渲染默认插槽,放入企业自有 SVG(建议同样遵循 24 网格 / 2px 描边 / currentColor):

```vue
<ax-icon :size="20">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="..." />
  </svg>
</ax-icon>
```

## 内置图标清单(76)

| 分类 | 图标名 |
|------|--------|
| 操作 | `search` `plus` `minus` `close` `check` `edit` `delete` `copy` `save` `refresh` `download` `upload` `send` `share` `print` `link` `external-link` `filter` `more` `loading` `fullscreen` `fullscreen-exit` `logout` |
| 任务控制 | `play` `pause` `stop` |
| 方向 | `chevron-up/down/left/right` `chevrons-left/right`(折叠侧边栏) `arrow-up/down/left/right`(返回/移动) |
| 语义状态与提示 | `info` `success` `warning` `error` `question` `bell` `clock` `star` |
| 对象 | `user` `users` `home` `settings` `eye` `eye-off`(密码可见切换) `calendar` `folder` `file` `file-text`(详情) `image` `paperclip` `lock` `unlock` `key` `shield` `mail` `phone` `map-pin` `tag` `database` `server` `cloud` `grid` `list` `menu` `inbox`(空状态) `bar-chart` `code` `globe`(国际化) `moon` `sun`(暗色切换) |

JS 侧可获取全量清单与原始片段:

```ts
import { iconNames, icons, type IconName } from 'axis-ui'
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `name` | 内置图标名;不传时渲染默认插槽 | `IconName` | — |
| `size` | 尺寸:三档取 `icon-size` Token,或像素数字 | `'sm' \| 'md' \| 'lg' \| number` | `'md'` |
| `spin` | 旋转动画(加载态) | `boolean` | `false` |
| `label` | 无障碍标签;不传视为装饰图标(`aria-hidden`) | `string` | — |

### Slots

| 插槽 | 说明 |
|------|------|
| `default` | 自定义 SVG(仅在未传 `name` 时渲染) |

### 组件 Token

| Token | 默认引用 |
|-------|----------|
| `--ax-icon-size` | `--axis-icon-size-md` |

### 说明

- 新增图标走 RFC 流程进入 `src/components/icon/icons.ts`,保持 24 网格与 2px 描边;
- `spin` 动画响应 `prefers-reduced-motion` 自动降级;
- 语义状态图标(`info/success/warning/error`)与 Alert / Message 内部图标视觉同源。
