import { Dictionary } from "@vuescape/index";

import { UiObject } from "../UiObject/UiObject";

export interface Slots { 
  defaultSlot: string
  slotNameToUiObjectMap: Dictionary<UiObject>
}
