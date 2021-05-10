import { LinkTargetKind } from './LinkTargetKind'

export interface Link {
  title: string
  linkTarget: LinkTargetKind
  source: string
}
