/** Represents a Sort Strategy to use when sorting. */
export enum SortComparisonStrategy {
  /** None  */
  None = 0,
  /** Sort using ordinal comparison */
  Default,
  /** Sort string using string sort comparison. */
  StringOrdinal,
  /** Sort string using case insensitive  sort comparison. */
  StringCaseInsensitive,
}
