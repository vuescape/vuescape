<template>
  <div>
    <v-toolbar
      v-if="shouldDisplayHeader"
      height="36"
      class="the-header__toolbar--size"
      :style="theHeaderProps.toolbarStyle"
      ref="toolbar"
    >
      <img
        id="home-logo"
        class="the-header__img--layout"
        :class="getCssClass"
        :src="theHeaderProps.logoUrl"
        :alt="theHeaderProps.logoAltText"
        :title="theHeaderProps.logoAltText"
        @click="clickLogo"
      />
      <v-spacer></v-spacer>
      <navigation-menu
        v-if="shouldDisplayHeader"
        :isHelpAvailable="theHeaderProps.shouldDisplayHelp"
        :menus="consolidatedMenus"
        :helpComponent="theHeaderProps.helpComponent"
      ></navigation-menu>
    </v-toolbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Action, Getter, namespace, State } from 'vuex-class'

import { AuthenticationModuleName, AuthenticationOperation } from '@vuescape/store/modules/Authentication'
import { ns } from '@vuescape/store/modules/types'
import { UserProfileModuleName } from '@vuescape/store/modules/UserProfile'
import { Guid, Menu } from '@vuescape/types'

import NavigationMenu from '@vuescape/components/NavigationMenu'

@Component({
  components: { NavigationMenu },
})
export default class TheHeader extends Vue {
  private static readonly DefaultHeaderConfig = { logoAltText: '', toolbarStyle: '', shouldDisplayHelp: true }

  @State
  private isAuthenticated: boolean
  
  @State
  private hasExternalSessionsInitialized: boolean

  @(namespace('theHeader/configuration').State(state => {
    if (state && state.value) {
      const headerProps: any = state.value
      return headerProps || TheHeader.DefaultHeaderConfig
    }
    return TheHeader.DefaultHeaderConfig
  }))
  // TODO: define type for header state
  private theHeaderProps: any

  private get shouldDisplayHeader() {
    return (this.isAuthenticated && this.hasExternalSessionsInitialized) || this.theHeaderProps.shouldShowHeader
  }

  @(namespace('menu/configuration').State(state => {
    if (state && state.value) {
      return state.value
    }
    return []
  }))
  private menuConfiguration: Array<Menu>

  @Getter(ns('userProfile', 'Menus'))
  private userProfileMenus: Array<Menu>

  private get getCssClass() {
    if (this.theHeaderProps.logoHref || this.theHeaderProps.logoNavigationRoute) {
      return 'the-header__img--clickable'
    }
  }

  private clickLogo() {
    if (this.theHeaderProps.logoHref) {
      document.location.href = this.theHeaderProps.logoHref
    }
    if (this.theHeaderProps.logoNavigationRoute) {
      this.$router.push(this.theHeaderProps.logoNavigationRoute)
    }
  }

  private get consolidatedMenus() {
    if (this.menuConfiguration.length) {
      return this.menuConfiguration
    }
    if (this.userProfileMenus) {
      return this.userProfileMenus
    }
    return []
  }
}
</script>
<style>
.the-header__toolbar--size {
  height: 36px;
  border-bottom: 100px;
}
.the-header__img--layout {
  vertical-align: middle;
  max-height: 20px;
  max-width: 92px;
}
.the-header__img--clickable {
  cursor: pointer;
}
</style>
