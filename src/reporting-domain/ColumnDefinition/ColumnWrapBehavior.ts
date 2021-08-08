/** Represents cell wrapping behavior. */
export enum ColumnWrapBehavior {
  /** None. */
  None = 0,
  
  /** Wrap the contents of the cell. */
  Wrap,

  /** Don't wrap the contents of the cell and truncate if it doesn't fit. */
  NoWrapAndTruncate,

  /** Don't wrap the contents of the cell and display an ellipsis if it doesn't fit. */
  NoWrapAndDisplayEllipsis,
}
