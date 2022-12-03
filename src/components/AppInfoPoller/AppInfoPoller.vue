<script lang="ts">
import Component from 'vue-class-component'
import { Action } from 'vuex-class'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'
import { AppInfoModuleName, AppInfoOperation, AppInfoStore } from '@vuescape/store/modules/AppInfo'
import { ns } from '@vuescape/store/modules/types'
import { registerDynamicModule } from '@vuescape/store/storeHelpers'

@Component
export default class AppInfoHandler extends ComponentBase {
  private poller: any

  @Action(ns(AppInfoModuleName, AppInfoOperation.Action.FetchAppInfo))
  private fetchAppInfo: any

  private async created() {
    // capture this context for use in setInterval function
    const component = this
    registerDynamicModule(this.$store, AppInfoModuleName, () => new AppInfoStore())

    await component.fetchAppInfo({ q: new Date().getTime() })

    component.poller = setInterval(async () => {
      await component.fetchAppInfo({ q: new Date().getTime() })
    }, 60000) // wait 1 minute.  TODO: this can be props driven
  }

  private beforeDestroy() {
    clearInterval(this.poller)
  }

  // Since no template noop render function keeps things from blowing up
  // tslint:disable-next-line:no-empty
  private render() {
  }
}
</script>
