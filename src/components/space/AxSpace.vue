<script lang="ts">
import { computed, defineComponent, h } from 'vue'
import type { PropType, VNodeChild } from 'vue'

type SpaceSize = 'xs' | 'sm' | 'md' | 'lg'
type SpaceDirection = 'horizontal' | 'vertical'
type SpaceAlign = 'start' | 'center' | 'end' | 'baseline'
type SpaceJustify = 'start' | 'end' | 'center' | 'space-between'

const alignMap: Record<SpaceAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  baseline: 'baseline'
}

const justifyMap: Record<SpaceJustify, string> = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-between': 'space-between'
}

export default defineComponent({
  name: 'AxSpace',
  props: {
    size: {
      type: String as PropType<SpaceSize>,
      default: 'md'
    },
    direction: {
      type: String as PropType<SpaceDirection>,
      default: 'horizontal'
    },
    align: {
      type: String as PropType<SpaceAlign>,
      default: 'center'
    },
    justify: {
      type: String as PropType<SpaceJustify>,
      default: 'start'
    },
    wrap: Boolean,
    block: Boolean,
    split: {
      type: String,
      default: ''
    }
  },
  setup(props, { slots }) {
    const classes = computed(() => [
      'ax-space',
      `ax-space--${props.size}`,
      `ax-space--${props.direction}`,
      {
        'is-wrap': props.wrap,
        'is-block': props.block
      }
    ])

    const style = computed(() => ({
      alignItems: alignMap[props.align],
      justifyContent: justifyMap[props.justify]
    }))

    return () => {
      const children = (slots.default?.() ?? []).filter((child) => {
        if (typeof child === 'string') return child.trim().length > 0
        return true
      })
      const split = slots.split?.() ?? props.split
      const nodes: VNodeChild[] = []

      children.forEach((child, index) => {
        if (index > 0 && split) {
          nodes.push(h('span', { class: 'ax-space__split', 'aria-hidden': 'true' }, split))
        }
        nodes.push(h('span', { class: 'ax-space__item' }, child))
      })

      return h('div', { class: classes.value, style: style.value }, nodes)
    }
  }
})
</script>

<style>
.ax-space {
  --ax-space-gap: var(--axis-space-3);

  display: inline-flex;
  max-width: 100%;
  gap: var(--ax-space-gap);
}

.ax-space--xs { --ax-space-gap: var(--axis-space-1); }
.ax-space--sm { --ax-space-gap: var(--axis-space-2); }
.ax-space--lg { --ax-space-gap: var(--axis-space-4); }

.ax-space--vertical {
  flex-direction: column;
}

.ax-space.is-wrap {
  flex-wrap: wrap;
}

.ax-space.is-block {
  display: flex;
  width: 100%;
}

.ax-space__item {
  display: inline-flex;
  min-width: 0;
}

.ax-space--vertical > .ax-space__item {
  width: 100%;
}

.ax-space__split {
  display: inline-flex;
  flex: none;
  align-items: center;
  color: var(--axis-color-text-tertiary);
}
</style>
