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

import AxIcon from './components/icon/AxIcon.vue'
import AxButton from './components/button/AxButton.vue'
import AxLink from './components/link/AxLink.vue'
import AxInput from './components/input/AxInput.vue'
import AxForm from './components/form/AxForm.vue'
import AxFormItem from './components/form/AxFormItem.vue'
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
import AxMenu from './components/menu/AxMenu.vue'
import AxSubMenu from './components/menu/AxSubMenu.vue'
import AxMenuItem from './components/menu/AxMenuItem.vue'
import AxSpace from './components/space/AxSpace.vue'
import AxText from './components/typography/AxText.vue'
import AxTitle from './components/typography/AxTitle.vue'
import AxDescriptions from './components/descriptions/AxDescriptions.vue'
import AxDescriptionsItem from './components/descriptions/AxDescriptionsItem.vue'
import AxSteps from './components/steps/AxSteps.vue'
import AxWizardModal from './components/wizard-modal/AxWizardModal.vue'

export { AxMessage } from './components/message/message'
export { setTheme, getTheme, toggleTheme, applyBrandTheme } from './theme'
export type { ThemeMode } from './theme'
export {
  breakpoints,
  containerWidths,
  contentMinWidth,
  layoutSizes,
  mediaUp,
  mediaDown,
  matchBreakpoint
} from './tokens'
export type { Breakpoint } from './tokens'
export type { SelectOption, SelectValue } from './components/select/AxSelect.vue'
export type {
  TableColumn,
  TableSortChangePayload,
  TableSortOrder
} from './components/table/AxTable.vue'
export type { FormRule, FormRules } from './components/form/context'
export type { StepItem } from './components/steps/AxSteps.vue'
export { icons, iconNames } from './components/icon/icons'
export type { IconName } from './components/icon/icons'
export type {
  DescriptionsLayout,
  DescriptionsSize
} from './components/descriptions/context'

export {
  AxIcon,
  AxButton,
  AxLink,
  AxInput,
  AxForm,
  AxFormItem,
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
  AxTooltip,
  AxMenu,
  AxSubMenu,
  AxMenuItem,
  AxSpace,
  AxText,
  AxTitle,
  AxText as AxTypographyText,
  AxTitle as AxTypographyTitle,
  AxDescriptions,
  AxDescriptionsItem,
  AxSteps,
  AxWizardModal
}

const components = [
  AxIcon,
  AxButton,
  AxLink,
  AxInput,
  AxForm,
  AxFormItem,
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
  AxTooltip,
  AxMenu,
  AxSubMenu,
  AxMenuItem,
  AxSpace,
  AxText,
  AxTitle,
  AxDescriptions,
  AxDescriptionsItem,
  AxSteps,
  AxWizardModal
]

const AxisUI: Plugin = {
  install(app: App) {
    for (const component of components) {
      app.component((component as { name?: string }).name ?? '', component)
    }
  }
}

export default AxisUI
