<script setup lang="ts">
defineOptions({ name: 'AxLayoutContent' })

withDefaults(
  defineProps<{
    /** 内容区内边距,默认 space-6 */
    bodyPadding?: string
  }>(),
  { bodyPadding: 'var(--axis-space-6)' }
)
</script>

<template>
  <main class="ax-layout-content" :style="{ padding: bodyPadding }">
    <slot />
  </main>
</template>

<style>
.ax-layout-content {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}
</style>
