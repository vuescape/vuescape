import { LinkedResourceOpBase } from './LinkedResourceOpBase'
import { ReportPaneKind } from './ReportPaneKind'
import { ReportPaneTitleBarButtons } from './ReportPaneTitleBarButtons'

export interface DisplayReportOp extends LinkedResourceOpBase {
  targetedPaneKind: ReportPaneKind
  initialWidth?: number
  minimumWidth?: number
  maximumWidth?: number
  reportPaneTitleBarButtons?: ReportPaneTitleBarButtons
}
