import FileSaver from 'file-saver'

export function downloadFile(data: string, isBase64EncodedBinary: boolean, filename: string) {
  if (data) {
    let downloadedData: Uint8Array | string
    if (isBase64EncodedBinary) {
      const byteCharacters = atob(data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      downloadedData = new Uint8Array(byteNumbers)
    }
    else {
      downloadedData = data + '\n\n'
    }
    const blob = new Blob([downloadedData], { type: 'application/octet-stream; charset=utf-8' })
    FileSaver.saveAs(blob, filename)
  }
}
