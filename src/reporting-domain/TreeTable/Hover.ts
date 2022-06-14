import { HoverContentKind } from './HoverContentKind'

export interface Hover {
  title?: string
  content?: string
  component?: string | (() => Promise<any>)
  contentKind?: HoverContentKind
}
