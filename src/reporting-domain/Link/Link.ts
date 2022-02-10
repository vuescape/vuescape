import { CssStyles } from '../Css'
import { LinkTarget } from './LinkTarget'
import { ResourceKind } from './ResourceKind'

export interface Link {
  source: string
  linkTarget: LinkTarget
  title: string
  activatedCssStyles?: CssStyles
  resourceKind: ResourceKind
}
