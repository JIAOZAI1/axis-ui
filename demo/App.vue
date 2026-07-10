<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeUnmount, onMounted, reactive } from 'vue'
import type { FormRules } from 'axis-ui'
import {
  AxMessage,
  applyBrandTheme,
  breakpoints,
  containerWidths,
  layoutSizes,
  matchBreakpoint,
  setTheme,
  type Breakpoint,
  type SelectOption,
  type TableColumn,
  type TableSortOrder
} from 'axis-ui'

/* ---- 主题 ---- */
const dark = ref(false)
function onThemeChange(value: boolean) {
  setTheme(value ? 'dark' : 'light')
}

const brandOptions: SelectOption[] = [
  { label: '科技蓝(默认)', value: 'blue' },
  { label: '极客紫', value: 'purple' },
  { label: '活力橙', value: 'orange' }
]
const brand = ref<string | number | undefined>('blue')
const brandThemes: Record<string, Record<string, string>> = {
  blue: {
    'color-primary': '#1677ff',
    'color-primary-hover': '#4096ff',
    'color-primary-active': '#0958d9',
    'color-primary-bg': '#e6f4ff',
    'color-primary-border': '#91caff'
  },
  purple: {
    'color-primary': '#722ed1',
    'color-primary-hover': '#9254de',
    'color-primary-active': '#531dab',
    'color-primary-bg': '#f9f0ff',
    'color-primary-border': '#d3adf7'
  },
  orange: {
    'color-primary': '#fa8c16',
    'color-primary-hover': '#ffa940',
    'color-primary-active': '#d46b08',
    'color-primary-bg': '#fff7e6',
    'color-primary-border': '#ffd591'
  }
}
function onBrandChange(value: string | number | undefined) {
  if (value) applyBrandTheme(brandThemes[value as string])
}

/* ---- Token 可视化 ---- */
const functionalColors = [
  { name: 'primary', label: '品牌 Primary' },
  { name: 'success', label: 'Success 成功' },
  { name: 'warning', label: 'Warning 警告' },
  { name: 'error', label: 'Error 错误' }
]
const spaces = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16]
const spaceValues: Record<number, string> = {
  1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px',
  6: '24px', 8: '32px', 10: '40px', 12: '48px', 16: '64px'
}
const radii = [
  { token: 'sm', label: 'radius-sm 4px · Tag/Checkbox' },
  { token: 'md', label: 'radius-md 6px · Button/Input' },
  { token: 'lg', label: 'radius-lg 8px · Card/Modal' },
  { token: 'full', label: 'radius-full · 胶囊/头像' }
]
const shadows = [
  { token: 'sm', label: 'shadow-sm · 卡片' },
  { token: 'md', label: 'shadow-md · Dropdown' },
  { token: 'lg', label: 'shadow-lg · Modal' },
  { token: 'overlay', label: 'shadow-overlay · 通知' }
]
/* 断点与容器:实时高亮当前视口所处档位 */
const bpNames = Object.keys(breakpoints) as Breakpoint[]
const currentBp = ref<Breakpoint>('xs')
function updateBp() {
  currentBp.value = [...bpNames].reverse().find((bp) => matchBreakpoint(bp)) ?? 'xs'
}
onMounted(() => {
  updateBp()
  window.addEventListener('resize', updateBp)
})
onBeforeUnmount(() => window.removeEventListener('resize', updateBp))

const fontSizes = [
  { token: 'xs', label: 'font-size-xs 12px · 辅助说明' },
  { token: 'base', label: 'font-size-base 14px · 正文默认' },
  { token: 'lg', label: 'font-size-lg 16px · 强调正文' },
  { token: 'h4', label: 'font-size-h4 20px · 卡片标题' },
  { token: 'h3', label: 'font-size-h3 24px · 区块标题' }
]

/* ---- 表单 ---- */
const inputValue = ref('')
const inputCount = ref('')
const inputSized = ref('')
const switchOn = ref(true)
const switchSm = ref(false)
const checks = ref<(string | number)[]>(['read'])
const radioValue = ref<string | number>('daily')
const selectValue = ref<string | number | undefined>()
const selectSized = ref<string | number | undefined>('shanghai')
const cityOptions: SelectOption[] = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州(暂不可选)', value: 'hangzhou', disabled: true }
]

/* ---- Form 表单校验 ---- */
const formRef = ref()
const formLabelPos = ref<string | number>('left')
const formModel = reactive({
  name: '',
  email: '',
  city: undefined as string | number | undefined,
  agree: [] as (string | number)[]
})
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入姓名' },
    { min: 2, max: 10, message: '长度 2–10 个字符' }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { pattern: /^[\w.+-]+@[\w-]+\.[\w.]+$/, message: '邮箱格式不正确' }
  ],
  city: [{ required: true, message: '请选择城市' }],
  agree: [{ required: true, message: '请先同意用户协议' }]
}
async function submitForm() {
  if (await formRef.value.validate()) {
    AxMessage.success('校验通过,已提交')
  } else {
    AxMessage.error('存在校验不通过的字段')
  }
}

/* ---- Tag 动态标签 ---- */
const tags = ref(['设计 Token', '暗色模式', '主题定制', 'WCAG AA'])
function removeTag(tag: string) {
  tags.value = tags.value.filter((t) => t !== tag)
  AxMessage.info(`已移除「${tag}」`)
}

/* ---- Tabs ---- */
const activeTab = ref<string | number>('spec')

/* ---- Menu ---- */
const menuActive = ref<string | number>('dashboard')
const menuCollapsed = ref(false)
const topMenuActive = ref<string | number>('home')

/* ---- 多页签工作区(Menu + Tabs 联动) ---- */
const wsPages: Record<string, { label: string; desc: string }> = {
  home: { label: '工作台', desc: '固定首页,不可关闭。左侧菜单打开的页面会以页签形式聚合在这里。' },
  users: { label: '用户管理', desc: '用户列表、启停用、重置密码。' },
  roles: { label: '角色权限', desc: '角色与资源点的绑定关系。' },
  logs: { label: '操作日志', desc: '全量审计流水,支持按操作人/时间检索。' },
  settings: { label: '系统设置', desc: '站点参数、通知渠道、安全策略。' }
}
const wsOpen = ref<string[]>(['home'])
const wsActive = ref<string | number>('home')
function wsOpenPage(name: string | number) {
  if (!wsOpen.value.includes(name as string)) wsOpen.value.push(name as string)
  wsActive.value = name
}
function wsClosePage(name: string | number) {
  /* 组件只通知;移除后若关的是激活页,Tabs 自动切到相邻页签 */
  wsOpen.value = wsOpen.value.filter((n) => n !== name)
}

/* ---- Table + Pagination ---- */
const columns: TableColumn[] = [
  { key: 'index', title: '序号', type: 'index', width: 72, align: 'center' },
  { key: 'id', title: 'ID', sortable: true, width: 120 },
  { key: 'name', title: '项目', sortable: true, width: 200 },
  { key: 'owner', title: '负责人', width: 120 },
  { key: 'createdAt', title: '创建时间', sortable: true, width: 180 },
  { key: 'coverage', title: 'Token 覆盖率', sortable: true, align: 'right', width: 140 },
  { key: 'status', title: '状态', align: 'center', width: 100 }
]
const tableData = [
  { id: 'JOB-1001', name: '交易中台 Web', owner: '张三', createdAt: '2026-07-10 09:12', coverage: '98.2%', status: 'success' },
  { id: 'JOB-1002', name: '运营后台', owner: '李四', createdAt: '2026-07-10 10:24', coverage: '91.7%', status: 'success' },
  { id: 'JOB-1003', name: '数据大屏', owner: '王五', createdAt: '2026-07-10 11:08', coverage: '76.4%', status: 'warning' },
  { id: 'JOB-1004', name: '门户官网', owner: '赵六', createdAt: '2026-07-10 11:42', coverage: '43.1%', status: 'error' }
]
const statusText: Record<string, string> = { success: '达标', warning: '整改中', error: '未达标' }
const page = ref(1)
const pageSize = ref(10)
const sort = reactive<{ key: string; order: TableSortOrder }>({ key: '', order: null })
const showEmpty = ref(false)
function loadTableData() {
  AxMessage.info(`服务端排序参数:sortKey=${sort.key || '无'},sortOrder=${sort.order || '无'}`)
}

/* ---- Modal ---- */
const modalOpen = ref(false)
const dangerModalOpen = ref(false)

/* ---- Message 手动关闭 ---- */
let closeLoading: (() => void) | null = null
function showLoading() {
  closeLoading = AxMessage.info('任务处理中,请稍候…', 0)
}
function hideLoading() {
  closeLoading?.()
  closeLoading = null
  AxMessage.success('任务完成')
}
</script>

<template>
  <header class="demo-header">
    <div class="demo-logo">
      <strong>axis-ui</strong>
      <span>企业级 Vue 3 组件库 · 基于设计 Token 体系</span>
    </div>
    <div class="demo-header-actions">
      <div style="width: 160px">
        <ax-select v-model="brand" :options="brandOptions" size="sm" @change="onBrandChange" />
      </div>
      <ax-switch
        v-model="dark"
        checked-text="暗色"
        unchecked-text="亮色"
        @change="onThemeChange"
      />
    </div>
  </header>

  <main class="demo-main">
    <!-- ============ Token ============ -->
    <h2 class="demo-section-title">设计 Token</h2>
    <ax-card title="语义色板" hoverable>
      <div class="demo-swatches">
        <div
          v-for="c in functionalColors"
          :key="c.name"
          class="demo-swatch"
          :style="{ background: `var(--axis-color-${c.name})` }"
        >{{ c.label }}</div>
      </div>
      <p style="color: var(--axis-color-text-secondary); margin-bottom: 0">
        组件与业务代码只消费语义 Token(如
        <code style="font-family: var(--axis-font-family-code)">--axis-color-primary</code>),
        切换右上角的品牌主题或暗色模式时,所有组件零改动自动换肤。
      </p>
    </ax-card>

    <ax-row :gutter="24">
      <ax-col :span="12">
        <ax-card title="间距(8px 网格)">
          <div class="demo-token-list">
            <div v-for="n in spaces" :key="n" class="demo-token-row">
              <span class="demo-token-name">space-{{ n }}</span>
              <span class="demo-space-bar" :style="{ width: `var(--axis-space-${n})` }" />
              <span class="demo-token-value">{{ spaceValues[n] }}</span>
            </div>
          </div>
        </ax-card>
      </ax-col>
      <ax-col :span="12">
        <ax-card title="字号阶梯(基准 14px)">
          <div class="demo-token-list">
            <div
              v-for="f in fontSizes"
              :key="f.token"
              :style="{
                fontSize: `var(--axis-font-size-${f.token})`,
                lineHeight: `var(--axis-line-height-${f.token})`
              }"
            >{{ f.label }}</div>
          </div>
        </ax-card>
      </ax-col>
    </ax-row>

    <ax-row :gutter="24">
      <ax-col :span="12">
        <ax-card title="圆角">
          <div class="demo-block">
            <div
              v-for="r in radii"
              :key="r.token"
              class="demo-radius-box"
              :style="{ borderRadius: `var(--axis-radius-${r.token})` }"
            >{{ r.label }}</div>
          </div>
        </ax-card>
      </ax-col>
      <ax-col :span="12">
        <ax-card title="阴影(只表达漂浮,与 z-index 绑定)">
          <div class="demo-block">
            <div
              v-for="s in shadows"
              :key="s.token"
              class="demo-shadow-box"
              :style="{ boxShadow: `var(--axis-shadow-${s.token})` }"
            >{{ s.label }}</div>
          </div>
        </ax-card>
      </ax-col>
    </ax-row>

    <ax-card title="断点与容器宽度">
      <template #extra>
        <ax-tag type="primary" round>当前视口:{{ currentBp }}(改变窗口宽度试试)</ax-tag>
      </template>
      <div class="demo-token-list">
        <div v-for="bp in bpNames" :key="bp" class="demo-token-row">
          <span class="demo-token-name">screen-{{ bp }}</span>
          <span
            class="demo-space-bar"
            :class="{ 'is-dim': bp !== currentBp }"
            :style="{ width: `${breakpoints[bp] / 12}px` }"
          />
          <span class="demo-token-value">
            ≥ {{ breakpoints[bp] }}px
            <template v-if="bp in containerWidths">
              · 容器 {{ containerWidths[bp as keyof typeof containerWidths] }}px
            </template>
          </span>
        </div>
      </div>
      <p style="color: var(--axis-color-text-secondary); margin: var(--axis-space-4) 0 0">
        <code style="font-family: var(--axis-font-family-code)">.ax-container</code>
        随断点居中限宽;布局框架尺寸:顶栏 {{ layoutSizes.headerHeight }}px、
        侧边栏 {{ layoutSizes.siderWidth }}px(折叠 {{ layoutSizes.siderCollapsedWidth }}px)。
        断点同时以 JS 常量导出(<code style="font-family: var(--axis-font-family-code)">mediaUp('md')</code> /
        <code style="font-family: var(--axis-font-family-code)">matchBreakpoint('xl')</code>)。
      </p>
    </ax-card>

    <!-- ============ Button ============ -->
    <h2 class="demo-section-title">Button 按钮</h2>
    <ax-card>
      <div class="demo-block">
        <span class="demo-block-label">类型</span>
        <ax-button>默认按钮</ax-button>
        <ax-button type="primary">主要按钮</ax-button>
        <ax-button type="success">成功按钮</ax-button>
        <ax-button type="warning">警告按钮</ax-button>
        <ax-button type="danger">危险按钮</ax-button>
        <ax-button type="text">文字按钮</ax-button>
      </div>
      <div class="demo-block">
        <span class="demo-block-label">plain 描边 / 圆角 / 状态</span>
        <ax-button type="primary" plain>Plain</ax-button>
        <ax-button type="danger" plain>Plain 危险</ax-button>
        <ax-button type="primary" round>胶囊按钮</ax-button>
        <ax-button type="primary" loading>提交中</ax-button>
        <ax-button disabled>禁用</ax-button>
        <ax-button type="text" disabled>文字禁用</ax-button>
      </div>
      <div class="demo-block">
        <span class="demo-block-label">尺寸(control-height-sm/md/lg)</span>
        <ax-button type="primary" size="sm">小号 24px</ax-button>
        <ax-button type="primary">中号 32px</ax-button>
        <ax-button type="primary" size="lg">大号 40px</ax-button>
      </div>
      <div class="demo-block">
        <span class="demo-block-label">block 撑满整行</span>
        <ax-button type="primary" block>提交订单</ax-button>
      </div>
    </ax-card>

    <!-- ============ Link ============ -->
    <h2 class="demo-section-title">Link 链接</h2>
    <ax-card>
      <div class="demo-block">
        <span class="demo-block-label">语义色</span>
        <ax-link href="#" type="default">默认</ax-link>
        <ax-link href="#">品牌(默认值)</ax-link>
        <ax-link href="#" type="success">成功</ax-link>
        <ax-link href="#" type="warning">警告</ax-link>
        <ax-link href="#" type="danger">危险</ax-link>
        <ax-link disabled>禁用链接</ax-link>
      </div>
      <div class="demo-block">
        <span class="demo-block-label">下划线策略 / 外链 / 动作链接</span>
        <ax-link href="#" underline="always">始终下划线</ax-link>
        <ax-link href="#" underline="hover">悬浮下划线</ax-link>
        <ax-link href="#" underline="never">无下划线</ax-link>
        <ax-link href="https://github.com/jiaozai1/axis-ui" target="_blank">外部仓库 ↗</ax-link>
        <ax-link @click="AxMessage.info('打开重置密码流程')">忘记密码?(纯动作)</ax-link>
      </div>
      <div class="demo-block" style="align-items: baseline">
        <span class="demo-block-label">字号与字重(size / weight)</span>
        <ax-link href="#" size="xs">辅助 12px</ax-link>
        <ax-link href="#" size="sm">密集 13px</ax-link>
        <ax-link href="#" size="md">正文 14px</ax-link>
        <ax-link href="#" size="lg" weight="medium">强调 16px·Medium</ax-link>
        <ax-link href="#" size="20px" weight="semibold">自定义 20px·Semibold</ax-link>
      </div>
      <div class="demo-block">
        <span class="demo-block-label">嵌入文字流:字号随上下文继承</span>
        <span style="color: var(--axis-color-text-secondary)">
          登录即代表同意<ax-link href="#" underline="always">《用户协议》</ax-link>与
          <ax-link href="#" underline="always">《隐私政策》</ax-link>,遇到问题可
          <ax-link href="#">联系管理员</ax-link>。
        </span>
      </div>
    </ax-card>

    <!-- ============ 表单 ============ -->
    <h2 class="demo-section-title">表单组件</h2>
    <ax-card>
      <ax-row :gutter="24">
        <ax-col :span="12">
          <div class="demo-block">
            <span class="demo-block-label">Input 输入框(可清空)</span>
            <ax-input v-model="inputValue" placeholder="请输入内容" clearable />
          </div>
          <div class="demo-block">
            <span class="demo-block-label">字数统计 / 校验状态</span>
            <ax-input v-model="inputCount" :maxlength="20" show-count placeholder="最多 20 字" />
            <ax-input model-value="校验不通过" status="error" />
            <ax-input model-value="需要注意" status="warning" />
          </div>
          <div class="demo-block">
            <span class="demo-block-label">前后缀插槽 / 禁用</span>
            <ax-input v-model="inputValue" placeholder="搜索关键词">
              <template #prefix>🔍</template>
            </ax-input>
            <ax-input model-value="admin" disabled>
              <template #suffix>@acme.com</template>
            </ax-input>
          </div>
          <div class="demo-block">
            <span class="demo-block-label">尺寸</span>
            <ax-input v-model="inputSized" size="sm" placeholder="小号 24px" style="width: 160px" />
            <ax-input v-model="inputSized" placeholder="中号 32px" style="width: 160px" />
            <ax-input v-model="inputSized" size="lg" placeholder="大号 40px" style="width: 160px" />
          </div>
        </ax-col>
        <ax-col :span="12">
          <div class="demo-block">
            <span class="demo-block-label">Select 选择器(可清空 / 禁用选项)</span>
            <ax-select v-model="selectValue" :options="cityOptions" clearable placeholder="请选择城市" />
          </div>
          <div class="demo-block">
            <span class="demo-block-label">Select 尺寸 / 整体禁用</span>
            <div style="display: flex; gap: var(--axis-space-3); width: 100%">
              <ax-select v-model="selectSized" :options="cityOptions" size="sm" />
              <ax-select v-model="selectSized" :options="cityOptions" size="lg" />
              <ax-select :options="cityOptions" disabled placeholder="禁用" />
            </div>
          </div>
          <div class="demo-block">
            <span class="demo-block-label">Switch 开关(默认 / 文案 / 小号 / 禁用)</span>
            <ax-switch v-model="switchOn" />
            <ax-switch v-model="switchOn" checked-text="开" unchecked-text="关" />
            <ax-switch v-model="switchSm" size="sm" />
            <ax-switch :model-value="true" disabled />
            <ax-switch :model-value="false" disabled />
          </div>
        </ax-col>
      </ax-row>
      <div class="demo-block">
        <span class="demo-block-label">Checkbox 多选(组 / 禁用项 / 半选)</span>
        <ax-checkbox-group v-model="checks">
          <ax-checkbox value="read">已读权限</ax-checkbox>
          <ax-checkbox value="write">写入权限</ax-checkbox>
          <ax-checkbox value="admin">管理权限</ax-checkbox>
          <ax-checkbox value="audit" disabled>审计权限(禁用)</ax-checkbox>
        </ax-checkbox-group>
        <ax-checkbox :model-value="true" indeterminate>半选态</ax-checkbox>
        <span style="color: var(--axis-color-text-tertiary); font-size: var(--axis-font-size-xs)">
          已选:{{ checks.join('、') || '无' }}
        </span>
      </div>
      <div class="demo-block">
        <span class="demo-block-label">Radio 单选(组 / 禁用项)</span>
        <ax-radio-group v-model="radioValue">
          <ax-radio value="daily">每日</ax-radio>
          <ax-radio value="weekly">每周</ax-radio>
          <ax-radio value="monthly">每月</ax-radio>
          <ax-radio value="never" disabled>从不(禁用)</ax-radio>
        </ax-radio-group>
      </div>
    </ax-card>

    <!-- ============ Form ============ -->
    <h2 class="demo-section-title">Form 表单(label + 校验)</h2>
    <ax-card>
      <template #extra>
        <ax-radio-group v-model="formLabelPos">
          <ax-radio value="left">标签在左</ax-radio>
          <ax-radio value="top">标签在上</ax-radio>
        </ax-radio-group>
      </template>
      <ax-row :gutter="48">
        <ax-col :span="14">
          <ax-form
            ref="formRef"
            :model="formModel"
            :rules="formRules"
            :label-position="(formLabelPos as 'left' | 'top')"
            @submit="submitForm"
          >
            <ax-form-item label="姓名" prop="name">
              <ax-input v-model="formModel.name" placeholder="2–10 个字符" clearable />
            </ax-form-item>
            <ax-form-item label="通知接收邮箱地址(工作日生效)" prop="email">
              <ax-input v-model="formModel.email" placeholder="name@example.com" clearable />
            </ax-form-item>
            <ax-form-item label="城市" prop="city">
              <ax-select v-model="formModel.city" :options="cityOptions" clearable placeholder="请选择城市" />
            </ax-form-item>
            <ax-form-item label="协议" prop="agree">
              <ax-checkbox-group v-model="formModel.agree">
                <ax-checkbox value="tos">已阅读并同意《用户协议》</ax-checkbox>
              </ax-checkbox-group>
            </ax-form-item>
            <ax-form-item>
              <div style="display: flex; gap: var(--axis-space-2)">
                <ax-button type="primary" native-type="submit">提交</ax-button>
                <ax-button @click="formRef.resetFields()">重置</ax-button>
                <ax-button type="text" @click="formRef.clearValidate()">仅清除校验</ax-button>
              </div>
            </ax-form-item>
          </ax-form>
        </ax-col>
        <ax-col :span="10">
          <p style="color: var(--axis-color-text-secondary); margin-top: 0">
            失焦即校验;字段校验过一次后,输入时即时重校验(改对了错误立即消失);
            Input/Select 校验失败自动进入红色错误态,必填星号取
            <code style="font-family: var(--axis-font-family-code)">color-error</code>。
          </p>
          <p style="color: var(--axis-color-text-secondary)">
            标签宽度默认取组件 Token
            <code style="font-family: var(--axis-font-family-code)">--ax-form-label-width</code>(96px);
            超宽标签省略号收尾(悬浮「通知接收邮箱…」标签看 title 全文);
            切到「标签在上」适合弹窗内的长标签表单。
          </p>
          <p style="color: var(--axis-color-text-tertiary); font-size: var(--axis-font-size-xs)">
            当前 model:{{ JSON.stringify(formModel) }}
          </p>
        </ax-col>
      </ax-row>
    </ax-card>

    <!-- ============ 展示 ============ -->
    <h2 class="demo-section-title">展示组件</h2>
    <ax-card>
      <div class="demo-block">
        <span class="demo-block-label">Tag 标签(语义色)</span>
        <ax-tag>默认</ax-tag>
        <ax-tag type="primary">品牌</ax-tag>
        <ax-tag type="success">已通过</ax-tag>
        <ax-tag type="warning">待审核</ax-tag>
        <ax-tag type="error">已驳回</ax-tag>
        <ax-tag type="primary" round>胶囊</ax-tag>
      </div>
      <div class="demo-block">
        <span class="demo-block-label">动态标签(closable + close 事件)</span>
        <ax-tag
          v-for="tag in tags"
          :key="tag"
          type="primary"
          closable
          @close="removeTag(tag)"
        >{{ tag }}</ax-tag>
        <ax-button
          v-if="tags.length < 4"
          type="text"
          size="sm"
          @click="tags = ['设计 Token', '暗色模式', '主题定制', 'WCAG AA']"
        >重置</ax-button>
      </div>
      <div class="demo-block">
        <span class="demo-block-label">Badge 徽标(数字 / 封顶 / 圆点 / showZero / 独立)</span>
        <ax-badge :value="5"><ax-button>消息</ax-button></ax-badge>
        <ax-badge :value="128" :max="99"><ax-button>通知</ax-button></ax-badge>
        <ax-badge dot><ax-button>待办</ax-button></ax-badge>
        <ax-badge :value="0" show-zero><ax-button>已清空</ax-button></ax-badge>
        <ax-badge :value="8" type="primary" />
        <ax-badge :value="12" type="success" />
        <ax-badge :value="3" type="warning" />
      </div>
      <div class="demo-block">
        <span class="demo-block-label">Tooltip 文字提示(四方向 / 富内容插槽)</span>
        <ax-tooltip content="出现在上方" placement="top">
          <ax-button>上</ax-button>
        </ax-tooltip>
        <ax-tooltip content="出现在下方" placement="bottom">
          <ax-button>下</ax-button>
        </ax-tooltip>
        <ax-tooltip content="出现在左侧" placement="left">
          <ax-button>左</ax-button>
        </ax-tooltip>
        <ax-tooltip content="出现在右侧" placement="right">
          <ax-button>右</ax-button>
        </ax-tooltip>
        <ax-tooltip placement="bottom">
          <template #content>快捷键 <b>⌘S</b> · Token:shadow-md + z-tooltip</template>
          <ax-button type="primary" plain>富内容</ax-button>
        </ax-tooltip>
      </div>
      <div class="demo-block" style="flex-direction: column; align-items: stretch">
        <span class="demo-block-label">Alert 警告提示(四类语义 / 可关闭 / 无图标 / 插槽描述)</span>
        <ax-alert type="info" title="信息提示" description="中性通知,使用 color-info 语义色。" />
        <ax-alert type="success" title="操作成功" description="Token 覆盖率校验通过,已进入发布流水线。" />
        <ax-alert type="warning" title="即将过期" description="当前 API 凭证将于 7 天后过期。" closable />
        <ax-alert type="error" title="发布被阻断" description="正文对比度 3.8:1,低于 WCAG AA 要求的 4.5:1。" closable />
        <ax-alert type="info" :show-icon="false" title="无图标模式" />
        <ax-alert type="warning" title="配额提醒">
          剩余调用量 <strong>1,024</strong> 次,可前往控制台扩容。(插槽描述)
        </ax-alert>
      </div>
    </ax-card>

    <!-- ============ Card ============ -->
    <h2 class="demo-section-title">Card 卡片</h2>
    <ax-row :gutter="24">
      <ax-col :span="8">
        <ax-card title="基础卡片" hoverable>
          hoverable:悬浮时抬升至 shadow-md。
          <template #footer>更新于 5 分钟前</template>
        </ax-card>
      </ax-col>
      <ax-col :span="8">
        <ax-card title="带操作区" hoverable>
          <template #extra>
            <ax-button type="text" size="sm">查看全部</ax-button>
          </template>
          extra 插槽放置头部右侧操作。
        </ax-card>
      </ax-col>
      <ax-col :span="8">
        <ax-card borderless body-padding="16px">
          <strong>borderless</strong> 无描边纯阴影;
          <code style="font-family: var(--axis-font-family-code)">bodyPadding</code>
          覆盖内容区内边距。
        </ax-card>
      </ax-col>
    </ax-row>

    <!-- ============ Space / Typography / Descriptions ============ -->
    <h2 class="demo-section-title">Space 间距 / Typography 排版 / Descriptions 描述列表</h2>
    <ax-card title="工具栏示例">
      <ax-space justify="space-between" wrap block>
        <ax-space wrap>
          <ax-input placeholder="输入作业 ID 添加" style="width: 220px" />
          <ax-button>添加</ax-button>
          <ax-text type="secondary" size="sm">状态每 5 秒自动刷新</ax-text>
        </ax-space>

        <ax-space>
          <ax-button>刷新</ax-button>
          <ax-button type="primary">新建作业</ax-button>
        </ax-space>
      </ax-space>
      <div style="margin-top: var(--axis-space-4)">
        <ax-space split="/" wrap>
          <ax-link>详情</ax-link>
          <ax-link>日志</ax-link>
          <ax-link>重试</ax-link>
          <ax-link type="danger">停止</ax-link>
        </ax-space>
      </div>
    </ax-card>

    <ax-card title="排版示例">
      <ax-space direction="vertical" align="start" block>
        <ax-title :level="4">作业执行摘要</ax-title>
        <ax-text type="secondary" size="sm">辅助说明、状态文案、错误提示和代码值统一由 AxText 承接。</ax-text>
        <ax-space wrap align="baseline">
          <ax-text type="success" weight="medium">运行正常</ax-text>
          <ax-text type="warning">队列等待 12 个任务</ax-text>
          <ax-text type="error">最近一次回调失败</ax-text>
        </ax-space>
        <ax-text
          code
          ellipsis
          copyable
          text="SamplePlugin.EchoTaskHandler"
          style="max-width: 260px"
          @copy="AxMessage.success('已复制处理器名称')"
        />
        <ax-text
          type="secondary"
          block
          :line-clamp="2"
          text="较长说明文本会在两行后省略,用于列表备注、详情页描述和审计日志摘要。"
        >
          较长说明文本会在两行后省略,用于列表备注、详情页描述和审计日志摘要。
        </ax-text>
      </ax-space>
    </ax-card>

    <ax-card title="详情页信息展示">
      <ax-descriptions title="作业信息" :column="4" size="sm" label-width="88px">
        <template #extra>
          <ax-space size="sm">
            <ax-button size="sm">编辑</ax-button>
            <ax-button size="sm" type="primary">立即执行</ax-button>
          </ax-space>
        </template>
        <ax-descriptions-item label="作业 ID">
          <ax-text code copyable text="job_20260710001" @copy="AxMessage.success('已复制作业 ID')" />
        </ax-descriptions-item>
        <ax-descriptions-item label="调度方式">
          <ax-tag type="primary">Cron 周期</ax-tag>
        </ax-descriptions-item>
        <ax-descriptions-item label="负责人">张三</ax-descriptions-item>
        <ax-descriptions-item label="下次执行">2026-07-10 12:00</ax-descriptions-item>
        <ax-descriptions-item label="回调地址" :span="2">
          <ax-text ellipsis text="https://example.com/hooks/job-result" style="max-width: 100%" />
        </ax-descriptions-item>
        <ax-descriptions-item label="备注" />
      </ax-descriptions>

      <div style="height: var(--axis-space-6)" />

      <ax-descriptions title="账户信息" bordered :column="3" layout="vertical">
        <ax-descriptions-item label="客户名称">Acme Inc.</ax-descriptions-item>
        <ax-descriptions-item label="状态">
          <ax-tag type="success">正常</ax-tag>
        </ax-descriptions-item>
        <ax-descriptions-item label="套餐">Enterprise</ax-descriptions-item>
        <ax-descriptions-item label="账户 ID">
          <ax-text code copyable text="acct_1024" @copy="AxMessage.success('已复制账户 ID')" />
        </ax-descriptions-item>
        <ax-descriptions-item label="创建时间">2026-07-10 12:00</ax-descriptions-item>
        <ax-descriptions-item label="审计策略">保留 180 天</ax-descriptions-item>
      </ax-descriptions>
    </ax-card>

    <!-- ============ Menu ============ -->
    <h2 class="demo-section-title">Menu 菜单</h2>
    <ax-card title="垂直菜单(侧边栏)">
      <template #extra>
        <ax-switch v-model="menuCollapsed" checked-text="已折叠" unchecked-text="展开中" />
      </template>
      <div style="display: flex; gap: var(--axis-space-6); align-items: flex-start">
        <div
          :style="{
            width: menuCollapsed
              ? 'var(--axis-layout-sider-collapsed-width)'
              : 'var(--axis-layout-sider-width)',
            border: '1px solid var(--axis-color-border-split)',
            borderRadius: 'var(--axis-radius-lg)',
            overflow: 'visible',
            transition: 'width var(--axis-motion-duration-mid) var(--axis-motion-ease-in-out)'
          }"
        >
          <ax-menu v-model="menuActive" :collapsed="menuCollapsed" :default-open-keys="['project']">
            <ax-menu-item name="dashboard">
              <template #icon>📊</template>
              工作台
            </ax-menu-item>
            <ax-sub-menu name="project" title="项目管理">
              <template #icon>📁</template>
              <ax-menu-item name="project-list">项目列表</ax-menu-item>
              <ax-menu-item name="project-archive">归档项目</ax-menu-item>
              <ax-sub-menu name="project-settings" title="项目设置">
                <ax-menu-item name="project-members">成员</ax-menu-item>
                <ax-menu-item name="project-perms">权限</ax-menu-item>
              </ax-sub-menu>
            </ax-sub-menu>
            <ax-sub-menu name="release" title="发布中心">
              <template #icon>🚀</template>
              <ax-menu-item name="release-pipeline">流水线</ax-menu-item>
              <ax-menu-item name="release-history">发布历史</ax-menu-item>
            </ax-sub-menu>
            <ax-menu-item name="audit" disabled>
              <template #icon>🔒</template>
              审计日志(无权限)
            </ax-menu-item>
          </ax-menu>
        </div>
        <p style="flex: 1; color: var(--axis-color-text-secondary); margin: 0">
          当前选中:<ax-tag type="primary">{{ menuActive }}</ax-tag><br /><br />
          支持无限层级嵌套,内联模式按深度缩进;后代选中时全部祖先标题高亮品牌色;
          折叠后仅显示图标(宽度取
          <code style="font-family: var(--axis-font-family-code)">--axis-layout-sider-collapsed-width</code>),
          悬浮子菜单以浮层弹出下级。
        </p>
      </div>
    </ax-card>

    <ax-card title="水平菜单(顶栏)" body-padding="0">
      <ax-menu v-model="topMenuActive" mode="horizontal">
        <ax-menu-item name="home">首页</ax-menu-item>
        <ax-sub-menu name="products" title="产品">
          <ax-menu-item name="ui">组件库</ax-menu-item>
          <ax-menu-item name="tokens">设计 Token</ax-menu-item>
          <ax-sub-menu name="solutions" title="解决方案">
            <ax-menu-item name="admin">中后台</ax-menu-item>
            <ax-menu-item name="portal">门户</ax-menu-item>
          </ax-sub-menu>
        </ax-sub-menu>
        <ax-menu-item name="docs">文档</ax-menu-item>
        <ax-menu-item name="about" disabled>关于(禁用)</ax-menu-item>
      </ax-menu>
    </ax-card>

    <!-- ============ Tabs ============ -->
    <h2 class="demo-section-title">Tabs 标签页</h2>
    <ax-card>
      <ax-tabs v-model="activeTab">
        <ax-tab-pane name="spec" label="设计规范">
          Token 采用「全局 → 语义 → 组件」三层结构,业务代码只允许消费语义 Token 与组件 Token。
        </ax-tab-pane>
        <ax-tab-pane name="theme" label="主题定制">
          品牌定制只需提供一份主题包覆盖品牌色,其余 Token 继承默认值,经色板算法派生完整色阶。
        </ax-tab-pane>
        <ax-tab-pane name="a11y" label="无障碍">
          正文对比度 ≥ 4.5:1(WCAG AA);所有动效响应 prefers-reduced-motion 自动降级。
        </ax-tab-pane>
      </ax-tabs>
    </ax-card>

    <!-- ============ 多页签工作区 ============ -->
    <h2 class="demo-section-title">多页签工作区(Menu + Tabs 联动)</h2>
    <ax-card body-padding="0">
      <div style="display: flex; align-items: stretch; min-height: 320px">
        <div style="width: var(--axis-layout-sider-width); border-right: 1px solid var(--axis-color-border-split); flex-shrink: 0">
          <ax-menu :model-value="wsActive" @select="wsOpenPage">
            <ax-menu-item name="home"><template #icon>🏠</template>工作台</ax-menu-item>
            <ax-menu-item name="users"><template #icon>👥</template>用户管理</ax-menu-item>
            <ax-menu-item name="roles"><template #icon>🛡️</template>角色权限</ax-menu-item>
            <ax-menu-item name="logs"><template #icon>📋</template>操作日志</ax-menu-item>
            <ax-menu-item name="settings"><template #icon>⚙️</template>系统设置</ax-menu-item>
          </ax-menu>
        </div>
        <div style="flex: 1; min-width: 0; padding: var(--axis-space-4) var(--axis-space-6)">
          <ax-tabs v-model="wsActive" closable @close="wsClosePage">
            <ax-tab-pane
              v-for="name in wsOpen"
              :key="name"
              :name="name"
              :label="wsPages[name].label"
              :closable="name === 'home' ? false : undefined"
            >
              <p style="margin: 0 0 var(--axis-space-2); font-weight: var(--axis-font-weight-medium)">
                {{ wsPages[name].label }}
              </p>
              <p style="margin: 0; color: var(--axis-color-text-secondary)">
                {{ wsPages[name].desc }}
              </p>
            </ax-tab-pane>
          </ax-tabs>
        </div>
      </div>
    </ax-card>

    <!-- ============ Grid ============ -->
    <h2 class="demo-section-title">Grid 栅格(24 列)</h2>
    <ax-card>
      <div class="demo-block-label" style="margin-bottom: var(--axis-space-2)">等分与偏移</div>
      <ax-row :gutter="16">
        <ax-col :span="6"><div class="demo-col-box">span=6</div></ax-col>
        <ax-col :span="6"><div class="demo-col-box">span=6</div></ax-col>
        <ax-col :span="6"><div class="demo-col-box">span=6</div></ax-col>
        <ax-col :span="6"><div class="demo-col-box">span=6</div></ax-col>
      </ax-row>
      <div style="height: var(--axis-space-3)" />
      <ax-row :gutter="16">
        <ax-col :span="8"><div class="demo-col-box">span=8</div></ax-col>
        <ax-col :span="8" :offset="8"><div class="demo-col-box">span=8 offset=8</div></ax-col>
      </ax-row>
      <div class="demo-block-label" style="margin: var(--axis-space-4) 0 var(--axis-space-2)">justify="center" 居中对齐</div>
      <ax-row :gutter="16" justify="center">
        <ax-col :span="6"><div class="demo-col-box">span=6</div></ax-col>
        <ax-col :span="6"><div class="demo-col-box">span=6</div></ax-col>
      </ax-row>
    </ax-card>

    <!-- ============ Table ============ -->
    <h2 class="demo-section-title">Table 表格 + Pagination 分页</h2>
    <ax-card title="Token 覆盖率看板" hoverable>
      <template #extra>
        <div style="display: flex; align-items: center; gap: var(--axis-space-3)">
          <ax-checkbox v-model="showEmpty">空数据态</ax-checkbox>
          <ax-tag type="primary" round>季度目标 &lt; 5% 硬编码</ax-tag>
        </div>
      </template>
      <ax-table
        v-model:sort-key="sort.key"
        v-model:sort-order="sort.order"
        :columns="columns"
        :data="showEmpty ? [] : tableData"
        :index-offset="(page - 1) * pageSize"
        striped
        @sort-change="loadTableData"
      >
        <template #cell-status="{ value }">
          <ax-tag :type="(value as 'success' | 'warning' | 'error')">
            {{ statusText[value as string] }}
          </ax-tag>
        </template>
      </ax-table>
      <div style="display: flex; justify-content: flex-end; margin-top: var(--axis-space-4)">
        <ax-pagination
          v-model:current="page"
          v-model:page-size="pageSize"
          :total="86"
          show-total
          show-size-changer
        />
      </div>
    </ax-card>

    <ax-card title="bordered + size=sm 密集模式">
      <ax-table
        :columns="columns"
        :data="tableData"
        :index-offset="(page - 1) * pageSize"
        bordered
        size="sm"
      >
        <template #cell-status="{ value }">
          <ax-tag :type="(value as 'success' | 'warning' | 'error')">
            {{ statusText[value as string] }}
          </ax-tag>
        </template>
      </ax-table>
    </ax-card>

    <!-- ============ 反馈 ============ -->
    <h2 class="demo-section-title">反馈组件</h2>
    <ax-card>
      <div class="demo-block">
        <span class="demo-block-label">Message 全局提示(命令式 API)</span>
        <ax-button @click="AxMessage.info('这是一条中性消息')">Info</ax-button>
        <ax-button type="success" plain @click="AxMessage.success('保存成功')">Success</ax-button>
        <ax-button type="warning" plain @click="AxMessage.warning('配额即将用尽')">Warning</ax-button>
        <ax-button type="danger" plain @click="AxMessage.error('请求失败,请重试', 5000)">Error(5s)</ax-button>
      </div>
      <div class="demo-block">
        <span class="demo-block-label">duration=0 + 手动关闭</span>
        <ax-button type="primary" plain @click="showLoading">开始任务</ax-button>
        <ax-button @click="hideLoading">完成任务</ax-button>
      </div>
      <div class="demo-block">
        <span class="demo-block-label">Modal 对话框(默认底部 / 自定义底部)</span>
        <ax-button type="primary" @click="modalOpen = true">发布确认</ax-button>
        <ax-button type="danger" plain @click="dangerModalOpen = true">危险操作(自定义底部)</ax-button>
      </div>
    </ax-card>

    <ax-modal
      v-model="modalOpen"
      title="发布确认"
      @confirm="AxMessage.success('已提交发布')"
      @cancel="AxMessage.info('已取消')"
    >
      <p style="margin: 0 0 var(--axis-space-2)">
        即将发布 <strong>@acme/design-tokens v2.4.0</strong>,包含 3 个新增语义 Token。
      </p>
      <ax-alert type="warning" title="对比度校验" description="流水线将自动校验 WCAG AA,不达标会阻断发布。" :closable="false" />
    </ax-modal>

    <ax-modal v-model="dangerModalOpen" title="删除 Token" width="420px">
      <p style="margin: 0">
        删除 <code style="font-family: var(--axis-font-family-code)">color-brand-legacy</code>
        属于 <strong>major</strong> 变更,需提供 codemod 迁移脚本,确认继续?
      </p>
      <template #footer>
        <ax-button @click="dangerModalOpen = false">再想想</ax-button>
        <ax-button
          type="danger"
          @click="dangerModalOpen = false; AxMessage.success('已删除并生成迁移脚本')"
        >确认删除</ax-button>
      </template>
    </ax-modal>
  </main>

  <footer class="demo-footer">
    axis-ui · 实现自《企业级前端设计规范方案》v1.0 · 文档见 docs/ 目录
  </footer>
</template>
