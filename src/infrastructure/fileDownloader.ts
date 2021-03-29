import FileSaver from 'file-saver'

export function downloadFile(data: string, isBase64EncodedBinary: boolean, filename: string) {
  data = data || ''
  let downloadedData: Uint8Array | string = data || ''

  if (data) {
    // Do we really need to add newlines when there is a non-zero text file?
    downloadedData = data + '\n\n'
    if (isBase64EncodedBinary) {
      const byteCharacters = atob(data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      downloadedData = new Uint8Array(byteArray)
    }
  } else {
    downloadedData = ''
  }
  const blob = new Blob([downloadedData], { type: 'application/octet-stream; charset=utf-8' })
  FileSaver.saveAs(blob, filename)
}
