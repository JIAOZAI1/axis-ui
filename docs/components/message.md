# Message 全局提示

顶部居中的轻量反馈,命令式 API 调用。浮层使用 `bg-elevated + shadow-overlay + z-message`,出入场动效 `motion-duration-mid`。

## 基础用法

```ts
import { AxMessage } from 'axis-ui'

AxMessage.info('这是一条中性消息')
AxMessage.success('保存成功')
AxMessage.warning('配额即将用尽')
AxMessage.error('请求失败,请重试')
```

## 自定义时长与手动关闭

```ts
AxMessage.error('网络异常', 5000)   // 显示 5 秒

const close = AxMessage.info('处理中…', 0)  // duration=0 不自动关闭
// …
close()  // 手动销毁
```

## API

```ts
AxMessage.info(content: string, duration?: number): () => void
AxMessage.success(content: string, duration?: number): () => void
AxMessage.warning(content: string, duration?: number): () => void
AxMessage.error(content: string, duration?: number): () => void
```

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `content` | 提示内容 | `string` | — |
| `duration` | 自动关闭延时(ms),`0` 表示不自动关闭 | `number` | `3000` |
| 返回值 | 手动销毁函数 | `() => void` | — |

### 说明

- 多条消息在顶部垂直堆叠,先进先出;
- 容器元素在首次调用时惰性创建并复用;
- 消息元素带 `role="status"`,读屏软件可感知。
