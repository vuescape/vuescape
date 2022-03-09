import { LinkedResourceOpBase } from './LinkedResourceOpBase'

export interface Feature {
  id: string
  operations: Array<LinkedResourceOpBase>
}
