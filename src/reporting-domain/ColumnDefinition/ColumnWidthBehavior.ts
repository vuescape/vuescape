/** Represents the width behavior of a cell. */
export enum ColumnWidthBehavior {
  /** None. */
  None = 0,

  /** Fit the cell width to the content. */
  DynamicallySizeToContent,

  /** Fit the cell width to the content up to the supplied width. */
  UseSpecifiedWidth,
}
