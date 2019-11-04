<template>
  <a
    href="/"
    v-if="notFoundConfiguration.notFoundImageUrl"
  >
    <img
      alt="404 - Page Not Found"
      :src="notFoundConfiguration.notFoundImageUrl"
    />
  </a>
  <div
    v-else-if="notFoundConfiguration.notFoundHtml"
    v-html="notFoundConfiguration.notFoundHtml"
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

@Component
export default class NotFound extends Vue {
  @(namespace('notFound/configuration').State(
    state => {
      if (state && state.value) {
        const notFoundConfiguration: any = state.value
        return notFoundConfiguration || {}
      }
      return {}
    },
  ))
  private notFoundConfiguration: any
}
</script>
