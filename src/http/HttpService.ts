import { AxiosPromise } from 'axios'

import { Axios } from '.'

import qs from 'qs'

import { HttpMethod } from './HttpMethod'
import { RestPayloadStrategy } from './RestPayloadStrategy'

export class HttpService {
  private baseUrl = ''
  private shouldUseCache: boolean
  private restPayloadStrategy: RestPayloadStrategy

  public constructor(baseUrl?: string, shouldUseCache = false, restPayloadStrategy = RestPayloadStrategy.None) {
    if (baseUrl) {
      this.baseUrl = baseUrl
    }
    this.shouldUseCache = shouldUseCache
    this.restPayloadStrategy = restPayloadStrategy
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
    let queryString = ''
    let formattedEndpoint = endpoint
    const formattedArgs : any = JSON.parse(JSON.stringify(args))
    if (formattedArgs) {
      if (
        // tslint:disable-next-line: no-bitwise
        (this.restPayloadStrategy & RestPayloadStrategy.Url) ===
        RestPayloadStrategy.Url
      ) {
        const keys = Object.keys(formattedArgs)
        for (const key of keys) {
          if (formattedEndpoint.includes(`{:${key}}`)) {
            formattedEndpoint = formattedEndpoint.replace(`{:${key}}`, formattedArgs[key]) 
            delete formattedArgs[key]           
          }
        }
      }

      if (
        this.restPayloadStrategy === RestPayloadStrategy.None ||
        // tslint:disable-next-line: no-bitwise
        (this.restPayloadStrategy & RestPayloadStrategy.QueryString) === RestPayloadStrategy.QueryString
      ) {
        queryString = '?' + qs.stringify(formattedArgs)
      }
    }

    const axiosConfig = {
      baseURL: this.baseUrl,
      shouldCache: this.shouldUseCache,
    }
    return Axios.instance.get<T>(formattedEndpoint + queryString, axiosConfig)
  }

  public post<T>(endpoint: string, args?: any): AxiosPromise<T> {
    // TODO: Handle
    const formattedArgs = qs.stringify(args)
    const axiosConfig = {
      baseURL: this.baseUrl,
    }
    return Axios.instance.post<T>(endpoint, formattedArgs, axiosConfig)
  }
}
