import { AsyncAction, HttpAsyncAction, HttpMethod } from '.'
import { ServiceBase } from './ServiceBase'

export class RestService<T> extends ServiceBase<T> {
  constructor(
    endpoint: string,
    baseUrl?: string,
    asyncAction?: (httpMethod: HttpMethod, endPoint: string, baseUrl?: string) => AsyncAction<T> | HttpAsyncAction<T>,
  ) {
    super(endpoint, baseUrl, asyncAction)
  }

  public get() {
    const action = this.createAction(HttpMethod.Get)
    return action
  }

  public post() {
    const action = this.createAction(HttpMethod.Post)
    return action
  }
}
