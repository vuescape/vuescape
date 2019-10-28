<template>
  <div>
    <page-header
      v-if="title"
      :title="title"
    >
      <slot name="header"></slot>
    </page-header>
    <v-layout
      row
      wrap
    >
      <slot></slot>
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

const PageHeader = () =>
  import(/* webpackChunkName: 'page-header' */ '@vuescape/components/PageHeader').then(m => m.default)

@Component({
  components: { PageHeader },
})
export default class PageTemplate extends Vue {
  @Prop({ default: '' })
  private title: string
}
</script>
