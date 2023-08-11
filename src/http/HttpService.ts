import { AxiosPromise } from 'axios'

import { Axios } from '.'

import qs from 'qs'

import { ApiServiceCallInfo } from './ApiServiceCallInfo'
import { HttpMethod } from './HttpMethod'
import { RestPayloadStrategy } from './RestPayloadStrategy'

// We will use local storage instead of vuex because of the difficulty in
// trying to untangle circular references that occur by including storeHelpers.ts and store/index.ts
import ls from 'localstorage-slim'

export class HttpService {
  public static ApiServiceCallNamespace = 'CoMetrics.ApiServiceCall'
  private readonly baseUrl: string | undefined = ''
  private readonly shouldUseCache: boolean
  private readonly restPayloadStrategy: RestPayloadStrategy
private readonly shouldDisableApiUseTracking: boolean

  public constructor(
    baseUrl?: string,
    shouldUseCache = false,
    restPayloadStrategy = RestPayloadStrategy.None,
    shouldDisableApiUseTracking = false) {
    this.baseUrl             = baseUrl || ''
    this.shouldUseCache      = shouldUseCache
    this.restPayloadStrategy = restPayloadStrategy
    this.shouldDisableApiUseTracking = shouldDisableApiUseTracking

    if (!this.shouldDisableApiUseTracking) {
      ls.set<ApiServiceCallInfo>(HttpService.ApiServiceCallNamespace,{ lastCallTime: new Date().getTime() })
    }
  }

  public invoke<T>(httpMethod: HttpMethod, endpoint: string, args?: {}, abortController?: AbortController) {
    let result
    if (httpMethod === HttpMethod.Get) {
      result = this.get<T>(endpoint, args, abortController)
    }
    else if (httpMethod === HttpMethod.Post) {
      result = this.post<T>(endpoint, args, abortController)
    }
    else {
      throw new Error(`Unsupported HttpMethod: ${httpMethod}`)
    }

    if (!this.shouldDisableApiUseTracking) {
      ls.set<ApiServiceCallInfo>(HttpService.ApiServiceCallNamespace, { lastCallTime: new Date().getTime() })
    }
    return result
  }

  public get<T>(endpoint: string, args?: any, abortController?: AbortController): AxiosPromise<T> {
    let queryString       = ''
    let formattedEndpoint = endpoint
    if (args) {
      const formattedArgs: any = JSON.parse(JSON.stringify(args))
      if (// tslint:disable-next-line: no-bitwise
        (this.restPayloadStrategy & RestPayloadStrategy.Url) === RestPayloadStrategy.Url) {
        const keys = Object.keys(formattedArgs)
        for (const key of keys) {
          if (formattedEndpoint.includes(`{:${key}}`)) {
            formattedEndpoint = formattedEndpoint.replace(`{:${key}}`, formattedArgs[key])
            delete formattedArgs[key]
          }
        }
      }

      if (this.restPayloadStrategy === RestPayloadStrategy.None || // tslint:disable-next-line: no-bitwise
        (this.restPayloadStrategy & RestPayloadStrategy.QueryString) === RestPayloadStrategy.QueryString) {
        queryString = '?' + qs.stringify(formattedArgs, { arrayFormat: 'repeat' })
      }
    }

    const axiosConfig   = {
      baseURL    : this.baseUrl,
      shouldCache: this.shouldUseCache,
    } as any
    axiosConfig.headers = { 'Content-Type': 'application/json' }
    axiosConfig.data    = {}
    if (abortController) {
      axiosConfig.signal = abortController.signal
    }
    return Axios.instance.get<T>(formattedEndpoint + queryString, axiosConfig)
  }

  public post<T>(endpoint: string, args?: any, abortController?: AbortController): AxiosPromise<T> {
    let formattedArgs: any
    // tslint:disable-next-line: no-bitwise
    if ((this.restPayloadStrategy & RestPayloadStrategy.PostJson) === RestPayloadStrategy.PostJson) {
      formattedArgs = args
    }
    else {
      formattedArgs = qs.stringify(args, { arrayFormat: 'repeat' }) as any
    }
    const axiosConfig = {
      baseURL: this.baseUrl,
    } as any
    if (abortController) {
      axiosConfig.signal = abortController.signal
    }
    if (this.restPayloadStrategy === RestPayloadStrategy.MultipartFormData) {
      axiosConfig.headers = { 'Content-Type': 'multipart/form-data' }
      formattedArgs       = args
    }
    return Axios.instance.post<T>(endpoint, formattedArgs, axiosConfig)
  }
}
