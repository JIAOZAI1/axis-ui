<script setup lang="ts">
import { computed, ref } from 'vue'
import { Marked } from 'marked'
import { escapeHtml, highlightCode } from './hljs'

defineOptions({ name: 'AxMarkdown' })

const props = withDefaults(
  defineProps<{
    /** 原始 Markdown / AI 输出文本 */
    content?: string
    /** 代码块是否显示复制按钮 */
    copyable?: boolean
    /** 是否将单个换行符渲染为 <br>(适合逐字流式输出的 AI 对话场景) */
    breaks?: boolean
  }>(),
  {
    content: '',
    copyable: true,
    breaks: true
  }
)

const emit = defineEmits<{ (e: 'copy', payload: { code: string; language: string }): void }>()

let blockIndex = 0
const codeBlocks = new Map<number, { code: string; language: string }>()

const marked = new Marked({
  gfm: true,
  breaks: props.breaks,
  renderer: {
    code({ text, lang }) {
      const id = blockIndex++
      const { html, language } = highlightCode(text, lang)
      codeBlocks.set(id, { code: text, language })
      const label = escapeHtml(lang?.trim() || language || 'text')
      return (
        `<div class="ax-markdown__code-block" data-block-id="${id}">` +
        `<div class="ax-markdown__code-header">` +
        `<span class="ax-markdown__code-lang">${label}</span>` +
        (props.copyable
          ? `<button type="button" class="ax-markdown__code-copy" data-copy-id="${id}" aria-label="复制代码">复制</button>`
          : '') +
        `</div>` +
        `<pre class="ax-markdown__pre"><code class="hljs language-${escapeHtml(language)}">${html}</code></pre>` +
        `</div>`
      )
    },
    codespan({ text }) {
      return `<code class="ax-markdown__inline-code">${text}</code>`
    }
  }
})

const rootRef = ref<HTMLElement | null>(null)
const copiedId = ref<number | null>(null)

const html = computed(() => {
  blockIndex = 0
  codeBlocks.clear()
  return marked.parse(props.content ?? '', { async: false }) as string
})

async function handleClick(event: MouseEvent) {
  const target = (event.target as HTMLElement)?.closest<HTMLElement>('[data-copy-id]')
  if (!target) return
  const id = Number(target.dataset.copyId)
  const block = codeBlocks.get(id)
  if (!block) return

  await navigator.clipboard?.writeText(block.code)
  emit('copy', { code: block.code, language: block.language })

  copiedId.value = id
  window.setTimeout(() => {
    if (copiedId.value === id) copiedId.value = null
  }, 1500)

  target.textContent = '已复制'
  window.setTimeout(() => {
    if (target.isConnected) target.textContent = '复制'
  }, 1500)
}
</script>

<template>
  <div ref="rootRef" class="ax-markdown" @click="handleClick" v-html="html" />
</template>

<style>
.ax-markdown {
  color: var(--axis-color-text-primary);
  font-family: var(--axis-font-family-base);
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
  word-break: break-word;
}

.ax-markdown > :first-child { margin-top: 0; }
.ax-markdown > :last-child { margin-bottom: 0; }

.ax-markdown p {
  margin: var(--axis-space-3) 0;
}

.ax-markdown h1,
.ax-markdown h2,
.ax-markdown h3,
.ax-markdown h4,
.ax-markdown h5,
.ax-markdown h6 {
  margin: var(--axis-space-6) 0 var(--axis-space-3);
  color: var(--axis-color-text-primary);
  font-weight: var(--axis-font-weight-semibold);
  line-height: var(--axis-line-height-lg);
}

.ax-markdown h1 { font-size: var(--axis-font-size-h3); }
.ax-markdown h2 { font-size: var(--axis-font-size-h4); }
.ax-markdown h3 { font-size: var(--axis-font-size-lg); }
.ax-markdown h4,
.ax-markdown h5,
.ax-markdown h6 { font-size: var(--axis-font-size-base); }

.ax-markdown ul,
.ax-markdown ol {
  margin: var(--axis-space-3) 0;
  padding-left: var(--axis-space-6);
}

.ax-markdown li + li { margin-top: var(--axis-space-1); }

.ax-markdown a {
  color: var(--axis-color-primary);
  text-decoration: none;
}
.ax-markdown a:hover {
  color: var(--axis-color-primary-hover);
  text-decoration: underline;
}

.ax-markdown blockquote {
  margin: var(--axis-space-3) 0;
  padding: var(--axis-space-1) var(--axis-space-4);
  border-left: 3px solid var(--axis-color-border-default);
  color: var(--axis-color-text-secondary);
}

.ax-markdown hr {
  margin: var(--axis-space-6) 0;
  border: none;
  border-top: 1px solid var(--axis-color-border-split);
}

.ax-markdown table {
  width: 100%;
  margin: var(--axis-space-3) 0;
  border-collapse: collapse;
  font-size: var(--axis-font-size-sm);
}
.ax-markdown th,
.ax-markdown td {
  padding: var(--axis-space-2) var(--axis-space-3);
  border: 1px solid var(--axis-color-border-split);
  text-align: left;
}
.ax-markdown th {
  background: var(--axis-color-fill-hover);
  font-weight: var(--axis-font-weight-medium);
}

.ax-markdown img {
  max-width: 100%;
  border-radius: var(--axis-radius-md);
}

.ax-markdown__inline-code {
  padding: 0 var(--axis-space-1);
  border: 1px solid var(--axis-color-border-split);
  border-radius: var(--axis-radius-sm);
  background: var(--axis-color-fill-hover);
  color: var(--axis-color-text-primary);
  font-family: var(--axis-font-family-code);
  font-size: 0.9em;
}

/* ---- 代码块 ---- */
.ax-markdown__code-block {
  margin: var(--axis-space-3) 0;
  border: 1px solid var(--ax-markdown-code-border);
  border-radius: var(--axis-radius-lg);
  background: var(--ax-markdown-code-bg);
  overflow: hidden;
}

.ax-markdown__code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--axis-space-3);
  padding: var(--axis-space-1) var(--axis-space-2) var(--axis-space-1) var(--axis-space-4);
  border-bottom: 1px solid var(--ax-markdown-code-border);
  background: var(--ax-markdown-code-header-bg);
}

.ax-markdown__code-lang {
  color: var(--ax-markdown-code-muted);
  font-family: var(--axis-font-family-code);
  font-size: var(--axis-font-size-xs);
  line-height: var(--axis-line-height-xs);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.ax-markdown__code-copy {
  flex: none;
  padding: var(--axis-space-1) var(--axis-space-2);
  border: none;
  border-radius: var(--axis-radius-sm);
  background: transparent;
  color: var(--ax-markdown-code-muted);
  font: inherit;
  font-size: var(--axis-font-size-xs);
  line-height: var(--axis-line-height-xs);
  cursor: pointer;
  transition: background var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}
.ax-markdown__code-copy:hover {
  background: var(--ax-markdown-code-header-hover);
  color: var(--ax-markdown-code-text);
}

.ax-markdown__pre {
  margin: 0;
  padding: var(--axis-space-4);
  overflow-x: auto;
}

.ax-markdown__pre code.hljs {
  display: block;
  color: var(--ax-markdown-code-text);
  background: transparent;
  font-family: var(--axis-font-family-code);
  font-size: var(--axis-font-size-sm);
  line-height: var(--axis-line-height-sm);
  white-space: pre;
}

/* ---- 组件 Token:代码块配色(亮色默认值) ---- */
.ax-markdown {
  --ax-markdown-code-bg: #f6f8fa;
  --ax-markdown-code-header-bg: rgba(0, 0, 0, 0.03);
  --ax-markdown-code-header-hover: rgba(0, 0, 0, 0.06);
  --ax-markdown-code-border: var(--axis-color-border-split);
  --ax-markdown-code-text: rgba(0, 0, 0, 0.85);
  --ax-markdown-code-muted: var(--axis-color-text-tertiary);

  --ax-markdown-code-comment: #6e7781;
  --ax-markdown-code-keyword: #cf222e;
  --ax-markdown-code-string: #0a3069;
  --ax-markdown-code-number: #0550ae;
  --ax-markdown-code-title: #8250df;
  --ax-markdown-code-attr: #953800;
  --ax-markdown-code-symbol: #116329;
}

[data-theme="dark"] .ax-markdown {
  --ax-markdown-code-bg: #1a1a1a;
  --ax-markdown-code-header-bg: rgba(255, 255, 255, 0.04);
  --ax-markdown-code-header-hover: rgba(255, 255, 255, 0.08);
  --ax-markdown-code-text: rgba(255, 255, 255, 0.85);

  --ax-markdown-code-comment: #8b949e;
  --ax-markdown-code-keyword: #ff7b72;
  --ax-markdown-code-string: #a5d6ff;
  --ax-markdown-code-number: #79c0ff;
  --ax-markdown-code-title: #d2a8ff;
  --ax-markdown-code-attr: #ffa657;
  --ax-markdown-code-symbol: #7ee787;
}

/* ---- highlight.js token 映射 ---- */
.ax-markdown .hljs-comment,
.ax-markdown .hljs-quote {
  color: var(--ax-markdown-code-comment);
  font-style: italic;
}
.ax-markdown .hljs-keyword,
.ax-markdown .hljs-selector-tag,
.ax-markdown .hljs-literal,
.ax-markdown .hljs-type {
  color: var(--ax-markdown-code-keyword);
}
.ax-markdown .hljs-string,
.ax-markdown .hljs-regexp {
  color: var(--ax-markdown-code-string);
}
.ax-markdown .hljs-number {
  color: var(--ax-markdown-code-number);
}
.ax-markdown .hljs-title,
.ax-markdown .hljs-title.function_,
.ax-markdown .hljs-title.class_ {
  color: var(--ax-markdown-code-title);
}
.ax-markdown .hljs-attr,
.ax-markdown .hljs-attribute,
.ax-markdown .hljs-variable,
.ax-markdown .hljs-template-variable,
.ax-markdown .hljs-params {
  color: var(--ax-markdown-code-attr);
}
.ax-markdown .hljs-symbol,
.ax-markdown .hljs-built_in,
.ax-markdown .hljs-tag .hljs-name,
.ax-markdown .hljs-meta {
  color: var(--ax-markdown-code-symbol);
}
.ax-markdown .hljs-emphasis { font-style: italic; }
.ax-markdown .hljs-strong { font-weight: var(--axis-font-weight-semibold); }
</style>
