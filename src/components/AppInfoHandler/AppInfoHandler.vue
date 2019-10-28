<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="shouldUpdate"
      persistent
      width="300"
    >
      <v-card>
        <v-card-title
          class="headline app-info-handler__title--heading primary"
          primary-title
        >
          Updates Available
        </v-card-title>

        <v-card-text>
          <p>
            We've been hard at work adding features and fixing issues!
          </p>
          <p>
            To load these updates we do require a refresh of the browser.
          </p>
          <p>
            Click the Refresh Now button below to load the new features in version {{changedVersion}}.
          </p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            Depressed
            @click="reload()"
          >
            Refresh Now
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'
import { AppInfoModuleName, AppInfoOperation, AppInfoStore } from '@vuescape/store/modules/AppInfo'
import { ns } from '@vuescape/store/modules/types'
import { AppInfo } from '@vuescape/types'

@Component
export default class AppInfoPoller extends ComponentBase {
  private shouldUpdate = false
  private changedVersion = ''

  @Prop({ type: String, required: true })
  private siteMaintenanceRoutePath: string

  @Getter(ns(AppInfoModuleName, AppInfoOperation.Getter.Version))
  private version: string | undefined

  @Getter(ns(AppInfoModuleName, AppInfoOperation.Getter.IsSiteInMaintenanceMode))
  private isSiteInMaintenanceMode: boolean

  @Watch('version')
  private onVersionChanged(version: string, oldVersion: string) {
    // First time loaded
    if (version && !this.changedVersion) {
      this.changedVersion = version
    }
    // Version has changed and is different from current version
    else if (version && this.changedVersion && version !== this.changedVersion) {
      this.changedVersion = version
      console.log(`Need to update the app to version ${version}`)
      this.shouldUpdate = true
    }
  }

  private reload() {
    location.reload(true)
  }

  @Watch('isSiteInMaintenanceMode')
  private async onisSiteInMaintenanceModeChanged(isSiteInMaintenanceMode: string, oldisSiteInMaintenanceMode: string) {
    // First time loaded
    if (isSiteInMaintenanceMode && this.$router.currentRoute.path !== this.siteMaintenanceRoutePath) {
      await this.$nextTick()
      this.$router.push(this.siteMaintenanceRoutePath)
    }
  }
}
</script>

<style scoped>
.app-info-handler__title--heading {
  color: white;
}
</style>

    