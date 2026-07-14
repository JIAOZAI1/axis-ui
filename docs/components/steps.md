# Steps 步骤条

展示流程进度。已完成步骤为品牌浅底 ✓,当前步骤品牌实底,连接线随完成状态变色;图标尺寸取 `icon-size-lg`(24px)。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
const current = ref(1)
</script>

<template>
  <ax-steps :steps="['基本信息', '参数配置', '确认发布']" :current="current" />
</template>
```

## 带描述

```vue
<ax-steps
  :current="1"
  :steps="[
    { title: '基本信息', description: '名称与负责人' },
    { title: '参数配置', description: '运行环境' },
    { title: '确认发布', description: '生成变更单' }
  ]"
/>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `steps` | 步骤列表 | `(string \| StepItem)[]` | `[]` |
| `current` | 当前步骤下标(0 起);之前为已完成,之后为待进行 | `number` | `0` |

### StepItem 类型

```ts
interface StepItem {
  title: string
  description?: string
}
```

### 说明

- 纯展示组件,不响应点击;推进/回退由业务控制 `current`(如配合 [AxWizardModal](./wizard-modal.md) 自动管理);
- 当前步骤带 `aria-current="step"`;
- 全部步骤完成的展示:传 `current = steps.length`(所有节点变为 ✓)。
