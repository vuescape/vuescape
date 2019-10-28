import { AsyncAction, HttpAsyncAction, HttpMethod, makeHttpAsyncAction, usingRetryFor } from '.'
export class ServiceBase<T> {
  protected endpoint: string
  protected baseUrl?: string
  protected asyncAction?: (
    httpMethod: HttpMethod,
    endPoint: string,
    baseUrl?: string,
  ) => AsyncAction<T> | HttpAsyncAction<T>

  constructor(
    endpoint: string,
    baseUrl?: string,
    asyncAction?: (httpMethod: HttpMethod, endPoint: string, baseUrl?: string) => AsyncAction<T> | HttpAsyncAction<T>,
  ) {
    this.baseUrl = baseUrl
    this.endpoint = endpoint
    this.asyncAction = asyncAction
  }

  protected createAction(httpMethod: HttpMethod) {
    const action = usingRetryFor(makeHttpAsyncAction<T>(httpMethod, this.endpoint, this.baseUrl))
    return action as AsyncAction<T> | HttpAsyncAction<T>
  }
}
