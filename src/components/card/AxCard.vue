<script setup lang="ts">
defineOptions({ name: 'AxCard' })

withDefaults(
  defineProps<{
    /** 卡片标题(也可用 title 插槽) */
    title?: string
    /** 悬浮时抬升阴影 */
    hoverable?: boolean
    /** 无描边(纯阴影) */
    borderless?: boolean
    /** 内容区内边距,默认 space-6 */
    bodyPadding?: string
  }>(),
  {}
)
</script>

<template>
  <div :class="['ax-card', { 'is-hoverable': hoverable, 'is-borderless': borderless }]">
    <div v-if="title || $slots.title || $slots.extra" class="ax-card__header">
      <div class="ax-card__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="$slots.extra" class="ax-card__extra">
        <slot name="extra" />
      </div>
    </div>
    <div class="ax-card__body" :style="bodyPadding ? { padding: bodyPadding } : undefined">
      <slot />
    </div>
    <div v-if="$slots.footer" class="ax-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style>
.ax-card {
  background: var(--axis-color-bg-container);
  border: 1px solid var(--axis-color-border-split);
  border-radius: var(--axis-radius-lg);
  box-shadow: var(--axis-shadow-sm);
  transition: box-shadow var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-card.is-borderless { border-color: transparent; }
.ax-card.is-hoverable:hover { box-shadow: var(--axis-shadow-md); }

.ax-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--axis-space-4);
  padding: var(--axis-space-4) var(--axis-space-6);
  border-bottom: 1px solid var(--axis-color-border-split);
}
.ax-card__title {
  font-size: var(--axis-font-size-lg);
  line-height: var(--axis-line-height-lg);
  font-weight: var(--axis-font-weight-medium);
  color: var(--axis-color-text-primary);
}
.ax-card__extra {
  font-size: var(--axis-font-size-base);
  color: var(--axis-color-text-secondary);
}

.ax-card__body {
  padding: var(--axis-space-6);
  color: var(--axis-color-text-primary);
  font-size: var(--axis-font-size-base);
  line-height: var(--axis-line-height-base);
}

.ax-card__footer {
  padding: var(--axis-space-3) var(--axis-space-6);
  border-top: 1px solid var(--axis-color-border-split);
  color: var(--axis-color-text-secondary);
  font-size: var(--axis-font-size-base);
}
</style>
