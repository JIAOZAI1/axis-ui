# Descriptions 描述列表

用于展示对象详情信息,例如作业详情、客户详情、账户信息。支持标题、操作区、多列、边框、横向/纵向 label、空值和响应式降列。

## 基础用法

```vue
<ax-descriptions title="作业信息" :column="4" size="sm">
  <ax-descriptions-item label="作业 ID">123</ax-descriptions-item>
  <ax-descriptions-item label="调度方式">
    <ax-tag type="primary">Cron 周期</ax-tag>
  </ax-descriptions-item>
  <ax-descriptions-item label="下次执行">2026-07-10 12:00</ax-descriptions-item>
  <ax-descriptions-item label="备注" />
</ax-descriptions>
```

## 详情页示例

```vue
<ax-card title="客户详情">
  <ax-descriptions bordered :column="3" label-width="112px">
    <template #extra>
      <ax-button size="sm">编辑</ax-button>
    </template>

    <ax-descriptions-item label="客户名称">Acme Inc.</ax-descriptions-item>
    <ax-descriptions-item label="状态">
      <ax-tag type="success">正常</ax-tag>
    </ax-descriptions-item>
    <ax-descriptions-item label="账户 ID">
      <ax-text code copyable text="acct_1024" />
    </ax-descriptions-item>
    <ax-descriptions-item label="负责人">张三</ax-descriptions-item>
    <ax-descriptions-item label="创建时间">2026-07-10 12:00</ax-descriptions-item>
    <ax-descriptions-item label="备注" :span="2">企业版客户,需要保留完整审计日志。</ax-descriptions-item>
  </ax-descriptions>
</ax-card>
```

## 垂直布局

```vue
<ax-descriptions layout="vertical" bordered :column="3">
  <ax-descriptions-item label="任务">清理临时文件</ax-descriptions-item>
  <ax-descriptions-item label="执行器">SamplePlugin.EchoTaskHandler</ax-descriptions-item>
  <ax-descriptions-item label="耗时">340ms</ax-descriptions-item>
</ax-descriptions>
```

## API

### Descriptions Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `title` | 标题,也可用 `title` 插槽 | `string` | — |
| `column` | 每行列数,窄屏自动降为 2 / 1 列 | `number` | `3` |
| `bordered` | 显示边框表格样式 | `boolean` | `false` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `layout` | label 布局 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `labelWidth` | 横向 label 宽度 | `string \| number` | `96px` |
| `emptyText` | 空值展示 | `string` | `'-'` |

### DescriptionsItem Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `label` | 标签,也可用 `label` 插槽 | `string` | — |
| `span` | 占据列数 | `number` | `1` |

### Slots

| 组件 | 插槽 | 说明 |
|------|------|------|
| `AxDescriptions` | `default` | 描述项 |
| `AxDescriptions` | `title` | 自定义标题 |
| `AxDescriptions` | `extra` | 右侧操作区 |
| `AxDescriptionsItem` | `default` | 内容,可放 `AxTag`、`AxLink`、`AxText` 等组件 |
| `AxDescriptionsItem` | `label` | 自定义标签 |
