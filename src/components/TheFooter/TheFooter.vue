<template>
  <v-layout
    row
    text-xs-center
  >
    <v-flex md12>&copy; {{ currentYear }} <img v-if="theFooterProps.logoUrl"
        :alt="theFooterProps.logoAltText"
        :src="theFooterProps.logoUrl"
        width="16px"
        height="16px"
      /> {{theFooterProps.copyrightName}} All rights reserved.
    </v-flex>
    <v-spacer></v-spacer>
    <div class="caption the-footer__version--center">{{ formattedVersion }}</div>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'

import { AppInfo, VuescapeConfiguration } from '@vuescape/types'

@Component
export default class TheFooter extends Vue {
  private static readonly DefaultFooterConfig = { copyrightName: '', logoAltText: '' }
  private currentYear = new Date().getFullYear()

  private formattedVersion = ''

  @(namespace('appInfo')
  .State(
    state => {
      return state && state.asyncResult && state.asyncResult.status === 200 && state.value
        ? state.value.version
        : undefined
    },
  ))
  private version: string | undefined

  @(namespace('theFooter')
  .State(
    state => {
      if (state && state.value) {
        const footerProps: any = state.value
        return footerProps || TheFooter.DefaultFooterConfig
      }
      return TheFooter.DefaultFooterConfig
    },
  ))
  // TODO: define type for footer state
  private theFooterProps: any

  @Watch('version')
  private onVersionChanged(version: string, oldVersion: string) {
    // Only handle First time loaded since version in the footer should be updated with a refresh
    if (version && !this.formattedVersion) {
      this.formattedVersion = `v${this.version}`
    }
  }
}
</script>

// Using less here to avoid compile error building test when this module uses CSS
<style lang="less">
// Override container margin
.container {
  margin-left: auto;
}
.the-footer__version--center {
  padding: 4px;
}
</style>
