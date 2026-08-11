import type { CSSProperties, InjectionKey, Ref } from 'vue'

export type SplitterDirection = 'horizontal' | 'vertical'
export type SplitterResizeTrigger = 'pointer' | 'keyboard' | 'container'

export interface SplitterResizeEvent {
  /** 被操作分隔条的索引,对应其前方的面板 */
  index: number
  /** 分隔条前方面板的当前像素尺寸 */
  size: number
  /** 所有面板的当前像素尺寸 */
  sizes: number[]
  direction: SplitterDirection
  trigger: SplitterResizeTrigger
}

export interface SplitterPanelRegistration {
  id: string
  getDefaultSize: () => number | undefined
  getMinSize: () => number
  getMaxSize: () => number | undefined
}

export interface SplitterSeparatorState {
  index: number
  min: number
  max: number
  now: number
  disabled: boolean
  controls: string
  label: string
}

export interface SplitterContext {
  direction: Ref<SplitterDirection>
  registerPanel: (panel: SplitterPanelRegistration) => void
  unregisterPanel: (id: string) => void
  requestLayout: () => void
  isLastPanel: (id: string) => boolean
  isActiveSeparator: (id: string) => boolean
  getPanelStyle: (id: string) => CSSProperties
  getSeparatorState: (id: string) => SplitterSeparatorState
  onSeparatorPointerDown: (event: PointerEvent, id: string) => void
  onSeparatorKeydown: (event: KeyboardEvent, id: string) => void
}

export const splitterKey: InjectionKey<SplitterContext> = Symbol('AxSplitter')
