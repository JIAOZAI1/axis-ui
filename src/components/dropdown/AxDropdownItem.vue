<script setup lang="ts">
import { inject, onBeforeUnmount, ref, toRef } from 'vue'
import { dropdownKey, type DropdownValue } from './context'

defineOptions({ name: 'AxDropdownItem' })

const props = withDefaults(
  defineProps<{
    value: DropdownValue
    disabled?: boolean
    danger?: boolean
  }>(),
  { disabled: false, danger: false }
)

const dropdown = inject(dropdownKey, null)
const elementRef = ref<HTMLButtonElement | null>(null)
const itemId = Symbol('AxDropdownItem')

dropdown?.registerItem(itemId, {
  value: props.value,
  elementRef,
  disabled: toRef(props, 'disabled')
})
onBeforeUnmount(() => dropdown?.unregisterItem(itemId))

function select() {
  if (props.disabled) return
  dropdown?.select(props.value)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    dropdown?.focusItem('next', itemId)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    dropdown?.focusItem('previous', itemId)
  } else if (event.key === 'Home') {
    event.preventDefault()
    dropdown?.focusItem('first')
  } else if (event.key === 'End') {
    event.preventDefault()
    dropdown?.focusItem('last')
  }
}
</script>

<template>
  <button
    ref="elementRef"
    :class="['ax-dropdown-item', { 'is-disabled': disabled, 'is-danger': danger }]"
    type="button"
    role="menuitem"
    tabindex="-1"
    :disabled="disabled"
    :aria-disabled="disabled || undefined"
    @click="select"
    @keydown="onKeydown"
  >
    <span v-if="$slots.icon" class="ax-dropdown-item__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="ax-dropdown-item__label"><slot /></span>
  </button>
</template>

<style>
.ax-dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--axis-space-2);
  width: 100%;
  min-height: var(--axis-control-height-md);
  padding: var(--axis-space-1) var(--axis-space-3);
  border: none;
  border-radius: var(--axis-radius-sm);
  outline: none;
  background: transparent;
  color: var(--axis-color-text-primary);
  font: inherit;
  white-space: nowrap;
  text-align: left;
  cursor: pointer;
  transition:
    background-color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    color var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out),
    box-shadow var(--axis-motion-duration-fast) var(--axis-motion-ease-in-out);
}

.ax-dropdown-item:hover:not(:disabled),
.ax-dropdown-item:focus-visible {
  background: var(--axis-color-fill-hover);
}

.ax-dropdown-item:focus-visible {
  box-shadow: inset 0 0 0 var(--axis-focus-ring-width) var(--axis-color-primary-border);
}

.ax-dropdown-item.is-danger {
  color: var(--axis-color-error);
}

.ax-dropdown-item.is-danger:hover:not(:disabled),
.ax-dropdown-item.is-danger:focus-visible {
  background: var(--axis-color-error-bg);
}

.ax-dropdown-item:disabled {
  color: var(--axis-color-text-disabled);
  cursor: not-allowed;
}

.ax-dropdown-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--axis-icon-size-sm);
  flex-shrink: 0;
}

.ax-dropdown-item__label {
  flex: 1;
}
</style>
