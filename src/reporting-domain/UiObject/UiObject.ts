import { UiObjectType } from './UiObjectType'

export interface UiObject {
  value: any
  uiObjectType?: UiObjectType
  assemblyQualifiedName?: string
}
