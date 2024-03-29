<template>
  <div
    v-on="globalClickHandler ? { click: globalClickHandler } : {}"
  >
    <resize-observer @notify="handleResize"></resize-observer>
    <v-app>
      <component :is="navigationComponentValue"></component>
      <transition
        v-if="shouldDisplayHeader && hasCustomHeader"
        mode="out-in"
        name="app__component--transition"
      >
        <component
          :is="headerComponent"
          v-if="shouldDisplayHeader && hasCustomHeader"
          ref="theHeader"
        ></component>
      </transition>
      <transition
        v-else
        mode="out-in"
        name="app__component--transition"
      >
        <the-header
          v-if="!hasCustomHeader"
          ref="theHeader"
        ></the-header>
      </transition>
      <v-content class="app__content--height">
        <div
          ref="appContainer"
          class="app__container--scroll"
        >
          <v-container fluid>
            <v-alert
              v-for="notification in notifications"
              :key="notification.key"
              :type="notification.type"
              :value="notification"
              class="app__v-alert--margin"
              dismissible
              outline
              transition="fade-transition"
              @click="notificationClosed(notification.key)"
            >
              {{ notification.message }}
            </v-alert>
            <transition
              mode="out-in"
              name="app__component--transition"
            >
              <router-view
                v-if="$route.meta && $route.meta.useNewInstance"
                :key="$route.path"
              ></router-view>
              <router-view
                v-else
                :key="`${$route.name}-${$route.params.portfolioStrategyId}`"
              >
              </router-view>
            </transition>
            <div
              v-if="isHandling"
              v-loading="true"
              :style="`height:${getWindowHeight()}px`"
              class="app__container--scroll"
            >
            </div>
          </v-container>
        </div>
      </v-content>
      <download-snackbar></download-snackbar>
      <v-footer
        ref="theFooter"
        :height="36"
        app
        class="v-footer__layout--border"
        fixed
      >
        <component :is="footerComponent" />
      </v-footer>
    </v-app>
    <component
      :is="appConfig.value.initializationComponent"
      v-if="appConfig && appConfig.value && appConfig.value.initializationComponent"
    />
    <component
      :key="additionalAppComponent.name"
      v-for="additionalAppComponent in additionalAppComponents"
      :is="additionalAppComponent"
      v-if="additionalAppComponents && additionalAppComponents.length"
    />
<!--    <app-info-poller></app-info-poller>-->
    <app-info-handler :siteMaintenanceRoutePath="siteMaintenanceRoutePath"></app-info-handler>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { Component, Inject, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Action, namespace, State } from 'vuex-class'

import { TrackingService } from '@vuescape/analytics'
import ComponentBase from '@vuescape/infrastructure/ComponentBase'
import { RootOperation } from '@vuescape/store/modules/Root'
import { ModuleState, NotificationMessage, StoreOperation } from '@vuescape/store/modules/types'
import { UserProfileModuleName } from '@vuescape/store/modules/UserProfile'

import AppInfoHandler from '@vuescape/components/AppInfoHandler'
import AppInfoPoller from '@vuescape/components/AppInfoPoller'
import TheFooter from '@vuescape/components/TheFooter'
import TheHeader from '@vuescape/components/TheHeader'

const DownloadSnackbar = () => import(/* webpackChunkName: 'download-snackbar' */ '@vuescape/components/DownloadSnackbar').then(
  m => m.default)

@Component({
  components: {
    AppInfoHandler,
    AppInfoPoller,
    DownloadSnackbar,
    TheHeader,
    TheFooter,
  },
})
export default class App extends ComponentBase {

  @Inject('trackingService') private trackingService: TrackingService

  @Inject('navigationComponent') private navigationComponent: Vue

  @Inject('additionalAppComponents')   private additionalAppComponents?: Array<VueConstructor<Vue>>

  @Inject('globalClickHandler') private globalClickHandler: (e: MouseEvent) => void

  @Prop({
    type   : String,
    default: '/site-maintenance',
  }) private siteMaintenanceRoutePath: string

  @State private isAuthenticated: boolean
  @State private notifications: Array<NotificationMessage>
  @Action(RootOperation.Action.NotificationActions.REMOVE) private removeNotification: any

  @State((state: ModuleState<any>) => {
    return state && state.value ? state.value : undefined
  }, { namespace: UserProfileModuleName })
  private userProfileModuleValue: any

  @namespace('window/availableHeight')
    .Mutation(StoreOperation.Mutation.SET_VALUE) private setAvailableHeight: (availableHeight: Array<number>) => void

  @State('appConfig/configuration') private appConfig: ModuleState<any>
  @State('authentication/configuration') private authConfig: ModuleState<any>

  @State('theFooter/configuration') private footerConfiguration: ModuleState<any>
  @State('theHeader/configuration') private headerConfiguration: ModuleState<any>

 @namespace('theHeader/configuration').State(state => {
    if (state && state.value) {
      const headerProps: any = state.value
      return headerProps
    }
  }) private theHeaderProps: any

  private get isHandling() {
    const handlerRoutes = this.authConfig.value.handlerRoutes
    if (handlerRoutes) {
      const result = handlerRoutes.some((_ : string) => this.$route.path?.startsWith(_))
      return result
    }

    return false
  }

  private get navigationComponentValue() {
    return this.navigationComponent
  }

  private get headerComponent() {
    const result = this.headerConfiguration?.value?.headerComponentName
    return result
  }

  private get hasCustomHeader() {
    const result = !!this.headerConfiguration?.value?.headerComponentName
    return result
  }

  private get shouldDisplayHeader() {
    return (this.isAuthenticated  || this.theHeaderProps?.shouldShowHeader === true)
  }

  private get footerComponent() {
    if (this.footerConfiguration && this.footerConfiguration.value && this.footerConfiguration.value.footerComponentOverride) {
      return this.footerConfiguration.value.footerComponentOverride
    }
    return 'the-footer'
  }

  private getWindowHeight() {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    return windowHeight
  }

  @Watch('$route')
  private onRouteChanged(to: Route, from: Route) {
    this.trackingService.handleRouteChanged(to, from)
  }

  @Watch('userProfileModuleValue')
  private onUserProfileModuleValueChanged(to?: any, from?: any) {
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
    }
    else {
      // Even if no user email init so that any functionality will be available to users
      // even if not signed in (with an email)
      this.trackingService.initializeProvider()
    }
  }

  private async getAvailableHeight() {
    const windowHeight = this.getWindowHeight()
    await this.$nextTick()
    const theHeader = this.$refs.theHeader as any
    const theFooter = this.$refs.theFooter as any
    if (!theHeader?.$el?.getBoundingClientRect && !theFooter?.$el?.getBoundingClientRect) {
      return windowHeight
    }
    // A bit of hack here to default these values if no height found.
    // This avoids having to hook into the updated lifecycle event because that fires multiple times while
    // rendering pages.
    // The reason 0 height could be returned because the elements are not fully rendered yet.
    const theHeaderHeight = (theHeader?.$el?.getBoundingClientRect().height as number) || 37
    const theFooterHeight = (theFooter?.$el?.getBoundingClientRect().height as number) || 36
    const contentPane     = document.querySelector('main') as Element
    const paddingTop      = Number.parseFloat(window.getComputedStyle(contentPane, null)
      .getPropertyValue('padding-top'))
    const availableHeight = windowHeight - theHeaderHeight - theFooterHeight - paddingTop

    return availableHeight
  }
}
</script>

<style>
main.v-content {
  container-type: inline-size;
  container-name: main;
}
div.v-menu__content.menuable__content__active {
  border-radius: 5px;
}
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
  padding-left:  1em;
  margin-right:  auto;
  margin-left:   auto;
}
.app__sliding-pane--multiple {
  padding-right: 0em;
  padding-left:  0em;
  margin-right:  10px;
  margin-left:   10px;
}
div.container.fluid {
  padding:  0 !important;
  overflow: hidden;
}
div.theme--light.application {
  background-color: white;
}
.v-select__selections {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  font-size:   16.8px !important;
}
div.application {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
.app__v-alert--margin i.v-icon {
  font-weight: 600;
}
.app__v-alert--margin {
  margin-top:   1em;
  margin-right: 10px;
  font-weight:  500;
}
.app__content--height {
  max-height:     100vh !important;
  padding-bottom: 36px !important;
}
.app__container--scroll {
  height:              100%;
  overflow-y:          auto;
  backface-visibility: hidden;
  margin-left:         0px;
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
  color:       #111111;
  line-height: 1.7em;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius:    8px;
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
  color:            darkgreen !important;
}
.status-failed {
  background-color: #ffbbc0;
  color:            darkred !important;
}
table td.very-positive {
  background-color: #6ed071 !important;
  color:            darkgreen !important;
}

table td.positive {
  background-color: #b7eebc !important;
  color:            darkgreen !important;
}

table td.neutral {
  background-color: #fff2e5 !important;
}

table td.negative {
  background-color: #ffbbc0 !important;
  color:            darkred !important;
}

table td.very-negative {
  background-color: #fb7072 !important;
  color:            darkred !important;
}

i.material-icons {
  font-size: 16px;
}
@container main (min-width: 800px) {
  .app__sliding-pane--single {
    width: 100%;
  }
  .app__sliding-pane--multiple {
    width: auto;
  }
}
@container main (min-width: 1200px) {
  .app__sliding-pane--single {
    width: 1170px;
  }
  .app__sliding-pane--multiple {
    width: auto;
  }
}
/*@container main (min-width: 1700px) {*/
/*  .app__sliding-pane--single {*/
/*    width: 1500px;*/
/*  }*/
/*  .app__sliding-pane--multiple {*/
/*    width: auto;*/
/*  }*/
/*}*/
/*@container main (min-width: 1700px) {*/
/*  .app__sliding-pane--single {*/
/*    width: 1500px;*/
/*  }*/
/*  .app__sliding-pane--multiple {*/
/*    width: auto;*/
/*  }*/
/*}*/
.app__container--scroll .el-loading-mask svg.circular {
  display: none;
}
.app__container--scroll .el-loading-mask div.el-loading-spinner {
  content:  url('./thin-broken-ring-335.gif');
  width:    42px;
  position: absolute;
  left:     calc(50% - 21px);
  top:      50%;
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
/* Force dialog on top -- of pinned navigator */
.v-dialog__content.v-dialog__content--active {
  z-index: 4000 !important;
}
i.v-icon.v-alert__icon {
  font-weight: 900 !important;
}
</style>
