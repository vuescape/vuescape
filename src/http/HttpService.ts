import { AxiosPromise } from 'axios'

import { Axios } from '.'

import qs from 'qs'

import { HttpMethod } from './HttpMethod'
import { RestPayloadStrategy } from './RestPayloadStrategy'

export class HttpService {
  private readonly baseUrl: string | undefined = ''
  private readonly shouldUseCache: boolean
  private readonly restPayloadStrategy: RestPayloadStrategy

  public constructor(baseUrl?: string, shouldUseCache = false, restPayloadStrategy = RestPayloadStrategy.None) {
    this.baseUrl             = baseUrl || ''
    this.shouldUseCache      = shouldUseCache
    this.restPayloadStrategy = restPayloadStrategy
  }

  public invoke<T>(httpMethod: HttpMethod, endpoint: string, args?: {}, abortController?: AbortController) {
    if (httpMethod === HttpMethod.Get) {
      return this.get<T>(endpoint, args, abortController)
    }
    else if (httpMethod === HttpMethod.Post) {
      return this.post<T>(endpoint, args, abortController)
    }

    throw new Error(`Unsupported HttpMethod: ${httpMethod}`)
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
