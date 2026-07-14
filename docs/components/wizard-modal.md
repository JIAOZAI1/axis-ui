# WizardModal 向导弹窗

单弹窗内分步推进的链式确认流程:顶部 [Steps 步骤条](./steps.md) 指示进度,底部按钮随步骤变化(上一步 / 下一步 / 完成),支持异步校验拦截。组合自 `AxModal` + `AxSteps`,遮罩默认不可点击关闭(防误触丢失填写内容)。

## 基础用法

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { AxMessage } from 'axis-ui'

const open = ref(false)
const form = reactive({ name: '', env: undefined })

/** 每步进入下一步前的校验,返回 false 拦截 */
async function beforeNext(step: number) {
  if (step === 0 && !form.name) {
    AxMessage.error('请填写任务名称')
    return false
  }
  return true
}

function onFinish() {
  AxMessage.success('发布完成')
}
</script>

<template>
  <ax-button type="primary" @click="open = true">发布向导</ax-button>

  <ax-wizard-modal
    v-model="open"
    title="发布向导"
    :steps="['基本信息', '参数配置', '确认发布']"
    :before-next="beforeNext"
    @finish="onFinish"
  >
    <template #step-0>
      <ax-form-item label="任务名称" required>
        <ax-input v-model="form.name" placeholder="请输入" />
      </ax-form-item>
    </template>
    <template #step-1>
      <ax-form-item label="运行环境">
        <ax-select v-model="form.env" :options="envOptions" />
      </ax-form-item>
    </template>
    <template #step-2>
      即将发布「{{ form.name }}」到 {{ form.env }},确认无误后点击完成。
    </template>
  </ax-wizard-modal>
</template>
```

## 异步校验 / 提交

`beforeNext` 支持返回 Promise,等待期间「下一步/完成」按钮进入加载态;最后一步的 `beforeNext` 可用于提交请求,失败返回 `false` 弹窗不关闭:

```ts
async function beforeNext(step: number) {
  if (step === 2) {
    try {
      await api.publish(form)
      return true       // 通过 → emit finish 并关闭
    } catch {
      AxMessage.error('发布失败,请重试')
      return false      // 拦截,停留在当前步骤
    }
  }
  return true
}
```

## 受控步骤

默认内部管理步骤(每次打开重置到第 0 步);需要外部联动时用 `v-model:step`:

```vue
<ax-wizard-modal v-model="open" v-model:step="step" :steps="steps">…</ax-wizard-modal>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` (v-model) | 显隐 | `boolean` | `false` |
| `title` | 标题(也可用 `title` 插槽) | `string` | — |
| `width` | 面板宽度 | `string` | `'560px'` |
| `steps` | 步骤列表(必填) | `(string \| StepItem)[]` | `[]` |
| `step` (v-model:step) | 当前步骤(0 起);不传则内部管理并在打开时重置 | `number` | — |
| `beforeNext` | 下一步/完成前的钩子,返回 `false` 拦截(支持异步,期间按钮加载) | `(step: number) => boolean \| Promise<boolean>` | — |
| `prevText` / `nextText` / `finishText` | 按钮文案 | `string` | 上一步 / 下一步 / 完成 |

### Events

| 事件 | 说明 |
|------|------|
| `update:modelValue` | 显隐变化 |
| `update:step` | 步骤变化 |
| `finish` | 最后一步通过 `beforeNext` 后触发,随后自动关闭 |
| `cancel` | 右上角关闭(未走完流程) |

### Slots

| 插槽 | 说明 | 作用域参数 |
|------|------|-----------|
| `step-0` / `step-1` / … | 各步骤的内容区 | `{ step }` |
| `title` | 自定义标题 | — |

### 说明

- 遮罩点击不关闭(`maskClosable` 固定为 `false`),避免误触丢失流程数据;右上角 ✕ 仍可退出并触发 `cancel`;
- 「上一步」不走 `beforeNext`,回退无需校验;
- 需要更简单的"串行二次确认"(无分步内容)时,直接连续使用两个 `AxModal` 或等待命令式 confirm API。
