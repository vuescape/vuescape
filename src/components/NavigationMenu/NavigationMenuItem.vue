<template>
  <span :class="{ 'navigation-menu-item__divider--height': menu.isDivider }">
    <v-divider
      v-if="menu.isDivider"
      class="mx-3 navigation-menu-item__divider--height"
      inset
      vertical
    ></v-divider>
    <v-menu
      content-class="navigation-menu__content"
      v-if="!menu.isDivider && menu.items"
      auto
      open-on-click
      offset-y
      :disabled="isSiteInMaintenanceMode"
    >
      <v-btn
        :key="menu.id"
        :aria-label="menu.title"
        flat
        slot="activator"
        :class="[{ 'v-btn--active': isSubItemActive(menu) }, 'navigation-menu__v-btn--style']"
        :disabled="isSiteInMaintenanceMode"
      >
        <span
          v-if="menu.prefixHtml"
          v-html="menu.prefixHtml"
        ></span>
        <i
          v-if="menu.icon"
          :class="getIconArray(menu.icon).join(' ')"
          class="navigation-menu__v-icon--layout"
          :style="{ color: '#555' }"
        />&nbsp;{{ menu.title }} &nbsp;
        <v-icon
          v-if="menu.items && menu.items.length"
          small
          color="#555"
          class="navigation-menu__v-icon--dropdown"
        >fa-solid fa-caret-down</v-icon
        >
      </v-btn>
      <v-list
        class="navigation-menu__v-list--alignment"
        v-if="menu.items"
        light
      >
        <v-list-tile
          class="navigation-menu__v-list-tile--font"
          :aria-label="menuItem.ariaLabel || menuItem.title"
          v-for="menuItem in menu.items"
          :key="menuItem.id"
          @click="handleNavigation($event, menuItem)"
        >
          <v-list-tile-title :aria-label="menuItem.ariaLabel || menuItem.title">{{ menuItem.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
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
        @click="handleNavigation($event, menu)"
        :disabled="isSiteInMaintenanceMode"
      />
    </div>
    <div v-else>
      <v-btn
        v-if="!menu.isDivider && !menu.items"
        :key="menu.id"
        flat
        :class="['navigation-menu__v-btn--style', menu.cssClass, { 'v-btn--active': isItemActive(menu) }]"
        :title="menu.icon ? menu.title : ''"
        :aria-label="menu.ariaLabel || menu.title"
        :disabled="isSiteInMaintenanceMode"
        @click="handleNavigation($event, menu)"
      >
        <i
          class="navigation-menu__v-icon--layout"
          v-if="menu.icon"
          :style="{ color: '#555' }"
          :class="getIconArray(menu.icon).join(' ')"
        />
        &nbsp;{{ menu.title }}
      </v-btn>
    </div>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

import { Component, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { AppInfoModuleName } from '@vuescape/store/modules/AppInfo'
import { Menu } from '@vuescape/types'

const HamburgerMenu = () => import(/* webpackChunkName: 'hamburger-menu' */ '@vuescape/components/HamburgerMenu').then(m => m.default)

@Component({
  components: {
    HamburgerMenu,
  },
})
export default class NavigationMenuItem extends Vue {
  // private isMenuDisabled = false
  private menusValue: Array<Menu> = []

  @Prop({ type: Object, required: true })
  private menu: string

  @namespace(AppInfoModuleName).State(state => {
    const isSiteInMaintenanceMode = state.asyncResult.status === 200 ? state.value.isSiteInMaintenanceMode : false
    return isSiteInMaintenanceMode
  })
  private isSiteInMaintenanceMode: boolean

  public isSubItemActive(menu: Menu) {
    if (!menu) {
      return false
    }

    const path = this.$route.path

    if (!menu.items) {
      return menu.path === path
    }

    // Current menu is only one level deep so only need to check items
    // and not recurse/loop over entire hierarchy.
    const isActive = menu.items.some(_ => path.startsWith(_.path))
    return isActive
  }

  public isItemActive(menu: Menu): boolean {
    const path = this.$route.path

    // Always check the main menu.path
    const isBaseActive = path.startsWith(menu.path)

    // Then check any of the additional prefixes
    const isAdditionalActive = Array.isArray(menu.pathIsActiveWhen)
      ? menu.pathIsActiveWhen.some(prefix => path.startsWith(prefix))
      : false

    const result = isBaseActive || isAdditionalActive
    return result
  }

  // Manually handle navigation
  private handleNavigation(e: MouseEvent, menuItem: Menu) {
    // If this menu item shouldn't fire the click event then stop propagation
    if (menuItem.shouldFireClickEvent === false) {
      e.stopPropagation()
    }

    // If the menu item starts with http then treat it as absolute path
    if (menuItem.path.startsWith('http')) {
      document.location.href = menuItem.path
    }
    else {
      this.$router.push({ path: menuItem.path })
    }
  }

  private getIconArray(iconString: string) {
    const iconArray = iconString ? iconString.split(' ') : ''
    return iconArray
  }
}
</script>

<style>
div.navigation-menu__v-list--alignment a.v-list__tile {
  height:     36px;
  max-height: 36px;
}

/*
i.v-icon {
  font-weight: normal;
}
*/
.v-btn__content {
  font-weight: normal;
}
.navigation-menu__v-icon--dropdown {
  font-size:  10px !important;
  margin-top: 4px !important;
}
.navigation-menu__v-list-tile--font a div {
  font-size: 13px;
  color:     unset;
}
.navigation-menu__v-list-tile--font a.v-list__tile--active div {
  font-size:   13px;
  font-weight: 600;
  color:       rgba(0, 0, 0, 0.87);
}
.navigation-menu__v-btn--style {
  min-width: 64px;
  font-size: 13px;
  height:    36px !important;
}
.navigation-menu__v-icon--layout {
  margin-top: 2px;
}
.navigation-menu__v-list--alignment {
  padding-top:    0;
  padding-bottom: 0;
}
.navigation-menu__content.menuable__content__active {
  max-height: 500px !important;
}
.navigation-menu-item__divider--height {
  height: 100%;
}
</style>
