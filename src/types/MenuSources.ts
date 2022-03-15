// tslint:disable:no-bitwise
export enum MenuSources {
  None = 0,
  Configuration = 1 << 0,
  RoleBased = 1 << 1,
  Feature = 1 << 2,
  All = Configuration | RoleBased | Feature,
}
