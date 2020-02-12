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
        :src="theHeaderProps.logoUrl"
        :alt="theHeaderProps.logoAltText"
      />
      <v-spacer></v-spacer>
      <navigation-menu
        v-if="shouldDisplayHeader"
        :isHelpAvailable="theHeaderProps.shouldDisplayHelp"
        :menus="menus"
        :helpComponent="theHeaderProps.helpComponent"
      ></navigation-menu>
    </v-toolbar>
  </div>
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
    return this.isAuthenticated || this.theHeaderProps.shouldShowHeader
  }

  @(namespace('menu/configuration').State(state => {
    if (state && state.value) {
      return state.value
    }
    return []
  }))
  private menus: Array<Menu>
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
</style>
