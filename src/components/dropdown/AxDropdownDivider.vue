<script setup lang="ts">
defineOptions({ name: 'AxDropdownDivider' })
</script>

<template>
  <div class="ax-dropdown-divider" role="separator" />
</template>

<style>
.ax-dropdown-divider {
  height: var(--axis-border-width);
  margin: var(--axis-space-1) 0;
  background: var(--axis-color-border-split);
}
</style>
