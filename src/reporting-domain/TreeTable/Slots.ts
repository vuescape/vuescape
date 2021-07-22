import { Dictionary, UiObject } from '@vuescape/index'

export interface Slots {
  activeSlotName: string
  defaultSlotName: string
  slotNameToUiObjectMap: Dictionary<UiObject>
}
