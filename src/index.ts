/**
 * axis-ui 库入口
 *
 * 全量引入:
 *   import AxisUI from 'axis-ui'
 *   import 'axis-ui/dist/style.css'
 *   app.use(AxisUI)
 *
 * 按需引入:
 *   import { AxButton, AxMessage } from 'axis-ui'
 */
import type { App, Plugin } from 'vue'

import './styles/tokens.css'
import './styles/dark.css'
import './styles/base.css'

import AxButton from './components/button/AxButton.vue'
import AxInput from './components/input/AxInput.vue'
import AxSwitch from './components/switch/AxSwitch.vue'
import AxCheckbox from './components/checkbox/AxCheckbox.vue'
import AxCheckboxGroup from './components/checkbox/AxCheckboxGroup.vue'
import AxRadio from './components/radio/AxRadio.vue'
import AxRadioGroup from './components/radio/AxRadioGroup.vue'
import AxSelect from './components/select/AxSelect.vue'
import AxTag from './components/tag/AxTag.vue'
import AxBadge from './components/badge/AxBadge.vue'
import AxAlert from './components/alert/AxAlert.vue'
import AxCard from './components/card/AxCard.vue'
import AxTabs from './components/tabs/AxTabs.vue'
import AxTabPane from './components/tabs/AxTabPane.vue'
import AxRow from './components/grid/AxRow.vue'
import AxCol from './components/grid/AxCol.vue'
import AxTable from './components/table/AxTable.vue'
import AxPagination from './components/pagination/AxPagination.vue'
import AxModal from './components/modal/AxModal.vue'
import AxTooltip from './components/tooltip/AxTooltip.vue'

export { AxMessage } from './components/message/message'
export { setTheme, getTheme, toggleTheme, applyBrandTheme } from './theme'
export type { ThemeMode } from './theme'
export type { SelectOption } from './components/select/AxSelect.vue'
export type { TableColumn } from './components/table/AxTable.vue'

export {
  AxButton,
  AxInput,
  AxSwitch,
  AxCheckbox,
  AxCheckboxGroup,
  AxRadio,
  AxRadioGroup,
  AxSelect,
  AxTag,
  AxBadge,
  AxAlert,
  AxCard,
  AxTabs,
  AxTabPane,
  AxRow,
  AxCol,
  AxTable,
  AxPagination,
  AxModal,
  AxTooltip
}

const components = [
  AxButton,
  AxInput,
  AxSwitch,
  AxCheckbox,
  AxCheckboxGroup,
  AxRadio,
  AxRadioGroup,
  AxSelect,
  AxTag,
  AxBadge,
  AxAlert,
  AxCard,
  AxTabs,
  AxTabPane,
  AxRow,
  AxCol,
  AxTable,
  AxPagination,
  AxModal,
  AxTooltip
]

const AxisUI: Plugin = {
  install(app: App) {
    for (const component of components) {
      app.component((component as { name?: string }).name ?? '', component)
    }
  }
}

export default AxisUI
