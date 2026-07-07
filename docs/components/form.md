# Form 表单

字段标签(label)、必填星号、校验规则与错误提示的容器组件。必填星号使用 `color-error`(规范:必填标记属于 Error 语义),错误提示为 `font-size-xs` 红色文字。

## 基础用法

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { AxMessage, type FormRules } from 'axis-ui'

const formRef = ref()
const model = reactive({
  name: '',
  city: undefined as string | undefined
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入姓名' },
    { min: 2, max: 10, message: '长度 2–10 个字符' }
  ],
  city: [{ required: true, message: '请选择城市' }]
}

async function submit() {
  if (await formRef.value.validate()) {
    AxMessage.success('提交成功')
  }
}
</script>

<template>
  <ax-form ref="formRef" :model="model" :rules="rules" label-width="80px" @submit="submit">
    <ax-form-item label="姓名" prop="name">
      <ax-input v-model="model.name" placeholder="请输入姓名" />
    </ax-form-item>
    <ax-form-item label="城市" prop="city">
      <ax-select v-model="model.city" :options="cityOptions" />
    </ax-form-item>
    <ax-form-item>
      <ax-button type="primary" native-type="submit">提交</ax-button>
      <ax-button @click="formRef.resetFields()">重置</ax-button>
    </ax-form-item>
  </ax-form>
</template>
```

## 校验触发时机

- **失焦校验**:`AxInput` 失焦、`AxSelect` 选择后自动校验该字段;
- **输入自愈**:字段一旦校验过,后续每次值变化即时重校验,改对了错误提示立即消失;
- **提交校验**:`formRef.validate()` 校验全部字段,返回 `Promise<boolean>`;
- 其他控件(Checkbox/Radio/Switch)的值变化同样被「输入自愈」监听覆盖。

## 自定义校验器

```ts
const rules: FormRules = {
  account: [
    { required: true, message: '请输入账号' },
    {
      validator: async (value) => {
        const taken = await checkAccountTaken(String(value))
        return taken ? '该账号已被占用' : true
      }
    }
  ]
}
```

## API

### Form Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `model` | 表单数据对象(响应式) | `Record<string, unknown>` | — |
| `rules` | 校验规则,按字段名分组 | `FormRules` | — |
| `labelWidth` | 标签宽度 | `string` | `'96px'` |
| `labelAlign` | 标签对齐 | `'left' \| 'right'` | `'right'` |

### Form Events

| 事件 | 说明 |
|------|------|
| `submit` | 原生表单提交(已 preventDefault),配合 `native-type="submit"` 的按钮 |

### Form 方法(通过 ref 调用)

| 方法 | 说明 | 返回 |
|------|------|------|
| `validate()` | 校验全部字段 | `Promise<boolean>` |
| `clearValidate()` | 清除全部校验状态(不改数据) | — |
| `resetFields()` | 还原为挂载时的初始值并清除校验 | — |

### FormItem Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `label` | 字段标签(也可用 `label` 插槽) | `string` | — |
| `prop` | 对应 `model` 的字段名,参与校验必填 | `string` | — |
| `required` | 强制显示必填星号(不传则按规则推断) | `boolean` | — |
| `rules` | 字段级规则,与 `Form.rules[prop]` 合并 | `FormRule[]` | — |
| `labelWidth` | 覆盖 Form 的标签宽度 | `string` | — |

### FormItem 方法(通过 ref 调用)

| 方法 | 说明 | 返回 |
|------|------|------|
| `validate()` | 校验本字段 | `Promise<boolean>` |
| `clearValidate()` | 清除本字段校验状态 | — |

### FormRule 类型

```ts
interface FormRule {
  required?: boolean       // 必填(空值:undefined/null/''/空数组)
  min?: number             // 字符串最小长度 / 数字最小值
  max?: number             // 字符串最大长度 / 数字最大值
  pattern?: RegExp         // 正则(仅对非空字符串生效)
  validator?: (value: unknown) => boolean | string | Promise<boolean | string>
  message?: string         // 校验失败提示
}
type FormRules = Record<string, FormRule[]>
```

### Slots

| 组件 | 插槽 | 说明 |
|------|------|------|
| Form | `default` | 表单项 |
| FormItem | `default` | 控件区 |
| FormItem | `label` | 自定义标签内容 |

### 与控件的联动

`AxInput` / `AxSelect` 位于 `AxFormItem` 内时自动联动:校验失败时进入红色错误态(无需手动传 `status`),失焦/选择时触发校验。手动传入的 `status` 优先级更高。
