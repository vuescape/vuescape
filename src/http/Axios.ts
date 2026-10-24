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

  public static useAuthenticationToken(authToken: string) {
    Axios.instance.defaults.headers.common.Authorization = `Bearer ${authToken}`
  }

  public static useAuthorizationToken(authToken: string) {
    // eslint-disable-next-line dot-notation
    Axios.instance.defaults.headers.common['AuthZ'] = authToken
  }

  public static async initCaching(cacheOptions: CacheOptions) {
    // Cache is axios-extensions' own lru-cache dependency, not whichever lru-cache is hoisted
    const { cacheAdapterEnhancer: cacheAdapter, Cache } =
      await import(/* webpackChunkName: 'axios-extensions' */ 'axios-extensions')

    // axios 1.x defaults.adapter is a list of adapter names; resolve it to the adapter function
    Axios.cacheAdapterFactory = () => cacheAdapter(axios.getAdapter(axios.defaults.adapter), {
      enabledByDefault: cacheOptions.shouldCacheAllRequests,
      cacheFlag       : cacheOptions.cacheFlag,
      defaultCache    : new (Cache as any)({
        ttl: cacheOptions.maxAgeMinutes * 60 * 1000,
        max: cacheOptions.maxSize,
      }),
    })

    Axios.shouldUseCache = true
  }
}
