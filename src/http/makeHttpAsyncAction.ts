import { HttpAsyncAction, HttpMethod, HttpService } from '.'

export function makeHttpAsyncAction<T>(
  httpMethod: HttpMethod,
  endpoint: string,
  baseUrl?: string,
  shouldUseCache?: boolean,
) {
  const asyncAction: HttpAsyncAction<T> = (args: any) => {
    const httpService = new HttpService(baseUrl, shouldUseCache)
    return httpService.invoke<T>(httpMethod, endpoint, args)
  }

  return asyncAction
}
