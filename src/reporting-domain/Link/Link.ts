import { CssStyles } from '../Css'
import { LinkTarget } from './LinkTarget'

export interface Link {
  source: string
  linkTarget: LinkTarget
  title: string
  activatedCssStyles?: CssStyles
}
