import { ColumnWidthBehavior } from './ColumnWidthBehavior'
import { ColumnWrapBehavior } from './ColumnWrapBehavior'

import { UnitOfMeasure } from '../UnitOfMeasure'

export interface ColumnDefinition {
  /** The cell width behavior */
  columnWidthBehavior: ColumnWidthBehavior
  /** The cell wrap behavior. */
  columnWrapBehavior: ColumnWrapBehavior
  /** The cell width. */
  width?: number
  /** The unit of measure for the width. */
  widthUnitOfMeasure? : UnitOfMeasure
}
