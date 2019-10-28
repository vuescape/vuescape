<template>
  <a
    href="/"
    v-if="notFoundProperties.notFoundImageUrl"
  >
    <img
      alt="404 - Page Not Found"
      :src="notFoundProperties.notFoundImageUrl"
    />
  </a>
  <div
    v-else-if="notFoundProperties.notFoundHtml"
    v-html="notFoundProperties.notFoundHtml"
  >
  </div>
  <div v-else>
    The requested page was not found. Click here to go to the home page.
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'

import { VuescapeConfiguration } from '@vuescape/types'

@Component
export default class NotFound extends Vue {
  @(namespace('notFound').State(
    state => {
      if (state && state.value) {
        const notFoundProperties: any = state.value
        return notFoundProperties || {}
      }
      return {}
    },
  ))
  private notFoundProperties: any
}
</script>
