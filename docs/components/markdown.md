# Markdown 混合渲染

用于渲染 AI 返回的 Markdown 混合内容:正文走 Markdown 语义排版,围栏代码块(` ```lang `)拆分为独立子块,基于 highlight.js 做语法高亮,并带语言标签与复制按钮。

底层解析用 `marked`(GFM),高亮用 `highlight.js/lib/core` 按需注册语言包,不引入全量语言以控制体积。

## 基础用法

```vue
<script setup>
const content = `## 排序算法

下面是 Go 语言实现的快速排序:

\`\`\`go
func quickSort(arr []int) []int {
    if len(arr) <= 1 {
        return arr
    }
    pivot := arr[0]
    var left, right []int
    for _, v := range arr[1:] {
        if v < pivot {
            left = append(left, v)
        } else {
            right = append(right, v)
        }
    }
    return append(append(quickSort(left), pivot), quickSort(right)...)
}
\`\`\`

时间复杂度平均为 \`O(n log n)\`。`
</script>

<template>
  <ax-markdown :content="content" />
</template>
```

## 监听复制事件

```vue
<ax-markdown :content="content" @copy="({ code, language }) => console.log(language, code)" />
```

## 关闭复制按钮 / 关闭单换行转 `<br>`

```vue
<ax-markdown :content="content" :copyable="false" :breaks="false" />
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `content` | 原始 Markdown / AI 输出文本 | `string` | `''` |
| `copyable` | 代码块是否显示复制按钮 | `boolean` | `true` |
| `breaks` | 单个换行符是否渲染为 `<br>`(适合逐字流式输出的对话场景) | `boolean` | `true` |

### Events

| 事件 | 说明 | 回调参数 |
|------|------|------|
| `copy` | 点击代码块复制按钮后触发 | `{ code: string; language: string }` |

### 支持的高亮语言

`javascript`(含 `jsx`/`mjs`/`cjs` 别名)、`typescript`(含 `tsx`)、`python`、`go`、`java`、`c`、`cpp`(含 `c++`)、`csharp`(含 `cs`)、`bash`(含 `sh`/`zsh`)、`json`、`yaml`(含 `yml`)、`sql`、`xml`(含 `html`/`svg`)、`css`、`markdown`(含 `md`)。

未知语言会退化为 highlight.js 自动检测;标注为 `text`/`plaintext` 时不高亮,仅做 HTML 转义。

### 说明

- 组件内部对 Markdown 结果使用 `v-html` 渲染,**不要**将不可信的第三方 HTML 拼进 `content`(marked 默认不转义原始 HTML 标签,若来源不可控请自行做 sanitize);
- 代码块配色是组件级 Token(`--ax-markdown-code-*`),随 `[data-theme="dark"]` 自动重映射,零组件改动切换暗色;
- 复制按钮使用 `navigator.clipboard`,非安全上下文(非 HTTPS/localhost)下可能不可用。
