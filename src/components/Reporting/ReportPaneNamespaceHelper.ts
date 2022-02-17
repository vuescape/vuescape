import { PaneKind } from '.'

export function makeReportPaneNamespace(reportPrefix: string, paneKind: PaneKind, isDownload = false) {
  if (!paneKind) {
    throw new Error('paneKind is required and cannot be ' + PaneKind[PaneKind.None])
  }
  let result = makeReportPaneNamespacePrefix(reportPrefix)
  result += '/' + PaneKind[paneKind].toLowerCase()

  if (isDownload) {
    result += '/download'
  }

  return result
}

export function makeReportPaneNamespacePrefix(reportPrefix: string) {
  const result = reportPrefix + '/reportPanes'
  return result
}
