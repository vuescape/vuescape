import { HttpAsyncAction, HttpMethod, HttpService } from '.'
import { RestPayloadStrategy } from './RestPayloadStrategy'

export function makeHttpAsyncAction<T>(
  httpMethod: HttpMethod,
  endpoint: string,
  baseUrl?: string,
  shouldUseCache?: boolean,
  restPayloadStrategy? : RestPayloadStrategy,
) {
  const asyncAction: HttpAsyncAction<T> = (args: any) => {
    const httpService = new HttpService(baseUrl, shouldUseCache, restPayloadStrategy)
    return httpService.invoke<T>(httpMethod, endpoint, args)
  }

  return asyncAction
}
