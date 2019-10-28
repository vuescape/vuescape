import { StoreAction } from './StoreAction'
import { StoreMutation } from './StoreMutation'

export class AuthenticationOperation {
  public static Action = StoreAction
  public static Mutation = StoreMutation

  private constructor() {}
}
