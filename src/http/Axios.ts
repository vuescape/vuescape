import axios, { AxiosAdapter, AxiosInstance, AxiosPromise } from 'axios'

export interface CacheOptions {
  maxAgeMinutes: number
  maxSize: number
  shouldCacheAllRequests: boolean
  cacheFlag: string
}

export class Axios {
  private static shouldUseCache = false
  private static cacheAdapterFactory: () => AxiosAdapter
  private static axiosInstance: AxiosInstance

  private constructor() {
  }

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

// tslint:disable-next-line: member-ordering
  public static useAuthenticationToken(authToken: string) {
    Axios.instance.defaults.headers.common.Authorization = `Bearer ${authToken}`
  }

// tslint:disable-next-line: member-ordering
  public static useAuthorizationToken(authToken: string) {
    // tslint:disable-next-line: no-string-literal
    Axios.instance.defaults.headers.common['AuthZ'] = authToken
  }

// tslint:disable-next-line: member-ordering
  public static async initCaching(cacheOptions: CacheOptions) {
    // tslint:disable-next-line: max-line-length
    const cacheAdapter = (await import(/* webpackChunkName: 'axios-extensions' */ 'axios-extensions')).cacheAdapterEnhancer
    const Cache        = (await import(/* webpackChunkName: 'lru-cache' */'lru-cache' as any)).default

    Axios.cacheAdapterFactory = () => cacheAdapter(axios.defaults.adapter!, {
      enabledByDefault: cacheOptions.shouldCacheAllRequests,
      cacheFlag       : cacheOptions.cacheFlag,
      defaultCache    : new (Cache as any)({
        maxAge: cacheOptions.maxAgeMinutes * 60 * 1000,
        max   : cacheOptions.maxSize,
      }),
    })

    Axios.shouldUseCache = true
  }
}
