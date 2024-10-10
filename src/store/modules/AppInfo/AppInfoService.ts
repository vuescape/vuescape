import { AsyncAction } from '@vuescape/http/AsyncAction'
import { HttpAsyncAction } from '@vuescape/http/HttpAsyncAction'
import { HttpMethod } from '@vuescape/http/HttpMethod'
import { ServiceBase } from '@vuescape/http/ServiceBase'

import { AppInfo } from '@vuescape/types'

export class AppInfoService extends ServiceBase<AppInfo> {
  constructor(baseUrl?: string, asyncAction?: (
    httpMethod: HttpMethod,
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
