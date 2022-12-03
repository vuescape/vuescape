import { AsyncAction, HttpAsyncAction, HttpMethod, makeHttpAsyncAction, usingRetryFor } from '.'
import { RestPayloadStrategy } from './RestPayloadStrategy'

export class ServiceBase<T> {
  protected endpoint: string
  protected baseUrl?: string
  protected shouldUseCache?: boolean
  protected asyncAction?: (
    httpMethod: HttpMethod,
    endPoint: string,
    baseUrl?: string,
  ) => AsyncAction<T> | HttpAsyncAction<T>
  protected restPayloadStrategy: RestPayloadStrategy

  constructor(
    endpoint: string,
    baseUrl?: string,
    shouldUseCache?: boolean,
    asyncAction?: (httpMethod: HttpMethod, endPoint: string, baseUrl?: string) => AsyncAction<T> | HttpAsyncAction<T>,
    restPayloadStrategy?: RestPayloadStrategy,
  ) {
    this.baseUrl = baseUrl
    this.endpoint = endpoint
    this.shouldUseCache = shouldUseCache
    this.asyncAction = asyncAction
    this.restPayloadStrategy = restPayloadStrategy || RestPayloadStrategy.None
  }

  protected createAction(httpMethod: HttpMethod) {
    const action = usingRetryFor(
      makeHttpAsyncAction<T>(httpMethod, this.endpoint, this.baseUrl, this.shouldUseCache, this.restPayloadStrategy),
    )
    return action as AsyncAction<T> | HttpAsyncAction<T>
  }
}
