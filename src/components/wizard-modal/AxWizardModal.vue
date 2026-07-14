<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AxModal from '../modal/AxModal.vue'
import AxSteps, { type StepItem } from '../steps/AxSteps.vue'

defineOptions({ name: 'AxWizardModal' })

const props = withDefaults(
  defineProps<{
    /** v-model 控制显隐 */
    modelValue?: boolean
    title?: string
    width?: string
    /** 步骤列表(必填),字符串或 { title, description } */
    steps?: (string | StepItem)[]
    /** 当前步骤(0 起),v-model:step;不传则内部管理,打开时重置为 0 */
    step?: number
    /**
     * 进入下一步/完成前的异步钩子,返回 false(或 Promise<false>)拦截;
     * 常用于当前步骤的表单校验
     */
    beforeNext?: (step: number) => boolean | Promise<boolean>
    prevText?: string
    nextText?: string
    finishText?: string
  }>(),
  {
    modelValue: false,
    width: '560px',
    steps: () => [],
    prevText: '上一步',
    nextText: '下一步',
    finishText: '完成'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:step', step: number): void
  (e: 'finish'): void
  (e: 'cancel'): void
}>()

/* step 受控(传了 step prop)与非受控(内部管理)兼容 */
const innerStep = ref(0)
const current = computed(() => props.step ?? innerStep.value)
const lastIndex = computed(() => Math.max(0, props.steps.length - 1))
const isLast = computed(() => current.value >= lastIndex.value)

function setStep(next: number) {
  innerStep.value = next
  emit('update:step', next)
}

/* 非受控时,每次打开重置回第一步 */
watch(
  () => props.modelValue,
  (open) => {
    if (open && props.step === undefined) innerStep.value = 0
  }
)

const nextLoading = ref(false)

function prev() {
  if (current.value > 0) setStep(current.value - 1)
}

async function next() {
  if (props.beforeNext) {
    nextLoading.value = true
    try {
      const pass = await props.beforeNext(current.value)
      if (pass === false) return
    } finally {
      nextLoading.value = false
    }
  }
  if (isLast.value) {
    emit('finish')
    emit('update:modelValue', false)
  } else {
    setStep(current.value + 1)
  }
}

function onCancel() {
  emit('cancel')
}
</script>

<template>
  <AxModal
    :model-value="modelValue"
    :title="title"
    :width="width"
    :mask-closable="false"
    :show-footer="true"
    @update:model-value="emit('update:modelValue', $event)"
    @cancel="onCancel"
  >
    <template v-if="$slots.title" #title><slot name="title" /></template>

    <AxSteps class="ax-wizard-modal__steps" :steps="steps" :current="current" />
    <div class="ax-wizard-modal__body">
      <!-- 每步内容:#step-0 / #step-1 / … -->
      <slot :name="`step-${current}`" :step="current" />
    </div>

    <template #footer>
      <button
        v-if="current > 0"
        class="ax-modal__btn"
        type="button"
        :disabled="nextLoading"
        @click="prev"
      >{{ prevText }}</button>
      <button
        class="ax-modal__btn ax-modal__btn--primary"
        type="button"
        :disabled="nextLoading"
        @click="next"
      >
        <span v-if="nextLoading" class="ax-wizard-modal__spinner" aria-hidden="true" />
        {{ isLast ? finishText : nextText }}
      </button>
    </template>
  </AxModal>
</template>

<style>
.ax-wizard-modal__steps {
  margin-bottom: var(--axis-space-6);
}

.ax-wizard-modal__body {
  min-height: 96px;
}

.ax-wizard-modal__spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: var(--axis-space-1);
  vertical-align: -2px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: var(--axis-radius-full);
  animation: ax-wizard-spin 0.8s linear infinite;
}
@keyframes ax-wizard-spin {
  to { transform: rotate(360deg); }
}
</style>
