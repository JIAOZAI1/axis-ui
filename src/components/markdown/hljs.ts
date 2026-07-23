import hljs from 'highlight.js/lib/core'

import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import python from 'highlight.js/lib/languages/python'
import shell from 'highlight.js/lib/languages/shell'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('c', c)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('css', css)
hljs.registerLanguage('go', go)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('python', python)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('yaml', yaml)

hljs.registerAliases(['sh', 'zsh'], { languageName: 'bash' })
hljs.registerAliases(['js', 'jsx', 'mjs', 'cjs'], { languageName: 'javascript' })
hljs.registerAliases(['ts', 'tsx'], { languageName: 'typescript' })
hljs.registerAliases(['py'], { languageName: 'python' })
hljs.registerAliases(['yml'], { languageName: 'yaml' })
hljs.registerAliases(['html', 'svg'], { languageName: 'xml' })
hljs.registerAliases(['md'], { languageName: 'markdown' })
hljs.registerAliases(['c++'], { languageName: 'cpp' })
hljs.registerAliases(['cs'], { languageName: 'csharp' })
hljs.registerAliases(['golang'], { languageName: 'go' })

export interface HighlightResult {
  html: string
  language: string
}

export function highlightCode(code: string, lang?: string): HighlightResult {
  const normalized = lang?.trim().toLowerCase()

  if (normalized && hljs.getLanguage(normalized)) {
    const result = hljs.highlight(code, { language: normalized, ignoreIllegals: true })
    return { html: result.value, language: result.language ?? normalized }
  }

  if (!normalized || normalized === 'text' || normalized === 'plaintext' || normalized === 'plain') {
    return { html: escapeHtml(code), language: 'plaintext' }
  }

  const auto = hljs.highlightAuto(code)
  return { html: auto.value, language: auto.language ?? 'plaintext' }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
