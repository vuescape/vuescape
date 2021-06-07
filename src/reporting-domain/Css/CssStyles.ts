import { CssStyleWrapper } from './CssStyleWrapper'

export interface CssStyles {
  table?: CssStyleWrapper
  allRows?: Array<CssStyleWrapper>
  allCells?: Array<Array<CssStyleWrapper>>
  currentRow?: CssStyleWrapper
}
