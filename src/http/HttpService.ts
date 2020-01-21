import { AxiosPromise } from 'axios'

import { Axios } from '.'

import qs from 'qs'

import { HttpMethod } from './HttpMethod'

export class HttpService {
  private baseUrl = ''
  private shouldUseCache: boolean

  public constructor(baseUrl?: string, shouldUseCache = false) {
    if (baseUrl) {
      this.baseUrl = baseUrl
    }
    this.shouldUseCache = shouldUseCache
  }

  public invoke<T>(httpMethod: HttpMethod, endpoint: string, args?: {}) {
    if (httpMethod === HttpMethod.Get) {
      return this.get<T>(endpoint, args)
    } else if (httpMethod === HttpMethod.Post) {
      return this.post<T>(endpoint, args)
    }

    throw new Error(`Unsupported HttpMethod: ${httpMethod}`)
  }

  public get<T>(endpoint: string, args?: any): AxiosPromise<T> {
    let formattedArgs = ''
    if (args) {
      formattedArgs = '?' + qs.stringify(args)
    }
    const axiosConfig = {
      baseURL: this.baseUrl,
      shouldCache: this.shouldUseCache,
    }
    return Axios.instance.get<T>(endpoint + formattedArgs, axiosConfig)
  }

  public post<T>(endpoint: string, args?: any): AxiosPromise<T> {
    const formattedArgs = qs.stringify(args)
    const axiosConfig = {
      baseURL: this.baseUrl,
    }
    return Axios.instance.post<T>(endpoint, formattedArgs, axiosConfig)
  }
}
