<template>
  <v-toolbar
    v-if="shouldDisplayHeader"
    app
    fixed
    :style="`height:58px;${theHeaderProps.toolbarStyle}`"
    ref="toolbar"
  >
    <v-toolbar-title>
      <img
        class="the-header__img--layout"
        :src="theHeaderProps.logoUrl"
        :alt="theHeaderProps.logoAltText"
      >
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <navigation-menu
      style="height:58px; margin-top:-6px;"
      v-if="shouldDisplayHeader"
      :isHelpAvailable="theHeaderProps.shouldDisplayHelp"
      :menus="menus"
      :helpComponent="theHeaderProps.helpComponent"
    ></navigation-menu>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Action, namespace, State } from 'vuex-class'

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

  @(namespace('theHeader/configuration')
  .State(
    state => {
      if (state && state.value) {
        const headerProps: any = state.value
        return headerProps || TheHeader.DefaultHeaderConfig
      }
      return TheHeader.DefaultHeaderConfig
    },
  ))
  // TODO: define type for header state
  private theHeaderProps: any

  private get shouldDisplayHeader() {
    return this.isAuthenticated || this.theHeaderProps.shouldShowHeader
  }

  @(namespace('menu/configuration')
  .State(
    state => {
      if (state && state.value) {
        return state.value
      }
      return []
    },
  ))
  private menus: Array<Menu>
}
</script> 
<style scoped>
.the-header__toolbar--height {
  height: 58px !important;
}
.the-header__toolbar--size {
  height: 58px !important;
  padding-top: -6px !important;
}
.the-header__img--layout {
  vertical-align: middle;
  max-height: 46px;
  max-width: 207px;
}
</style>
