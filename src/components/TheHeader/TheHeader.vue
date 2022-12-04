<template>
  <navigation-menu
    :toolbarStyle="theHeaderProps.toolbarStyle"
    :menus="consolidatedMenus"
    :helpComponent="theHeaderProps.helpComponent"
  ></navigation-menu>
</template>

<script lang="ts">
import { Component, Inject } from 'vue-property-decorator'
import { Getter, namespace } from 'vuex-class'

import { ns } from '@vuescape/store/modules/types'
import { FeatureService, Guid, Menu, MenuSources } from '@vuescape/types'

import NavigationMenu from '@vuescape/components/NavigationMenu'
import { ComponentBase } from '@vuescape/infrastructure'
import { HorizontalAlignment } from '@vuescape/reporting-domain/TreeTable/HorizontalAlignment'

@Component({
  components: { NavigationMenu },
})
export default class TheHeader extends ComponentBase {
  private static readonly DefaultHeaderConfig = { logoAltText: '', toolbarStyle: '', shouldDisplayHelp: true }
  private consolidatedMenus: Array<Menu> = []

  @namespace('theHeader/configuration').State(state => {
    if (state && state.value) {
      const headerProps: any = state.value
      return headerProps || TheHeader.DefaultHeaderConfig
    }
    return TheHeader.DefaultHeaderConfig
  })
  // TODO: define type for header state
  private theHeaderProps: any

  @namespace('menu/configuration').State(state => {
    if (state && state.value) {
      return state.value
    }
    return []
  })
  private menuConfiguration: Array<Menu>

  @Getter(ns('userProfile', 'Menus'))
  private userProfileMenus: Array<Menu>

  @Inject('featureService')
  private featureService: FeatureService

  private async populateConsolidatedMenus() {
    const menuSources = this.theHeaderProps.menuSources as MenuSources
    const consolidatedMenus: Array<Menu> = []

    // tslint:disable:no-bitwise
    if ((menuSources & MenuSources.RoleBased) === MenuSources.RoleBased && this.userProfileMenus) {
      consolidatedMenus.push(...this.userProfileMenus)
    }

    if ((menuSources & MenuSources.Configuration) === MenuSources.Configuration && this.menuConfiguration.length) {
      consolidatedMenus.push(...this.menuConfiguration)
    }

    if ((menuSources & MenuSources.Feature) === MenuSources.Feature) {
      const featureMenus = await this.featureService.getMenus()
      featureMenus.forEach(_ =>
        this.addFeatureMenu(
          _,
          consolidatedMenus,
          (_.menuTitlePath ?? '').split('|').filter(s => s),
        ),
      )
      this.consolidatedMenus = consolidatedMenus
    }

    const signOutDivider: Menu = {
      id: Guid.newGuid(),
      title: '',
      path: '',
      isDivider: true,
      horizontalAlignment: HorizontalAlignment.Right,
    }
    const signOutMenuItem: Menu = {
      id: 'sign-out',
      title: 'Sign Out',
      isDivider: false,
      ariaLabel: 'Sign Out',
      path: '/sign-out',
      icon: 'fa sign-out-alt',
      horizontalAlignment: HorizontalAlignment.Right,
    }
    this.consolidatedMenus.push(...[signOutDivider, signOutMenuItem])
  }

  private addFeatureMenu(featureMenu: Menu & { menuTitlePath: string }, menus: Array<Menu>, menuTitles: Array<string>) {
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
      matchingMenu = {
        id: Guid.newGuid(),
        title: menuTitles[0],
        path: '',
        items: [],
        horizontalAlignment: featureMenu.horizontalAlignment,
      }
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
      }
      else {
        matchingMenu.items = [featureMenu]
      }
    }
    else {
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
img.the-header__img--layout {
  max-height: 20px;
  max-width:  92px;
}
img.the-header__img--clickable {
  cursor: pointer;
}
</style>
