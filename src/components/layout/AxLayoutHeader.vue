<script setup lang="ts">
defineOptions({ name: 'AxLayoutHeader' })
</script>

<template>
  <header class="ax-layout-header">
    <slot />
  </header>
</template>

<style>
.ax-layout-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: var(--axis-layout-header-height);
  padding: 0 var(--axis-space-6);
  background: var(--axis-color-bg-container);
  border-bottom: 1px solid var(--axis-color-border-split);
}
</style>
