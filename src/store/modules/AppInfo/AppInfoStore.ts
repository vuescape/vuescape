// A bit hacky to import store here but can't perform any operations on class before calling super()
import { GetterTree } from 'vuex'

import { ModuleState, StoreModule } from '@vuescape/store/modules/types'
import { RootState } from '@vuescape/store/RootState'
import { AppInfo } from '@vuescape/types'

import { AppInfoService } from './AppInfoService'
import { StoreAction } from './StoreAction'
import { StoreGetter } from './StoreGetter'

export class AppInfoStore extends StoreModule<AppInfo, ModuleState<AppInfo>, RootState> {
  private myGetters: GetterTree<ModuleState<AppInfo>, RootState> = {
    [StoreGetter.SiteMaintenanceMessage](state: ModuleState<AppInfo>) {
      const result =
        state.asyncResult && state.asyncResult.status === 200 && state.value
          ? state.value.siteMaintenanceMessage
          : undefined
      return result
    },
    [StoreGetter.IsSiteInMaintenanceMode](state: ModuleState<AppInfo>) {
      const result =
        state.asyncResult && state.asyncResult.status === 200 && state.value
          ? state.value.isSiteInMaintenanceMode
          : undefined
      return result
    },
    [StoreGetter.DisabledFeatures](state: ModuleState<AppInfo>) {
      const result =
        state.asyncResult && state.asyncResult.status === 200 && state.value ? state.value.disabledFeatures : []
      return result
    },
    [StoreGetter.Version](state: ModuleState<AppInfo>) {
      const result =
        state.asyncResult && state.asyncResult.status === 200 && state.value ? state.value.version : undefined
      return result
    },
  }

  constructor() {
    super({
      isNamespaced: true,
      asyncActions: {
        [StoreAction.FetchAppInfo]: new AppInfoService().get(),
      },
      shouldUseGlobalNotifications: false,
      shouldUseGlobalSpinner: false,
    })
    this.addGetters(this.myGetters)
  }
}
