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
    The requested page was not found.
  </div>
</template>

<script lang="ts">
import { Component, namespace, toNative, Vue } from '@vuescape/decorators'

@Component
class NotFound extends Vue {
  @(namespace('notFound/configuration').State(state => {
    if (state && state.value) {
      const notFoundConfiguration: any = state.value
      return notFoundConfiguration || {}
    }
    return {}
  }))
  private notFoundConfiguration: any
}

export default toNative(NotFound)
</script>
