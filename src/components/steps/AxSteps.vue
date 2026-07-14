<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'AxSteps' })

export interface StepItem {
  title: string
  description?: string
}

const props = withDefaults(
  defineProps<{
    /** 步骤列表,字符串或 { title, description } */
    steps?: (string | StepItem)[]
    /** 当前步骤(0 起) */
    current?: number
  }>(),
  { steps: () => [], current: 0 }
)

const normalized = computed<StepItem[]>(() =>
  props.steps.map((s) => (typeof s === 'string' ? { title: s } : s))
)

function status(index: number): string {
  if (index < props.current) return 'is-finished'
  if (index === props.current) return 'is-active'
  return 'is-wait'
}
</script>

<template>
  <ol class="ax-steps">
    <li
      v-for="(step, index) in normalized"
      :key="index"
      :class="['ax-steps__item', status(index)]"
      :aria-current="index === current ? 'step' : undefined"
    >
      <span class="ax-steps__icon" aria-hidden="true">
        <svg v-if="index < current" viewBox="0 0 12 12" width="12" height="12">
          <path d="M2.5 6.2 5 8.7l4.5-5.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <template v-else>{{ index + 1 }}</template>
      </span>
      <span class="ax-steps__text">
        <span class="ax-steps__title">{{ step.title }}</span>
        <span v-if="step.description" class="ax-steps__desc">{{ step.description }}</span>
      </span>
      <span v-if="index < normalized.length - 1" class="ax-steps__line" />
    </li>
  </ol>
</template>

<style>
.ax-steps {
  display: flex;
  align-items: flex-start;
  gap: var(--axis-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--axis-font-size-base);
}

.ax-steps__item {
  display: flex;
  align-items: center;
  gap: var(--axis-space-2);
  min-width: 0;
}
.ax-steps__item:not(:last-child) {
  flex: 1;
}

.ax-steps__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--axis-icon-size-lg);
  height: var(--axis-icon-size-lg);
  flex-shrink: 0;
  border: 1px solid var(--axis-color-border-default);
  border-radius: var(--axis-radius-full);
  background: var(--axis-color-bg-container);
  color: var(--axis-color-text-tertiary);
  font-size: var(--axis-font-size-xs);
  transition:
    background-color var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out),
    border-color var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out),
    color var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-steps__item.is-active .ax-steps__icon {
  background: var(--axis-color-primary);
  border-color: var(--axis-color-primary);
  color: var(--axis-color-text-inverse);
}
.ax-steps__item.is-finished .ax-steps__icon {
  background: var(--axis-color-primary-bg);
  border-color: var(--axis-color-primary-border);
  color: var(--axis-color-primary);
}

.ax-steps__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ax-steps__title {
  color: var(--axis-color-text-secondary);
  white-space: nowrap;
  transition: color var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-steps__item.is-active .ax-steps__title {
  color: var(--axis-color-text-primary);
  font-weight: var(--axis-font-weight-medium);
}
.ax-steps__item.is-finished .ax-steps__title {
  color: var(--axis-color-text-primary);
}
.ax-steps__desc {
  font-size: var(--axis-font-size-xs);
  line-height: var(--axis-line-height-xs);
  color: var(--axis-color-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ax-steps__line {
  flex: 1;
  height: 1px;
  min-width: var(--axis-space-4);
  background: var(--axis-color-border-split);
  transition: background-color var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out);
}
.ax-steps__item.is-finished .ax-steps__line {
  background: var(--axis-color-primary-border);
}
</style>
