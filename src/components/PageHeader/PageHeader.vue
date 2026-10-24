<template>
  <div>
    <div
      class="layout row justify-space-between page-header__header--separation"
      v-if="title"
    >
      <div class="flex md8">
        <span>{{ title }}</span>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'

@Component
class PageHeader extends Vue {
  @Prop({ default: '' })
  private title: string
}

export default toNative(PageHeader)
</script>

<style>
.page-header__header--separation {
  margin-bottom: 10px;
  font-size:     24px;
}
</style>
