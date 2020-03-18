import { AsyncAction, HttpAsyncAction, HttpMethod } from '.'
import { RestPayloadStrategy } from './RestPayloadStrategy'
import { ServiceBase } from './ServiceBase'

export class RestService<T> extends ServiceBase<T> {
  constructor(
    endpoint: string,
    baseUrl?: string,
    shouldUseCache?: boolean,
    asyncAction?: (httpMethod: HttpMethod, endPoint: string, baseUrl?: string) => AsyncAction<T> | HttpAsyncAction<T>,
    restPayloadStrategy?: RestPayloadStrategy,
  ) {
    super(endpoint, baseUrl, shouldUseCache, asyncAction, restPayloadStrategy)
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
