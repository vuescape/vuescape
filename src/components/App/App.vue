<template>
  <div>
    <resize-observer @notify="handleResize"></resize-observer>
    <v-app>
      <transition
        name="app__component--transition"
        mode="out-in"
      >
        <the-header
          ref="theHeader"
          v-if="shouldDisplayHeader"
        ></the-header>
      </transition>
      <v-content class="app__content--height">
        <div
          class="app__container--scroll"
          ref="appContainer"
        >
          <v-container fluid>
            <v-alert
              v-for="notification in notifications"
              :key="notification.key"
              class="app__v-alert--margin"
              transition="fade-transition"
              :value="notification"
              :type="notification.type"
              outline
              dismissible
              @click="notificationClosed(notification.key)"
            >
              {{ notification.message }}
            </v-alert>
            <transition
              name="app__component--transition"
              mode="out-in"
            >
              <router-view></router-view>
            </transition>
          </v-container>
        </div>
      </v-content>
      <v-footer
        fixed
        app
        ref="theFooter"
        :height="36"
        class="v-footer__layout--border"
      >
        <component :is="footerComponent" />
      </v-footer>
    </v-app>
    <component :is="appConfig.value.initializationComponent" />
    <app-info-poller></app-info-poller>
    <app-info-handler :siteMaintenanceRoutePath="siteMaintenanceRoutePath"></app-info-handler>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Inject, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Action, namespace, State } from 'vuex-class'

import { TrackingService } from '@vuescape/analytics'
import ComponentBase from '@vuescape/infrastructure/ComponentBase'
import { RootOperation } from '@vuescape/store/modules/Root'
import { ModuleState, NotificationMessage, ns, StoreOperation } from '@vuescape/store/modules/types'
import { UserProfileModuleName } from '@vuescape/store/modules/UserProfile'
import { Menu } from '@vuescape/types'

import AppInfoHandler from '@vuescape/components/AppInfoHandler'
import AppInfoPoller from '@vuescape/components/AppInfoPoller'
import TheFooter from '@vuescape/components/TheFooter'
import TheHeader from '@vuescape/components/TheHeader'

@Component({
  components: { AppInfoHandler, AppInfoPoller, TheHeader, TheFooter },
})
export default class App extends ComponentBase {
  private userProfileModuleValue: string

  @Inject('trackingService')
  private trackingService: TrackingService

  @Prop({ type: String, default: '/site-maintenance' })
  private siteMaintenanceRoutePath: string

  @State private isAuthenticated: boolean
  @State private hasExternalSessionsInitialized: boolean
  @State private notifications: Array<NotificationMessage>
  @Action(RootOperation.Action.NotificationActions.REMOVE)
  private removeNotification: any

  @(namespace('window/availableHeight').Mutation(StoreOperation.Mutation.SET_VALUE))
  private setAvailableHeight: (availableHeight: Array<number>) => void

  @State('appConfig/configuration')
  private appConfig: ModuleState<any>

  @State('theFooter/configuration')
  private footerConfiguration: ModuleState<any>

  @State(
    (state: ModuleState<any>) => {
      return state && state.value ? state.value : undefined
    },
    { namespace: UserProfileModuleName },
  )

  @(namespace('theHeader/configuration').State(state => {
    if (state && state.value) {
      const headerProps: any = state.value
      return headerProps
    }
  }))
  private theHeaderProps: any

  private get shouldDisplayHeader() {
    return (this.isAuthenticated && this.hasExternalSessionsInitialized) ||
            this.theHeaderProps?.shouldShowHeader === true
  }

  private get footerComponent() {
    if (
      this.footerConfiguration &&
      this.footerConfiguration.value &&
      this.footerConfiguration.value.footerComponentOverride
    ) {
      return this.footerConfiguration.value.footerComponentOverride
    }
    return 'the-footer'
  }

  @Watch('$route')
  private onRouteChanged(to: Route, from: Route) {
    this.trackingService.handleRouteChanged(to, from)
  }

  @Watch('userProfileModuleValue')
  private onUserProfileModuleValueChanged(to?: string, from?: string) {
    // if !from then there was no user profile previously so this is the first time having it loaded
    if (to && !from) {
      this.trackingService.identifyUser(to)
    }
  }

  @Watch('isAuthenticated')
  private async onIsAuthenticatedChanged(val: any, oldVal: any) {
    await this.handleResize()
  }

  private async notificationClosed(notificationKey: string) {
    await this.removeNotification(notificationKey)
  }

  private async handleResize() {
    const availableHeight = await this.getAvailableHeight()
    this.setAvailableHeight([availableHeight])
  }

  private async mounted() {
    const availableHeight = await this.getAvailableHeight()
    this.registerStoreModuleWithInitialValue<Array<number>>('window/availableHeight', [availableHeight])
    // If mounted and user profile exists and tracking provider then identify user
    // This is required because watch of userProfileEmail does not fire if email address was already set so we need to
    // identify/init here as well as in the watcher
    if (this.userProfileModuleValue) {
      this.trackingService.identifyUser(this.userProfileModuleValue)
    } else {
      // Even if no user email init so that any functionality will be available to users
      // even if not signed in (with an email)
      this.trackingService.initializeProvider()
    }
  }

  private async getAvailableHeight() {
    await this.$nextTick()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    const theHeader = this.$refs.theHeader as any
    const theFooter = this.$refs.theFooter as any
    if (theHeader?.$el?.getBoundingClientRect || !theFooter.$el.getBoundingClientRect) {
      return windowHeight
    }
    // A bit of hack here to default these values if no height found.
    // This avoids having to hook into the updated lifecycle event because that fires multiple times while
    // rendering pages.
    // The reason 0 height could be returned because the elements are not fully rendered yet.
    const theHeaderHeight = (theHeader?.$el?.getBoundingClientRect().height as number) || 37
    const theFooterHeight = (theFooter?.$el?.getBoundingClientRect().height as number) || 36
    const contentPane = document.querySelector('main') as Element
    const paddingTop = Number.parseFloat(window.getComputedStyle(contentPane, null).getPropertyValue('padding-top'))
    const availableHeight = windowHeight - theHeaderHeight - theFooterHeight - paddingTop

    return availableHeight
  }
}
</script>

<style>
.v-tab {
  text-transform: none;
}
.v-btn {
  text-transform: none;
}
.v-content {
  flex: unset;
}
.app__sliding-pane--single {
  padding-right: 1em;
  padding-left: 1em;
  margin-right: auto;
  margin-left: auto;
}
.app__sliding-pane--multiple {
  padding-right: 0em;
  padding-left: 0em;
  margin-right: 0px;
  margin-left: 10px;
}
div.container.fluid {
  padding: 0 !important;
  overflow: hidden;
}
div.theme--light.application {
  background-color: white;
}
.v-select__selections {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  font-size: 16.8px !important;
}
div.application {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
.app__v-alert--margin {
  margin-top: 1em;
  margin-right: 10px;
  font-weight: 500;
}
.app__content--height {
  max-height: 100vh !important;
  padding: 0px 0px 36px !important;
}
.app__container--scroll {
  height: 100%;
  overflow-y: auto;
  backface-visibility: hidden;
  margin-left: 8px;
}
.app__component--transition-enter-active,
.app__component--transition-leave-active {
  transition: opacity 0.3s ease;
}
.app__component--transition-enter,
.app__component--transition-leave-to {
  opacity: 0;
}
.app__no-wrap {
  white-space: nowrap;
}
/* Set margin left so that container class does not cause page header to be indented.
   Vuetify seems to add a <div class="container"> when including a template
*/
div.container {
  margin-left: 0;
}
/* Vuetify Datatables are setting overflow which breaks keeping the main content within the viewport (and causes) scrolling so 
 override the builtin in style here 
   TODO : verify this is still true since new Vuetify version has been released. */
.table__overflow {
  overflow-x: inherit !important;
  overflow-y: inherit !important;
}
.v-footer__layout--border {
  border-top: 1px solid #9bdddb;
}
html {
  overflow-y: hidden;
}
body {
  color: #111111;
  line-height: 1.7em;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #b4b4b4;
}
.complete {
  color: green;
}
.failed,
.aborted {
  color: red;
}
.running {
  color: dodgerblue;
}
.status-passed {
  background-color: #b7eebc;
  color: darkgreen !important;
}
.status-failed {
  background-color: #ffbbc0;
  color: darkred !important;
}
table td.very-positive {
  background-color: #6ed071 !important;
  color: darkgreen !important;
}

table td.positive {
  background-color: #b7eebc !important;
  color: darkgreen !important;
}

table td.neutral {
  background-color: #fff2e5 !important;
}

table td.negative {
  background-color: #ffbbc0 !important;
  color: darkred !important;
}

table td.very-negative {
  background-color: #fb7072 !important;
  color: darkred !important;
}

i.material-icons {
  font-size: 16px;
}
@media (min-width: 800) {
  .app__sliding-pane--single {
    width: 770px;
  }
  .app__sliding-pane--multiple {
    width: auto;
  }
}
@media (min-width: 1200px) {
  .app__sliding-pane--single {
    width: 1170px;
  }
  .app__sliding-pane--multiple {
    width: auto;
  }
}
@media (min-width: 1700) {
  .app__sliding-pane--single {
    width: 1500px;
  }
  .app__sliding-pane--multiple {
    width: auto;
  }
}
.app__container--scroll .el-loading-mask svg.circular {
  display: none;
}
.app__container--scroll .el-loading-mask div.el-loading-spinner {
  content: url('./thin-broken-ring-335.gif');
  width: 42px;
  position: absolute;
  left: calc(50% - 21px);
  top: 50%;
}
.app__container--scroll .el-loading-mask {
  background-color: rgba(255, 255, 255, 0);
}
.app__container--scroll .el-loading-spinner .el-loading-text {
  color: #5f6768;
}
.app__container--scroll .el-loading-spinner .path {
  stroke: #5f6768;
}
.v-toolbar__items {
  font-size: 13px;
}
</style>
