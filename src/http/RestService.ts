import { AsyncAction, HttpAsyncAction, HttpMethod } from '.'
import { ServiceBase } from './ServiceBase'

export class RestService<T> extends ServiceBase<T> {
  constructor(
    endpoint: string,
    baseUrl?: string,
    shouldUseCache?: boolean,
    asyncAction?: (httpMethod: HttpMethod, endPoint: string, baseUrl?: string) => AsyncAction<T> | HttpAsyncAction<T>,
  ) {
    super(endpoint, baseUrl, shouldUseCache, asyncAction)
    this.shouldUseCache = shouldUseCache || false
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
