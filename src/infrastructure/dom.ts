export function selectElementContents(elementId: string) {
  const element = document.getElementById(elementId)
  const body = document.body as any
  let range: any
  let sel: any
  if (document.createRange && window.getSelection) {
    range = document.createRange()
    sel = window.getSelection()
    sel.removeAllRanges()
    try {
      range.selectNodeContents(element)
      sel.addRange(range)
    }
    catch (e) {
      range.selectNode(element)
      sel.addRange(range)
    }
  }
  else if (body.createTextRange) {
    range = body.createTextRange()
    range.moveToElementText(element)
    range.select()
  }
}
