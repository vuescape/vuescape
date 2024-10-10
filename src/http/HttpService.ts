import { AxiosPromise, AxiosResponse } from 'axios'

import { Axios } from '.'

import qs from 'qs'

import { HttpMethod } from './HttpMethod'
import { RestPayloadStrategy } from './RestPayloadStrategy'

 import { store } from '../store/index'

import { RootOperation } from '@vuescape/store/modules'

export class HttpService {
  public static LAST_API_SERVICE_CALL_KEY                         = 'LastApiServiceCall'
  // Check every 25 minutes to see if the last API call was made
  private static readonly LONG_RUNNING_METHOD_KEEP_ALIVE_INTERVAL = 1000 * 60 * 25

  private readonly baseUrl: string | undefined = ''
  private readonly shouldUseCache: boolean
  private readonly restPayloadStrategy: RestPayloadStrategy
  private readonly shouldDisableApiUseTracking: boolean

  private httpCallMethodInterval: number

  public constructor(
    baseUrl?: string,
    shouldUseCache              = false,
    restPayloadStrategy         = RestPayloadStrategy.None,
    shouldDisableApiUseTracking = false,
  ) {
    this.baseUrl                     = baseUrl || ''
    this.shouldUseCache              = shouldUseCache
    this.restPayloadStrategy         = restPayloadStrategy
    this.shouldDisableApiUseTracking = shouldDisableApiUseTracking
  }

  public async invoke<T>(httpMethod: HttpMethod, endpoint: string, args?: {}, abortController?: AbortController) {
    let result: AxiosResponse<T>
    try {
      if (!this.shouldDisableApiUseTracking) {
        store.commit(RootOperation.Mutation.LAST_ACTIVITY_TIMESTAMP, Date.now(), { root: true })
        this.httpCallMethodInterval = setInterval(() => {
          console.info('Keep alive for long running method for ' + endpoint)
          store.commit(RootOperation.Mutation.LAST_ACTIVITY_TIMESTAMP, Date.now(), { root: true })
        }, HttpService.LONG_RUNNING_METHOD_KEEP_ALIVE_INTERVAL)
      }

      if (httpMethod === HttpMethod.Get) {
        result = await this.get<T>(endpoint, args, abortController)
      }
      else if (httpMethod === HttpMethod.Post) {
        result = await this.post<T>(endpoint, args, abortController)
      }
      else {
        throw new Error(`Unsupported HttpMethod: ${httpMethod}`)
      }
    }
    finally {
      if (this.httpCallMethodInterval) {
        console.info('Clearing keep alive for long running method for ' + endpoint)
        clearInterval(this.httpCallMethodInterval)
      }
      if (!this.shouldDisableApiUseTracking) {
        console.info('Setting last call time for ' + endpoint)
        store.commit(RootOperation.Mutation.LAST_ACTIVITY_TIMESTAMP, Date.now(), { root: true })
      }
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
