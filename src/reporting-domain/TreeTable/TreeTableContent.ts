import { SortLevel, TreeTableHeaderRow, TreeTableRow } from '.'

import { Dictionary } from '@vuescape/types'

export interface TreeTableContent {
  headers: Array<TreeTableHeaderRow>
  footers: Array<TreeTableRow>
  rows: Array<TreeTableRow>
  shouldScrollVertical: boolean
  shouldScrollHorizontal: boolean
  shouldSyncHeaderScroll: boolean
  shouldSyncFooterScroll: boolean
  shouldIncludeFooter: boolean
  deadAreaColor: string
  maxRows?: number
  cssClass: string
  cssStyles: Dictionary<string>
  sortLevel: SortLevel
}
