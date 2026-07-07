/**
 * AxMessage 全局提示 — 命令式 API
 *
 * 用法:
 *   import { AxMessage } from 'axis-ui'
 *   AxMessage.success('保存成功')
 *   AxMessage.error('网络异常', 5000)
 */
import { createVNode, render } from 'vue'
import MessageItem from './MessageItem.vue'

export type MessageType = 'info' | 'success' | 'warning' | 'error'

let container: HTMLDivElement | null = null
let seed = 0

function ensureContainer(): HTMLDivElement {
  if (!container) {
    container = document.createElement('div')
    container.className = 'ax-message-container'
    document.body.appendChild(container)
  }
  return container
}

function show(type: MessageType, content: string, duration = 3000) {
  const host = document.createElement('div')
  const id = `ax-message-${seed++}`

  const destroy = () => {
    render(null, host)
    host.remove()
  }

  const vnode = createVNode(MessageItem, {
    id,
    type,
    content,
    duration,
    onDestroy: destroy
  })
  render(vnode, host)
  ensureContainer().appendChild(host)

  return destroy
}

export const AxMessage = {
  info: (content: string, duration?: number) => show('info', content, duration),
  success: (content: string, duration?: number) => show('success', content, duration),
  warning: (content: string, duration?: number) => show('warning', content, duration),
  error: (content: string, duration?: number) => show('error', content, duration)
}
