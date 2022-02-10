import { ClientBehavior, TreeTableContent } from ".";
import { ColumnDefinition } from "..";

export interface TreeTable {
  id: string
  columnDefinition: ColumnDefinition
  content: TreeTableContent
  behaviors: Array<ClientBehavior>
}
