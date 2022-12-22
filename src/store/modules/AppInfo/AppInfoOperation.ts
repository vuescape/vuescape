import { StoreAction } from './StoreAction'
import { StoreGetter } from './StoreGetter'

export class AppInfoOperation {
  public static Action   = StoreAction
  public static Mutation = {}
  public static Getter   = StoreGetter

  private constructor() {
  }
}
