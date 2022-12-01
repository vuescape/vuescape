<template>
  <v-toolbar
    height="36"
    class="hamburger-menu__toolbar--size"
  >
    <span
      :class="cssClass"
      class="hamburger-menu__container"
      style="height: 100%"
      @click="isSiteInMaintenanceMode ? () => {} : (hamburgerMenu = !hamburgerMenu)"
    >
      <font-awesome-icon
        size="sm"
        :icon="['fas', 'bars']"
        class="hamburger-menu__hamburger-icon--layout"
      />
      <v-menu
        ref="hamburgerMenu"
        v-model="hamburgerMenu"
        :close-on-content-click="false"
        content-class="hamburger-menu__v-menu--size"
      >
        <v-card>
          <v-expansion-panel v-model="expansionPanelIndex">
            <v-expansion-panel-content
              expand-icon
              v-for="(menu, index) in hamburgerMenus"
              :key="menu.id + '__hamburger'"
            >
              <template v-slot:header>
                <div v-if="menu.items && menu.items.length">{{ menu.title }}</div>
                <div v-else>
                  <div
                    v-if="menu.imageSrc"
                    :class="menu.cssClass"
                  >
                    <img
                      :id="menu.id"
                      :class="menu.cssClass"
                      :src="menu.imageSrc"
                      :alt="menu.ariaLabel || menu.title"
                      :title="menu.ariaLabel || menu.title"
                      :aria-label="menu.ariaLabel || menu.title"
                      @click="navigateFromHamburgerMenu(menu.path)"
                      :disabled="isSiteInMaintenanceMode"
                    />
                  </div>
                  <div
                    v-else
                    @click="() => navigateFromHamburgerMenu(menu.path)"
                  >
                    {{ menu.title }}
                  </div>
                </div>
              </template>
              <template v-slot:actions>
                <font-awesome-icon
                  v-if="menu.items && menu.items.length"
                  :icon="expansionPanelIndex === index + 1 ? ['fal', 'chevron-down'] : ['fal', 'chevron-right']"
                  class="hamburger-menu__hamburger-menu__icon"
                />
                <font-awesome-icon
                  v-if="!(menu.items && menu.items.length) && menu.icon"
                  :icon="getIconArray(menu.icon)"
                  @click="() => navigateFromHamburgerMenu(menu.path)"
                />
              </template>
              <v-card>
                <div v-if="menu.items && menu.items.length !== 0">
                  <v-list
                    class="hamburger-menu__v-list--alignment"
                    v-if="menu.items"
                    light
                  >
                    <v-list-tile
                      class="hamburger-menu__v-list-tile--font"
                      :aria-label="menuItem.ariaLabel || menuItem.title"
                      v-for="menuItem in menu.items"
                      :key="menuItem.id"
                      @click="() => navigateFromHamburgerMenu(menuItem.path)"
                    >
                      <v-list-tile-title :aria-label="menuItem.ariaLabel || menuItem.title">{{
                        menuItem.title
                      }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </div>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-menu>
    </span>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'

import { Component, Prop } from 'vue-property-decorator'
import { Getter, State } from 'vuex-class'

import { AppInfoModuleName, AppInfoOperation } from '@vuescape/store/modules/AppInfo'
import { ns } from '@vuescape/store/modules/types'
import { Menu } from '@vuescape/types'

@Component
export default class HamburgerMenu extends Vue {
  private hamburgerMenu = false
  private expansionPanelIndex = null

  @Prop({ required: true })
  private menus: Array<Menu>

  // Class to control whether to render or not
  @Prop({ required: false, default: 'hidden-md-and-up' })
  private cssClass: string

  @State
  private isAuthenticated: boolean

  @Getter(ns(AppInfoModuleName, AppInfoOperation.Getter.IsSiteInMaintenanceMode))
  private isSiteInMaintenanceMode: boolean

  private get hamburgerMenus() {
    const result = this.menus.filter(_ => !_.isDivider)
    return result
  }

  private navigateFromHamburgerMenu(path: string) {
    this.hamburgerMenu = false
    this.expansionPanelIndex = null
    this.$router.push(path)
  }

  private getIconArray(iconString: string) {
    const iconArray = iconString ? iconString.split(' ') : ''
    return iconArray
  }
}
</script>

<style>
.hamburger-menu__toolbar--size div.v-toolbar__content {
  float: right;
}
.hamburger-menu__v-menu--size .v-expansion-panel .v-expansion-panel__container {
  border-top: 1px solid #9bdddb;
  /* height: 36px; */
  font-size: 13px;
}
.hamburger-menu__hamburger-menu__icon {
  font-size: 9px;
}

.hamburger-menu__v-menu--size {
  min-width: 100% !important;
  top: 37px !important;
  left: 0 !important;
}
.hamburger-menu__hamburger-icon--layout {
  color: #555;
  margin-top: 14px;
  cursor: pointer;
}

div.hamburger-menu__v-list--alignment a.v-list__tile {
  height: 36px;
  max-height: 36px;
}

.hamburger-menu__v-list-tile--font a div {
  font-size: 13px;
  color: unset;
}
.hamburger-menu__v-list-tile--font a.v-list__tile--active div {
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}
.hamburger-menu__v-list--alignment {
  padding-top: 0;
  padding-bottom: 0;
}
/* .menuable__content__active {
  max-height: 500px !important;
} */
.hamburger-menu__toolbar--size {
  height: 36px;
  border-bottom: 100px;
}
</style>
