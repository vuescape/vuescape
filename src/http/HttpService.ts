import axios, { AxiosPromise } from 'axios'
import qs from 'qs'

import { HttpMethod } from './HttpMethod'

export class HttpService {
  public static useAuthToken = (authToken?: string) => {
    axios.defaults.headers.common.Authorization = `Bearer ${authToken}`
    return axios
  }

  private baseUrl = ''

  public constructor(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl
    }
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
    }
    return axios.get<T>(endpoint + formattedArgs, axiosConfig)
  }

  public post<T>(endpoint: string, args?: any): AxiosPromise<T> {
    const formattedArgs = qs.stringify(args)
    const axiosConfig = {
      baseURL: this.baseUrl,
    }
    return axios.post<T>(endpoint, formattedArgs, axiosConfig)
  }
}
