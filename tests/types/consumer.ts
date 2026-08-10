import AxisUI, {
  AxButton,
  AxCollapse,
  AxCollapseItem,
  AxTable,
  AxTextarea,
  setTheme
} from '@jiaozai1/axis-ui'
import type {
  SelectOption,
  CollapseModelValue,
  CollapseType,
  TableColumn,
  TextareaAutosize,
  ThemeMode
} from '@jiaozai1/axis-ui'

const option: SelectOption = { label: '管理员', value: 'admin' }
const column: TableColumn = { key: 'name', title: '姓名', sortable: true }
const theme: ThemeMode = 'dark'
const autosize: TextareaAutosize = { minRows: 2, maxRows: 6 }
const collapseValue: CollapseModelValue = ['details', 2]
const collapseType: CollapseType = 'simple'

setTheme(theme)

void [
  AxisUI,
  AxButton,
  AxCollapse,
  AxCollapseItem,
  AxTable,
  AxTextarea,
  option,
  column,
  autosize,
  collapseValue,
  collapseType
]
