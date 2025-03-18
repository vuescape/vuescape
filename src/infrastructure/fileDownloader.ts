import FileSaver from 'file-saver'

export function downloadFile(
  data: string | Uint8Array,
  filename: string,
  shouldAddByteOrderMark = false,
  mimeType               = 'application/octet-stream',
  charset                = 'utf-8',
) {
  const isEmpty =
          (typeof data === 'string' && data.length === 0) ||
          (data instanceof Uint8Array && data.length === 0)

  if (isEmpty) {
    return
  }

  const blob = new Blob([shouldAddByteOrderMark ? '\ufeff' : '', data], { type: `${mimeType}; charset=${charset}` })
  FileSaver.saveAs(blob, filename)
}
