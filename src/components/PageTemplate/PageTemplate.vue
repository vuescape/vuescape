<template>
  <div>
    <page-header
      v-if="title"
      :title="title"
      ref="page-template__header"
    >
      <slot name="header"></slot>
    </page-header>
    <v-layout
      row
      wrap
      ref="page-template__body"
    >
      <slot></slot>
    </v-layout>
    <v-layout
      row
      wrap
      ref="page-template__footer"
    >
      <!-- TODO: v-if if nothing in footer -->
      <slot name="footer"></slot>
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

  @Prop({ type: Boolean, default: false })
  private shouldFixFooterAtBottom: boolean
}
</script>
