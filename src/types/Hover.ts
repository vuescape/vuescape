import { ContentKind } from './ContentKind'

export interface Hover {
  title?: string
  content?: string
  component?: string | (() => Promise<any>)
  contentKind?: ContentKind
}
