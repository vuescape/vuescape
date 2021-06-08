import { SlidingPaneConfig } from '@vuescape/components/SlidingPanes'

import { Link } from '@vuescape/index'
import { LinkLoadKind } from './LinkLoadKind'

export interface ReportPaneConfig extends SlidingPaneConfig {
  initialPaneLink: Link
  loadLink: LinkLoadKind
}
