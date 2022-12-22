import FileSaver from 'file-saver'

export function downloadFile(
  data: string | Uint8Array,
  filename: string,
  shouldAddByteOrderMark = false,
  mimeType               = 'application/octet-stream',
  charset                = 'utf-8',
) {
  if (data) {
    const blob = new Blob([shouldAddByteOrderMark ? '\ufeff' : '', data], { type: `${mimeType}; charset=${charset}` })
    FileSaver.saveAs(blob, filename)
  }
}
