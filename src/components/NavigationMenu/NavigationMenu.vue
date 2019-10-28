<template>
  <v-toolbar-items>
    <v-toolbar-items
      v-for="menu in menus"
      :key="menu.id"
    >
      <v-menu
        v-if="menu.items"
        open-on-hover
        attach
        bottom
        offset-y
        max-height="500"
        :disabled="isSiteInMaintenanceMode"
      >
        <v-btn
          :aria-label="menu.title"
          flat
          slot="activator"
          style="min-width: 64px"
          :class="{ 'btn--active': isSubItemActive(menu.path) }"
          :disabled="isSiteInMaintenanceMode"
        >{{menu.title}}</v-btn>
        <v-list
          v-if="menu.items"
          light
        >
          <v-list-tile
            :aria-label="menuItem.title"
            v-for="menuItem in menu.items"
            :key="menuItem.id"
            :to="{ path: menuItem.path }"
          >
            <v-list-tile-title :aria-label="menuItem.title">{{menuItem.title}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn
        v-else
        flat
        style="min-width: 64px"
        :title="menu.icon ? menu.title : ''"
        :aria-label="menu.ariaLabel"
        :to="{ path: menu.path }"
        :disabled="isSiteInMaintenanceMode"
      >
        <v-icon
          v-if="menu.icon"
          x-large
          color="primary"
        >{{menu.icon}}</v-icon>
        {{menu.icon ? '' : menu.title}}
      </v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-if="isAuthenticated">
      <v-menu
        open-on-hover
        attach
        bottom
        offset-y
        max-height="500"
        :disabled="isSiteInMaintenanceMode"
      >
        <v-btn
          aria-label="User Menu"
          flat
          slot="activator"
          style="min-width: 64px"
          :disabled="isSiteInMaintenanceMode"
        >
          {{firstName}}
          <v-icon
            x-large
            color="primary"
          >person</v-icon>

        </v-btn>
        <v-list light>
          <v-list-tile
            @click.prevent="redirectAndSignOut"
            :to="{path: '/'}"
          >
            <v-list-tile-title>Sign Out</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
    <!-- TODO: This HACK prevents vuetify menu from going off the screen to the right. Do this properly.  -->
    <div
      v-else
      style="width:100px;"
    >
    </div>
    <v-toolbar-items v-if="isHelpAvailable">
      <v-btn
        title="Help"
        flat
        style="min-width: 64px"
        @click="shouldShowHelp = true"
        :disabled="isSiteInMaintenanceMode"
      >
        <v-icon
          x-large
          color="primary"
        >help</v-icon>
      </v-btn>
    </v-toolbar-items>
    <v-dialog
      v-model="shouldShowHelp"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar
          card
          dark
          color="primary"
        >
          <v-toolbar-title aria-label="Help">Help</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            aria-label="Close"
            icon
            dark
            @click="closeHelp"
          >
            <v-icon aria-label="Close">close</v-icon>
          </v-btn>
        </v-toolbar>
        <div v-if="shouldShowHelp">
          <transition
            name="component-fade"
            mode="in-out"
          >
            <submit-issue></submit-issue>
          </transition>
        </div>
      </v-card>
    </v-dialog>
  </v-toolbar-items>
</template>

<script lang="ts">
import Vue from 'vue'

import { Component, Prop } from 'vue-property-decorator'
import { Action, Getter, namespace, State } from 'vuex-class'

import { AppInfoModuleName, AppInfoOperation } from '@vuescape/store/modules/AppInfo'
import { AuthenticationModuleName, AuthenticationOperation } from '@vuescape/store/modules/Authentication'
import { ns } from '@vuescape/store/modules/types'
import { UserProfileModuleName } from '@vuescape/store/modules/UserProfile'
import { Guid, Menu } from '@vuescape/types'

@Component
export default class NavigationMenu extends Vue {
  @Prop({ required: true })
  private menus: Array<Menu>

  @Prop({ type: Boolean, default: true })
  private isHelpAvailable: boolean

  @Prop()
  private helpComponent: any

  private shouldShowHelp = false
  private activeIndex: string = '/'

  @State
  private isAuthenticated: boolean

  @(namespace(UserProfileModuleName).State(
    state => {
      return state.value.firstName
    },
  ))
  private firstName: string

  @Action(ns(AuthenticationModuleName, AuthenticationOperation.Action.SIGN_OUT))
  private signOut: any

  @Getter(ns(AppInfoModuleName, AppInfoOperation.Getter.IsSiteInMaintenanceMode))
  private isSiteInMaintenanceMode: boolean

  public isSubItemActive(input: string) {
    const paths = (Array.isArray(input) ? input : [input]) as Array<string>
    const isInPath = paths.some(path => {
      return this.$route.path.indexOf(path) === 0 // current path starts with this path string
    })
    return isInPath
  }

  private closeHelp() {
    this.shouldShowHelp = false
  }

  // TODO: Use app config  signOutRedirectUri
  private async redirectAndSignOut() {
    await this.signOut()
    this.$router.push('/sign-in')
    window.location.reload(true)
  }
}
</script>
