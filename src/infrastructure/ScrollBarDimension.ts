export class ScrollBarDimension {
  private scrollBarWidth: number

  constructor() {
    this.measureScrollbarWidth()
  }

  public get width() {
    return this.scrollBarWidth
  }

  private measureScrollbarWidth() {
    // Add temporary box to wrapper
    const scrollBarDiv = document.createElement('div')

    // Make box scrollable
    scrollBarDiv.style.overflow = 'scroll'

    // Append box to document
    document.body.appendChild(scrollBarDiv)

    // Measure inner width of box
    this.scrollBarWidth = scrollBarDiv.offsetWidth - scrollBarDiv.clientWidth

    // Remove box
    document.body.removeChild(scrollBarDiv)
  }
}
