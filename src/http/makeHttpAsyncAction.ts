import { HttpAsyncAction, HttpMethod, HttpService } from '.'
import { RestPayloadStrategy } from './RestPayloadStrategy'

export function makeHttpAsyncAction<T>(
  httpMethod: HttpMethod,
  endpoint: string,
  baseUrl?: string,
  shouldUseCache?: boolean,
  restPayloadStrategy?: RestPayloadStrategy,
  shouldDisableApiUseTracking?: boolean,
) {
  const asyncAction: HttpAsyncAction<T> = (args: any, abortController?: AbortController) => {
    const httpService = new HttpService(baseUrl, shouldUseCache, restPayloadStrategy, shouldDisableApiUseTracking)
    return httpService.invoke<T>(httpMethod, endpoint, args, abortController)
  }

  return asyncAction
}
