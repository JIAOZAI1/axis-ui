<script setup lang="ts">
import { inject } from 'vue'
import { dropdownKey, type DropdownFocusDirection } from './context'

defineOptions({ name: 'AxDropdownMenu' })

const dropdown = inject(dropdownKey, null)

function onKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented) return
  const directions: Partial<Record<string, DropdownFocusDirection>> = {
    ArrowDown: 'next',
    ArrowUp: 'previous',
    Home: 'first',
    End: 'last'
  }
  const direction = directions[event.key]
  if (direction) {
    /* DropdownItem 已根据自身 id 处理方向键;仅菜单容器自身收到事件时兜底。 */
    if (event.target !== event.currentTarget) return
    event.preventDefault()
    dropdown?.focusItem(direction)
    return
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    dropdown?.close(true)
  } else if (event.key === 'Tab') {
    dropdown?.close(false)
  }
}
</script>

<template>
  <div class="ax-dropdown-menu" role="menu" aria-orientation="vertical" @keydown="onKeydown">
    <slot />
  </div>
</template>

<style>
.ax-dropdown-menu {
  overflow: auto;
  max-width: 100%;
  max-height: inherit;
  padding: var(--axis-space-1);
  border: var(--axis-border-width) solid var(--axis-color-border-split);
  border-radius: var(--axis-radius-lg);
  background: var(--axis-color-bg-elevated);
  box-shadow: var(--axis-shadow-md);
  color: var(--axis-color-text-primary);
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
}
</style>
