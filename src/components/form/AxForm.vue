<script setup lang="ts">
import { computed, onMounted, provide } from 'vue'
import { formKey, type FormItemInstance, type FormRules } from './context'

defineOptions({ name: 'AxForm' })

const props = withDefaults(
  defineProps<{
    /** 表单数据对象(响应式) */
    model?: Record<string, unknown>
    /** 校验规则,按字段名分组 */
    rules?: FormRules
    /** 标签宽度 */
    labelWidth?: string
    /** 标签对齐 */
    labelAlign?: 'left' | 'right'
  }>(),
  { labelWidth: '96px', labelAlign: 'right' }
)

const emit = defineEmits<{ (e: 'submit'): void }>()

const items = new Set<FormItemInstance>()

/* 挂载时快照初始值,供 resetFields 还原 */
let initial: Record<string, unknown> = {}
onMounted(() => {
  if (props.model) initial = JSON.parse(JSON.stringify(props.model))
})

provide(formKey, {
  model: computed(() => props.model),
  rules: computed(() => props.rules),
  labelWidth: computed(() => props.labelWidth),
  labelAlign: computed(() => props.labelAlign),
  registerItem: (item) => items.add(item),
  unregisterItem: (item) => items.delete(item)
})

/** 校验全部字段,全部通过返回 true */
async function validate(): Promise<boolean> {
  const results = await Promise.all([...items].map((item) => item.validate()))
  return results.every(Boolean)
}

/** 清除全部校验状态(不改数据) */
function clearValidate() {
  items.forEach((item) => item.clearValidate())
}

/** 还原为挂载时的初始值并清除校验 */
function resetFields() {
  if (props.model) {
    /* 以 model 的键为准:初始值为 undefined 的字段(JSON 快照会丢失)也要还原 */
    for (const key of Object.keys(props.model)) {
      props.model[key] =
        key in initial ? JSON.parse(JSON.stringify(initial[key])) : undefined
    }
  }
  clearValidate()
}

defineExpose({ validate, clearValidate, resetFields })
</script>

<template>
  <form class="ax-form" novalidate @submit.prevent="emit('submit')">
    <slot />
  </form>
</template>

<style>
.ax-form {
  display: flex;
  flex-direction: column;
  gap: var(--axis-space-5);
}
</style>
