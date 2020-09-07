<template>
  <v-toolbar-items>
    <v-toolbar-items v-for="menu in menus" :key="menu.id">
      <v-divider v-if="menu.isDivider" class="mx-3" inset vertical></v-divider>
      <v-menu v-if="!menu.isDivider && menu.items" auto open-on-click offset-y :disabled="isSiteInMaintenanceMode">
        <v-btn
          :aria-label="menu.title"
          flat
          slot="activator"
          :class="{ 'v-btn--active': isSubItemActive(menu.path), 'navigation-menu__v-btn--style': true }"
          :disabled="isSiteInMaintenanceMode"
        >
          <span v-if="menu.prefixHtml" v-html="menu.prefixHtml"></span>
          <!-- <font-awesome-icon v-if="menu.icon" :icon="menu.icon.split(' ')" class="navigation-menu__v-icon--layout" :style="{ color: '#555' }" /> -->
          <font-awesome-icon
            v-if="menu.icon"
            :icon="getIconArray(menu.icon)"
            class="navigation-menu__v-icon--layout"
            :style="{ color: '#555' }"
          />&nbsp;{{ menu.title }} &nbsp;
          <v-icon v-if="menu.icon" small color="#555" class="navigation-menu__v-icon--dropdown"
            >fas fa-caret-down</v-icon
          ></v-btn
        >
        <v-list class="navigation-menu__v-list--alignment" v-if="menu.items" light>
          <v-list-tile
            class="navigation-menu__v-list-tile--font"
            :aria-label="menuItem.ariaLabel || menuItem.title"
            v-for="menuItem in menu.items"
            :key="menuItem.id"
            :to="{ path: menuItem.path }"
          >
            <v-list-tile-title :aria-label="menuItem.ariaLabel || menuItem.title">{{
              menuItem.title
            }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn
        v-if="!menu.isDivider && !menu.items"
        flat
        class="navigation-menu__v-btn--style"
        :title="menu.icon ? menu.title : ''"
        :aria-label="menu.ariaLabel || menu.title"
        :to="{ path: menu.path }"
        :disabled="isSiteInMaintenanceMode"
      >
        <font-awesome-icon
          class="navigation-menu__v-icon--layout"
          v-if="menu.icon"
          :style="{ color: '#555' }"
          :icon="getIconArray(menu.icon)"
        />
        <!-- <v-icon v-if="menu.icon" small class="navigation-menu__v-icon--layout">{{ menu.icon }}</v-icon> -->
        &nbsp;{{ menu.title }}
      </v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-if="isAuthenticated">
      <v-divider class="mx-3" inset vertical></v-divider>
      <v-btn
        class="navigation-menu__v-btn--style"
        aria-label="Sign Out"
        flat
        slot="activator"
        navigation-menu__v-btn--style
        :disabled="isSiteInMaintenanceMode"
        @click.prevent="redirectAndSignOut"
      >
        <font-awesome-icon
          class="navigation-menu__v-icon--layout"
          :style="{ color: '#555' }"
          :icon="['fa', 'sign-out-alt']"
        />
        <!-- <v-icon small class="navigation-menu__v-icon--layout">fad sign-out-alt</v-icon> -->
        &nbsp;Sign Out
      </v-btn>
    </v-toolbar-items>
    <!-- TODO: This HACK prevents vuetify menu from going off the screen to the right. Do this properly.  -->
    <div v-else style="width:100px;"></div>
    <v-toolbar-items v-if="isHelpAvailable">
      <v-btn
        title="Help"
        flat
        class="navigation-menu__v-btn--style"
        @click="shouldShowHelp = true"
        :disabled="isSiteInMaintenanceMode"
      >
        <v-icon small>help</v-icon>
      </v-btn>
    </v-toolbar-items>
    <v-dialog
      v-if="isHelpAvailable"
      v-model="shouldShowHelp"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar card dark>
          <v-toolbar-title aria-label="Help">Help</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn aria-label="Close" icon dark @click="closeHelp">
            <v-icon aria-label="Close">close</v-icon>
          </v-btn>
        </v-toolbar>
        <div v-if="shouldShowHelp">
          <transition name="component-fade" mode="in-out">
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

  @(namespace(UserProfileModuleName).State(state => {
    return state.value.firstName
  }))
  private firstName: string

  @Getter(ns(AppInfoModuleName, AppInfoOperation.Getter.IsSiteInMaintenanceMode))
  private isSiteInMaintenanceMode: boolean

  @(namespace('window/availableHeight').State(state => {
    console.info(state.value[0])
    return state.value[0]
  }))
  private availableHeight: Array<number>

  public isSubItemActive(input: string) {
    const paths = (Array.isArray(input) ? input : [input]) as Array<string>
    const isInPath = paths.some(path => {
      return this.$route.path.indexOf(path) === 0 // current path starts with this path string
    })
    return isInPath
  }

  private getIconArray(iconString: string) {
    const iconArray = iconString.split(' ')
    return iconArray
  }

  private closeHelp() {
    this.shouldShowHelp = false
  }

  private async redirectAndSignOut() {
    this.$router.push('/sign-out')
  }
}
</script>

<style>
div.navigation-menu__v-list--alignment a.v-list__tile {
  height: 36px;
  max-height: 36px;
}

i.v-icon {
  font-weight: normal;
}
.v-btn__content {
  font-weight: normal;
}
.navigation-menu__v-icon--dropdown {
  font-size: 10px !important;
  margin-top: 4px !important;
}
.navigation-menu__v-list-tile--font a div {
  font-size: 13px;
  color: unset;
}
.navigation-menu__v-list-tile--font a.v-list__tile--active div {
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}
.navigation-menu__v-btn--style {
  min-width: 64px;
  font-size: 13px;
}
.navigation-menu__v-icon--layout {
  margin-top: 2px;
}
.navigation-menu__v-list--alignment {
  padding-top: 0;
  padding-bottom: 0;
}
.menuable__content__active {
  max-height: 500px !important;
}
</style>
