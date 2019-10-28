import { HttpAsyncAction, HttpMethod, HttpService } from '.'

export function makeHttpAsyncAction<T>(httpMethod: HttpMethod, endpoint: string, baseUrl?: string) {
  const asyncAction: HttpAsyncAction<T> = args => {
    const httpService = new HttpService(baseUrl)
    return httpService.invoke<T>(httpMethod, endpoint, args)
  }

  return asyncAction
}
