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
        target="parent"
      >
        <v-card>
          <v-expansion-panels v-model="expansionPanelIndex">
            <v-expansion-panel
              v-for="(menu, index) in hamburgerMenus"
              :key="menu.id + '__hamburger'"
            >
              <v-expansion-panel-title>
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
                      @click.stop="navigateFromHamburgerMenu(menu.path)"
                    />
                  </div>
                  <div
                    v-else
                    @click.stop="() => navigateFromHamburgerMenu(menu.path)"
                  >
                    {{ menu.title }}
                  </div>
                </div>
                <template v-slot:actions>
                  <i
                    v-if="menu.items && menu.items.length"
                    :class="expansionPanelIndex === index + 1 ? ['fa-light', 'fa-chevron-down'] : ['fa-light', 'fa-chevron-right']"
                    class="hamburger-menu__hamburger-menu__icon"
                  />
                  <i
                    v-if="!(menu.items && menu.items.length) && menu.icon"
                    :class="getIconArray(menu.icon).join(' ')"
                    @click.stop="() => navigateFromHamburgerMenu(menu.path)"
                  />
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-card>
                  <div v-if="menu.items && menu.items.length !== 0">
                    <v-list
                      v-if="menu.items"
                      class="hamburger-menu__v-list--alignment"
                    >
                      <v-list-item
                        v-for="menuItem in menu.items"
                        :key="menuItem.id"
                        :aria-label="menuItem.ariaLabel || menuItem.title"
                        class="hamburger-menu__v-list-tile--font"
                        @click="() => navigateFromHamburgerMenu(menuItem.path)"
                      >
                        <v-list-item-title :aria-label="menuItem.ariaLabel || menuItem.title">{{
                            menuItem.title
                                                                                              }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-card>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-menu>
    </span>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Getter, Prop, State, toNative, Vue } from '@vuescape/decorators'

import { isNavigationFailure } from 'vue-router'

import { AppInfoModuleName, AppInfoOperation } from '@vuescape/store/modules/AppInfo'
import { ns } from '@vuescape/store/modules/types'
import { Menu } from '@vuescape/types'

@Component
class HamburgerMenu extends Vue {
  private hamburgerMenu = false
  private expansionPanelIndex = null

  @Prop({ required: true })
  private menus: Array<Menu>

  // Class to control whether to render or not
  @Prop({ required: false, default: 'vuetify1-hidden-md-and-up' })
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
    // Navigation guards redirect or cancel on purpose; vue-router reports that by rejecting push()
    this.$router.push(path).catch(error => {
      if (!isNavigationFailure(error)) {
        throw error
      }
    })
  }

  private getIconArray(iconString: string) {
    const iconArray = iconString ? iconString.split(' ') : ''
    return iconArray
  }
}

export default toNative(HamburgerMenu)
</script>

<style>
.hamburger-menu__v-menu--size .v-expansion-panels .v-expansion-panel {
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

div.hamburger-menu__v-list--alignment a.v-list-item {
  height:     36px;
  max-height: 36px;
}

.hamburger-menu__v-list-tile--font a div {
  font-size: 13px;
  color:     unset;
}
.hamburger-menu__v-list-tile--font a.v-list-item--active div {
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
.hamburger-menu__v-menu--size {
  height: 100vh;
}
/* Vuetify 4 stretches menu cards to the menu's height */
.hamburger-menu__v-menu--size > .v-card {
  height: auto;
}
/* Vuetify 4 covers panel titles with an overlay, which would take the clicks meant for the menu links */
.hamburger-menu__v-menu--size .v-expansion-panel-title__overlay {
  pointer-events: none;
}
</style>
