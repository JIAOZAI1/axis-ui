<script setup lang="ts">
import { computed, provide, reactive, type Ref } from 'vue'
import { tabsKey } from './context'

defineOptions({ name: 'AxTabs' })

const props = defineProps<{
  modelValue?: string | number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const panes = reactive(new Map<string | number, Ref<string>>())

provide(tabsKey, {
  active: computed(() => props.modelValue),
  registerPane(name, label) {
    panes.set(name, label)
  },
  unregisterPane(name) {
    panes.delete(name)
  }
})

function select(name: string | number) {
  if (name === props.modelValue) return
  emit('update:modelValue', name)
  emit('change', name)
}
</script>

<template>
  <div class="ax-tabs">
    <div class="ax-tabs__nav" role="tablist">
      <button
        v-for="[name, label] in panes"
        :key="name"
        :class="['ax-tabs__tab', { 'is-active': name === modelValue }]"
        type="button"
        role="tab"
        :aria-selected="name === modelValue"
        @click="select(name)"
      >
        {{ label.value }}
      </button>
    </div>
    <div class="ax-tabs__content">
      <slot />
    </div>
  </div>
</template>

<style>
.ax-tabs__nav {
  display: flex;
  gap: var(--axis-space-8);
  border-bottom: 1px solid var(--axis-color-border-split);
}

.ax-tabs__tab {
  position: relative;
  padding: var(--axis-space-3) 0;
  border: none;
  background: transparent;
  font-size: var(--axis-font-size-base);
  color: var(--axis-color-text-secondary);
  cursor: pointer;
  transition: color var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-tabs__tab:hover { color: var(--axis-color-primary-hover); }
.ax-tabs__tab.is-active {
  color: var(--axis-color-primary);
  font-weight: var(--axis-font-weight-medium);
}
.ax-tabs__tab::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--axis-color-primary);
  transform: scaleX(0);
  transition: transform var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-tabs__tab.is-active::after { transform: scaleX(1); }

.ax-tabs__content {
  padding-top: var(--axis-space-4);
  color: var(--axis-color-text-primary);
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
}
</style>
