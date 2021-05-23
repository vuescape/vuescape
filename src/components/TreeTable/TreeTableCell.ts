import { TreeTableRow } from './TreeTableRow'

import { Dictionary, Hover, Link } from '@vuescape/index'

export interface TreeTableCell {
  id: string
  displayValue?: string
  value: any
  hover?: Hover
  renderer?: string | any
  cssClasses?: string
  colspan?: number
  // Use this for clicking expand/collapse
  onclick?: (row?: TreeTableRow, item?: TreeTableCell) => void
  isVisible?: boolean
  links?: Dictionary<Link>
}
