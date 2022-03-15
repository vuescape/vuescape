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
import { Component, Inject, Prop } from 'vue-property-decorator'
import { Action, Getter, namespace, State } from 'vuex-class'

import { AuthenticationModuleName, AuthenticationOperation } from '@vuescape/store/modules/Authentication'
import { ns } from '@vuescape/store/modules/types'
import { UserProfileModuleName } from '@vuescape/store/modules/UserProfile'
import { FeatureService, Guid, Menu, MenuSources } from '@vuescape/types'

import NavigationMenu from '@vuescape/components/NavigationMenu'

@Component({
  components: { NavigationMenu },
})
export default class TheHeader extends Vue {
  private static readonly DefaultHeaderConfig = { logoAltText: '', toolbarStyle: '', shouldDisplayHelp: true }
  private consolidatedMenus : Array<Menu> = []

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

  @Inject('featureService')
  private featureService: FeatureService

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

  private async populateConsolidatedMenus() {
    const menuSources = this.theHeaderProps.menuSources as MenuSources
    const consolidatedMenus: Array<Menu> = []
    
    // tslint:disable:no-bitwise
    if((menuSources & MenuSources.RoleBased) === MenuSources.RoleBased && this.userProfileMenus) {
      consolidatedMenus.push(...this.userProfileMenus)
    }

    if((menuSources & MenuSources.Configuration) === MenuSources.Configuration && this.menuConfiguration.length) {
      consolidatedMenus.push(...this.menuConfiguration)
    }

    if((menuSources & MenuSources.Feature) === MenuSources.Feature) {
      const featureMenus = await this.featureService.getMenus()
      featureMenus.forEach(_ => 
        this.addFeatureMenu(_, consolidatedMenus, (_.menuTitlePath ?? '').split('|').filter(s => s)))
      this.consolidatedMenus = consolidatedMenus
    }
  }

  private addFeatureMenu(
    featureMenu: Menu & { menuTitlePath: string },
    menus: Array<Menu>,
    menuTitles: Array<string>,
  ) {
    // If no titles then add to the top level
    if (menuTitles.length === 0) {
      // Only add menu item if it doesn't exist
      if (!menus.some(_ => _.id === featureMenu.id)) {
        menus.push(featureMenu)
      }
      return
    }
    const isLastMenuTitle = menuTitles.length === 1
    let matchingMenu = menus.find(_ => _.title.toLowerCase() === menuTitles[0].toLowerCase())
    // If there was no match for the title then add a placeholder menu
    if (!matchingMenu) {
      matchingMenu = { id: Guid.newGuid(), title: menuTitles[0], path: '', items: [] }
      menus.push(matchingMenu)
    }
    // If this is the last menu title then add to the items or create items array
    // if it doesn't exist
    if (isLastMenuTitle) {
      if (matchingMenu.items && matchingMenu.items.length !== 0) {
        // Only add menu item if it doesn't exist
        if (!matchingMenu.items.some(_ => _.id === featureMenu.id)) {
          matchingMenu.items.push(featureMenu)
        }
      } else {
        matchingMenu.items = [featureMenu]
      }
    } else {
      // Drill down into the next menu title to find where to add this featureMenu
      this.addFeatureMenu(featureMenu, matchingMenu.items!, menuTitles.slice(1))
    }
  }

  private async created() {
    await this.populateConsolidatedMenus()
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
