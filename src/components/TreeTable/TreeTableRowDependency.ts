export interface TreeTableRowDependency {
  targetId: string
  // TODO: This needs to be translated from server TreeTableRowDependencyClientBehavior property
  treeTableRowDependencyBehavior: string
  payload?: any
}
