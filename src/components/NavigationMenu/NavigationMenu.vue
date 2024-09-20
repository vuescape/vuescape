<template>
  <span>
    <v-layout
      class="navigation-menu__container hidden-sm-and-down"
      row
      style="height: 100%"
    >
      <v-flex
        v-if="shouldShowLeftSection"
        v-bind="{ [`lg${leftBreakpoint}`]: true }"
      >
        <v-toolbar
          :style="toolbarStyle"
          class="navigation-menu__toolbar--size"
          height="36"
        >
          <navigation-menu-item
            v-for="menu in leftMenuItems"
            :key="menu.id"
            :menu="menu"
          ></navigation-menu-item>
        </v-toolbar>
      </v-flex>
      <v-flex
        v-if="shouldShowCenterSection"
        v-bind="{ [`lg${centerBreakpoint}`]: true }"
      >
        <v-toolbar
          :style="toolbarStyle"
          class="navigation-menu__toolbar--size"
          height="36"
        >
          <v-layout justify-center>
            <navigation-menu-item
              v-for="menu in centerMenuItems"
              :key="menu.id"
              :menu="menu"
            ></navigation-menu-item>
          </v-layout>
        </v-toolbar>
      </v-flex>
      <v-flex
        v-if="shouldShowRightSection"
        v-bind="{ [`lg${rightBreakpoint}`]: true }"
      >
        <v-toolbar
          :style="toolbarStyle"
          class="navigation-menu__toolbar--size"
          height="36"
        >
          <v-spacer></v-spacer>
          <navigation-menu-item
            v-for="menu in rightMenuItems"
            :key="menu.id"
            :menu="menu"
          ></navigation-menu-item>
        </v-toolbar>
      </v-flex>
    </v-layout>
    <hamburger-menu
      :menus="hamburgerMenus"
      :style="toolbarStyle"
      class="hidden-md-and-up"
    ></hamburger-menu>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

import { Component, Prop, Watch } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'

import { HorizontalAlignment } from '@vuescape/reporting-domain/TreeTable/HorizontalAlignment'
import { AppInfoModuleName } from '@vuescape/store/modules/AppInfo'
import { UserProfileModuleName } from '@vuescape/store/modules/UserProfile'
import { Menu } from '@vuescape/types'

// tslint:disable-next-line: max-line-length
const HamburgerMenu = () => import(/* webpackChunkName: 'hamburger-menu' */ '@vuescape/components/HamburgerMenu').then(m => m.default)

const NavigationMenuItem = () => import(/* webpackChunkName: 'navigation-menu-item' */ './NavigationMenuItem.vue').then(
  m => m.default)

@Component({
  components: {
    HamburgerMenu,
    NavigationMenuItem,
  },
})
export default class NavigationMenu extends Vue {
  private areMenusSet              = false
  private menusValue: Array<Menu>  = []
  private hasLeftNavigationItems   = false
  private hasCenterNavigationItems = false
  private hasRightNavigationItems  = false

  @Prop({
    type   : String,
    default: '',
  })
  private toolbarStyle: string

  @Prop({
    type: Object,
  })
  private menuBreakpoints: { left: number, center: number, right: number } | undefined

  @Prop({ required: true })
  private menus: Array<Menu>

  @Prop()
  private helpComponent: any

  private shouldShowHelp      = false
  private activeIndex: string = '/'

  @State
  private isAuthenticated: boolean

  @namespace(UserProfileModuleName).State(state => {
    return state.value.firstName
  })
  private firstName: string

  @namespace(AppInfoModuleName).State(state => {
    const isSiteInMaintenanceMode = state.asyncResult.status === 200 ? state.value.isSiteInMaintenanceMode : false
    return isSiteInMaintenanceMode
  })
  private isSiteInMaintenanceMode: boolean

  @namespace('window/availableHeight').State(state => {
    return state.value[0]
  })
  private availableHeight: Array<number>

  private get hamburgerMenus() {
    const filterMenus = (alignment: HorizontalAlignment) =>
      this.menusValue.filter(menu => menu.horizontalAlignment === alignment && !menu.isDivider)

    const result: Array<Menu> = []
    result.push(...filterMenus(HorizontalAlignment.Left))
    result.push(...filterMenus(HorizontalAlignment.Center))
    result.push(...filterMenus(HorizontalAlignment.Right))
    return result
  }

  private get shouldShowLeftSection() {
    const result = this.hasLeftNavigationItems || (this.hasCenterNavigationItems && this.hasRightNavigationItems)
    return result
  }

  private get shouldShowCenterSection() {
    const result = this.hasCenterNavigationItems
    return result
  }

  private get shouldShowRightSection() {
    const hasLeft   = this.hasLeftNavigationItems
    const hasCenter = this.hasCenterNavigationItems
    const hasRight  = this.hasRightNavigationItems
    if ((hasLeft && !hasCenter && !hasRight) || (hasCenter && !hasLeft && !hasRight)) {
      return false
    }
    return true
  }

  private get leftMenuItems() {
    const result = this.menusValue.filter(_ => _.horizontalAlignment === HorizontalAlignment.Left)
    return result
  }

  private get centerMenuItems() {
    const result = this.menusValue.filter(_ => _.horizontalAlignment === HorizontalAlignment.Center)
    return result
  }

  private get rightMenuItems() {
    const result = this.menusValue.filter(_ => _.horizontalAlignment === HorizontalAlignment.Right)
    return result
  }

  private get leftBreakpoint() {
    if (this.menuBreakpoints?.left !== undefined) {
      return this.menuBreakpoints.left
    }
    return this.breakpoints
  }

  private get centerBreakpoint() {
    if (this.menuBreakpoints?.center !== undefined) {
      return this.menuBreakpoints.center
    }
    return this.breakpoints
  }

  private get rightBreakpoint() {
    if (this.menuBreakpoints?.right !== undefined) {
      return this.menuBreakpoints.right
    }
    return this.breakpoints
  }

  private get breakpoints() {
    // If menus haven't been set then default to 12 -- full width
    if (!this.areMenusSet) {
      return 12
    }

    const hasLeft   = this.hasLeftNavigationItems
    const hasCenter = this.hasCenterNavigationItems
    const hasRight  = this.hasRightNavigationItems

    // tslint:disable-next-line: max-line-length
    if ((hasLeft && !hasCenter && !hasRight) || (hasCenter && !hasLeft && !hasRight) || (hasRight && !hasLeft && !hasCenter)) {
      return 12
    }

    if (hasRight && hasLeft && !hasCenter) {
      return 6
    }

    return 4
  }

  @Watch('menus')
  private onMenusChanged(val: Array<Menu>, oldVal: Array<Menu>) {
    if (val && val.length) {
      this.areMenusSet = true
    }

    this.menusValue               = val
    this.hasLeftNavigationItems   = this.menusValue.some(_ => _.horizontalAlignment === HorizontalAlignment.Left)
    this.hasRightNavigationItems  = this.menusValue.some(_ => _.horizontalAlignment === HorizontalAlignment.Right)
    this.hasCenterNavigationItems = this.menusValue.some(_ => _.horizontalAlignment === HorizontalAlignment.Center)
  }

  private getIconArray(iconString: string) {
    const iconArray = iconString ? iconString.split(' ') : ''
    return iconArray
  }

  private closeHelp() {
    this.shouldShowHelp = false
  }

  private created() {
    if (this.menus && this.menus.length) {
      this.areMenusSet = true
    }
    this.menusValue               = this.menus
    this.hasLeftNavigationItems   = this.menusValue.some(_ => _.horizontalAlignment === HorizontalAlignment.Left)
    this.hasRightNavigationItems  = this.menusValue.some(_ => _.horizontalAlignment === HorizontalAlignment.Right)
    this.hasCenterNavigationItems = this.menusValue.some(_ => _.horizontalAlignment === HorizontalAlignment.Center)
  }
}
</script>

<style>
.navigation-menu__toolbar--size {
  height:        36px;
  border-bottom: 100px;
}
.navigation-menu__container button.v-btn {
  margin-left:  0;
  margin-right: 0;
}
</style>
