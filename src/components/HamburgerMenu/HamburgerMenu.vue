<template>
  <v-toolbar
    class="hamburger-menu__toolbar--size"
    height="36"
  >
    <span
      :class="cssClass"
      class="hamburger-menu__container"
      style="height: 100%"
      @click="isSiteInMaintenanceMode ? () => {} : (hamburgerMenu = !hamburgerMenu)"
    >
      <i
        class="hamburger-menu__hamburger-icon--layout fa-solid fa-bars fa-sm"
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
              v-for="(menu, index) in hamburgerMenus"
              :key="menu.id + '__hamburger'"
              expand-icon
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
                      :alt="menu.ariaLabel || menu.title"
                      :aria-label="menu.ariaLabel || menu.title"
                      :class="menu.cssClass"
                      :disabled="isSiteInMaintenanceMode"
                      :src="menu.imageSrc"
                      :title="menu.ariaLabel || menu.title"
                      @click="navigateFromHamburgerMenu(menu.path)"
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
                <i
                  v-if="menu.items && menu.items.length"
                  :class="expansionPanelIndex === index + 1 ? ['fa-light', 'fa-chevron-down'] : ['fa-light', 'fa-chevron-right']"
                  class="hamburger-menu__hamburger-menu__icon"
                />
                <i
                  v-if="!(menu.items && menu.items.length) && menu.icon"
                  :class="getIconArray(menu.icon).join(' ')"
                  @click="() => navigateFromHamburgerMenu(menu.path)"
                />
              </template>
              <v-card>
                <div v-if="menu.items && menu.items.length !== 0">
                  <v-list
                    v-if="menu.items"
                    class="hamburger-menu__v-list--alignment"
                    light
                  >
                    <v-list-tile
                      v-for="menuItem in menu.items"
                      :key="menuItem.id"
                      :aria-label="menuItem.ariaLabel || menuItem.title"
                      class="hamburger-menu__v-list-tile--font"
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
    this.hamburgerMenu       = false
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
.hamburger-menu__v-menu--size .v-expansion-panel .v-expansion-panel__container {
  border-top: 1px solid #9bdddb;
  /* height: 36px; */
  font-size:  13px;
}
.hamburger-menu__hamburger-menu__icon {
  font-size: 9px;
}

.hamburger-menu__v-menu--size {
  min-width: 100% !important;
  top:       37px !important;
  left:      0 !important;
}
.hamburger-menu__hamburger-icon--layout {
  color:      #555;
  margin-top: 14px;
  cursor:     pointer;
}

div.hamburger-menu__v-list--alignment a.v-list__tile {
  height:     36px;
  max-height: 36px;
}

.hamburger-menu__v-list-tile--font a div {
  font-size: 13px;
  color:     unset;
}
.hamburger-menu__v-list-tile--font a.v-list__tile--active div {
  font-size:   13px;
  font-weight: 600;
  color:       rgba(0, 0, 0, 0.87);
}
.hamburger-menu__v-list--alignment {
  padding-top:    0;
  padding-bottom: 0;
}
/* .menuable__content__active {
  max-height: 500px !important;
} */
.hamburger-menu__toolbar--size {
  height:        36px;
  border-bottom: 100px;
}
.menuable__content__active.hamburger-menu__v-menu--size {
  height: 100vh;
}
</style>
