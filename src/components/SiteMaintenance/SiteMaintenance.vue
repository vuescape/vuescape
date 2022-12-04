<template>
  <v-layout>
    <v-flex
      xs12
      sm6
      offset-sm3
    >
      <v-card v-if="isPerformingMaintenance === ''">
      </v-card>
      <v-card v-else-if="isPerformingMaintenance === 'true'">
        <div class="site-maintenance__card-div--constrain">
          <img
            :src="siteMaintenanceConfiguration.siteMaintenanceImageUrl"
            class="site-maintenance__card-img--header"
          />
        </div>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">We're Performing Some Maintenance Right Now</h3>
            <div>{{ sitePerformanceMaintenanceMessage }}</div>
          </div>
        </v-card-title>
      </v-card>
      <v-card v-if="wasPreviouslyPerformingMaintenance === true && isPerformingMaintenance === 'false'">
        <div
          style="align:center;"
          class=""
        >
          <img
            :src="siteMaintenanceConfiguration.maintenanceCompleteImageUrl"
            class=""
          />
        </div>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">We Are Back Online!</h3>
            <div>{{ sitePerformanceMaintenanceMessage }}</div>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { AppInfoModuleName } from '@vuescape/store/modules/AppInfo'

@Component
export default class SiteMaintenance extends Vue {
  private isPerformingMaintenance: string = ''
  private wasPreviouslyPerformingMaintenance = false
  private sitePerformanceMaintenanceMessage = ''

  @(namespace('siteMaintenance/configuration')
    .State(
      state => {
        if (state && state.value) {
          const siteMaintenanceConfiguration: any = state.value
          return siteMaintenanceConfiguration || {}
        }
        return {}
      },
    ))
  private siteMaintenanceConfiguration: string

  @(namespace(AppInfoModuleName)
    .State(
      state => {
        const isSiteInMaintenanceMode = state.asyncResult.status === 200 ? state.value.isSiteInMaintenanceMode : undefined
        return isSiteInMaintenanceMode
      },
    ))
  private isSiteInMaintenanceMode?: boolean

  @(namespace(AppInfoModuleName)
    .State(
      state => {
        return state.asyncResult.status === 200 ? state.value.siteMaintenanceMessage : undefined
      },
    ))
  private siteMaintenanceMessage: string

  @Watch('isSiteInMaintenanceMode')
  private onIsSiteInMaintenanceMode(isSiteInMaintenanceMode?: boolean, oldIsSiteInMaintenanceMode?: boolean) {
    if (isSiteInMaintenanceMode !== undefined && isSiteInMaintenanceMode === true) {
      this.wasPreviouslyPerformingMaintenance = true
    }

    if (
      this.isPerformingMaintenance === '' &&
      (this.isSiteInMaintenanceMode && this.isPerformingMaintenance !== this.isSiteInMaintenanceMode.toString())
    ) {
      this.isPerformingMaintenance = this.isSiteInMaintenanceMode.toString()
      this.sitePerformanceMaintenanceMessage = this.siteMaintenanceMessage
    }
    else if (this.isSiteInMaintenanceMode === false && this.wasPreviouslyPerformingMaintenance) {
      this.isPerformingMaintenance = this.isSiteInMaintenanceMode.toString()
      this.sitePerformanceMaintenanceMessage = this.siteMaintenanceMessage
    }
  }

  @Watch('siteMaintenanceMessage')
  private onSiteMaintenanceMessage(siteMaintenanceMessage: string, oldSiteMaintenanceMessage: string) {
    if (
      typeof siteMaintenanceMessage !== 'undefined' &&
      siteMaintenanceMessage !== this.sitePerformanceMaintenanceMessage
    ) {
      this.sitePerformanceMaintenanceMessage = this.siteMaintenanceMessage
    }
  }

  private created() {
    if (
      (typeof this.isSiteInMaintenanceMode === 'undefined' || this.isSiteInMaintenanceMode === false) &&
      this.wasPreviouslyPerformingMaintenance === false
    ) {
      this.$router.push('/')
      return
    }

    if (this.isSiteInMaintenanceMode === true) {
      this.sitePerformanceMaintenanceMessage = this.siteMaintenanceMessage
      this.isPerformingMaintenance = this.isSiteInMaintenanceMode.toString()
      this.wasPreviouslyPerformingMaintenance = true
    }
  }
}
</script>

<style>
.site-maintenance__card-div--constrain {
  overflow: hidden;
  height:   200px;
}
.site-maintenance__card-img--header {
  margin-top: -60px;
  width:      100%;
}
</style>
