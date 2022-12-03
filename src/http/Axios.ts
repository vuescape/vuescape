import axios, { AxiosAdapter, AxiosInstance, AxiosPromise } from 'axios'

export interface CacheOptions {
  maxAgeMinutes: number
  maxSize: number
  shouldCacheAllRequests: boolean
  cacheFlag: string
}

export class Axios {
  public static useAuthToken(authToken: string) {
    Axios.instance.defaults.headers.common.Authorization = `Bearer ${authToken}`
  }

  public static async initCaching(cacheOptions: CacheOptions) {
    const cacheAdapter = (await import(/* webpackChunkName: 'axios-extensions' */ 'axios-extensions'))
      .cacheAdapterEnhancer
    const Cache = (await import(/* webpackChunkName: 'lru-cache' */'lru-cache')).default

    Axios.cacheAdapterFactory = () =>
      cacheAdapter(axios.defaults.adapter!, {
        enabledByDefault: cacheOptions.shouldCacheAllRequests,
        cacheFlag: cacheOptions.cacheFlag,
        defaultCache: new Cache<string, AxiosPromise>({
          maxAge: cacheOptions.maxAgeMinutes * 60 * 1000,
          max: cacheOptions.maxSize,
        }),
      })

    Axios.shouldUseCache = true
  }

  private static shouldUseCache = false
  private static cacheAdapterFactory: () => AxiosAdapter

  private static axiosInstance: AxiosInstance

  public static get instance() {
    if (!Axios.axiosInstance) {
      let axiosConfig = {}
      if (Axios.shouldUseCache) {
        axiosConfig = { adapter: Axios.cacheAdapterFactory() }
      }
      this.axiosInstance = axios.create(axiosConfig)
    }

    return this.axiosInstance
  }

  private constructor() {
  }
}
