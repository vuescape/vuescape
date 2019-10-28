export interface TreeTableHeaderRow {
  id: string
  text: string
  cssClasses?: string
  colspan?: number
  // TODO: do we want to support explicit Handlers?  What other event handlers do we want?
  // Also, do we want to support args (e.g. MouseEvent)
  // Also, use lower case onclick since that is correct HTML but perhaps not strictly correct for naming
  onclick?: () => void
  onmouseenter?: () => void
  onmousexit?: () => void
  
}
