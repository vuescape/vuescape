import { AsyncAction, HttpAsyncAction, HttpMethod, ServiceBase } from '@vuescape/http'
import { AppInfo } from '@vuescape/types'

export class AppInfoService extends ServiceBase<AppInfo> {
  constructor(baseUrl?: string, asyncAction?: (httpMethod: HttpMethod,
    endPoint: string,
    baseUrl?: string,
  ) => AsyncAction<AppInfo> | HttpAsyncAction<AppInfo>) {
    super('/appInfo.json', baseUrl, false, asyncAction)
  }

  public get() {
    const action = this.createAction(HttpMethod.Get, true)
    return action as AsyncAction<AppInfo> | HttpAsyncAction<AppInfo>
  }
}
