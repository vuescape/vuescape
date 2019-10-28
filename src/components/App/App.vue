<template>
  <div>
    <v-app>
      <transition
        name="app__component--transition"
        mode="out-in"
      >
        <the-header ref="header"></the-header>
      </transition>
      <v-content class="app__content--height">
        <div class="app__container--scroll">
          <v-container fluid>
            <v-alert
              v-if="notifications && notifications.length > 0"
              class="app__v-alert--margin caption"
              transition="fade-transition"
              :value="notifications.length > 0"
              :type="notifications[0].type"
              outline
              dismissible
              @click="notificationClosed(notifications[0].key)"
            >
              {{notifications[0].message}}
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
      >
        <the-footer class="the-footer__layout--margin"></the-footer>
      </v-footer>
    </v-app>
    <app-info-poller></app-info-poller>
    <app-info-handler :siteMaintenanceRoutePath="siteMaintenanceRoutePath"></app-info-handler>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

import { RootOperation } from '@vuescape/store/modules/Root'
import { NotificationMessage } from '@vuescape/store/modules/types'
import { Menu } from '@vuescape/types'

const AppInfoHandler = () =>
  import(/* webpackChunkName: 'app-info-handler' */ '@vuescape/components/AppInfoHandler').then(m => m.default)
const AppInfoPoller = () =>
  import(/* webpackChunkName: 'app-info-poller' */ '@vuescape/components/AppInfoPoller').then(m => m.default)
const TheFooter = () =>
  import(/* webpackChunkName: 'the-footer' */ '@vuescape/components/TheFooter').then(m => m.default)
const TheHeader = () =>
  import(/* webpackChunkName: 'the-header' */ '@vuescape/components/TheHeader').then(m => m.default)

@Component({
  components: { AppInfoHandler, AppInfoPoller, TheHeader, TheFooter },
})
export default class App extends Vue {
  @Prop({ type: String, default: '/site-maintenance' })
  private siteMaintenanceRoutePath: string

  @State private isSpinning: boolean
  @State private notifications: Array<NotificationMessage>
  @Action(RootOperation.Action.NotificationActions.REMOVE)
  private removeNotification: any

  private async notificationClosed(notificationKey: string) {
    await this.removeNotification(notificationKey)
  }
}
</script>

<style>
@import url(//fonts.googleapis.com/css?family=Open+Sans);
@import url(//fonts.googleapis.com/css?family=Raleway);
.app__v-alert--margin {
  margin-top: 1em;
}
.the-footer__layout--margin {
  margin-top: 6px;
}
.app__content--height {
  max-height: 100vh !important;
  padding: 58px 0px 32px !important;
}
.app__container--scroll {
  height: 100%;
  overflow-y: scroll;
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
.no-wrap {
  white-space: nowrap;
}
/* Set margin left so that container class does not cause page header to be indented.
   Vuetify seems to add a <div class="container"> when including a template
*/
.container {
  margin-left: 0;
}
/* Vuetify Datatables are setting overflow which breaks keeping the main content within the viewport (and causes) scrolling so 
 override the builtin in style here 
   TODO : verify this is still true since new Vuetify version has been released. */
.table__overflow {
  overflow-x: inherit !important;
  overflow-y: inherit !important;
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
  background-color: #c6efce;
  color: #006100;
}
.status-failed {
  background-color: #ffc7ce;
  color: #9c2d75;
}
</style>
