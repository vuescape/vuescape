<template>
  <div>
    <v-layout
      v-if="title"
      row
      justify-space-between
      class="page-header__header--separation"
    >
      <v-flex md8>
        <span>{{ title }}</span>
      </v-flex>
    </v-layout>
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
