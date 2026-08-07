import AxisUI, {
  AxButton,
  AxTable,
  setTheme
} from '@jiaozai1/axis-ui'
import type {
  SelectOption,
  TableColumn,
  ThemeMode
} from '@jiaozai1/axis-ui'

const option: SelectOption = { label: '管理员', value: 'admin' }
const column: TableColumn = { key: 'name', title: '姓名', sortable: true }
const theme: ThemeMode = 'dark'

setTheme(theme)

void [AxisUI, AxButton, AxTable, option, column]
