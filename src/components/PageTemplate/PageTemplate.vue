<template>
  <div style="height: calc(100vh - 72px); position: relative;">
    <page-header
      v-if="title"
      :title="title"
      ref="page-template__header"
    >
      <slot name="header"></slot>
    </page-header>
    <div
      class="layout row wrap"
      ref="page-template__body"
    >
      <slot></slot>
    </div>
    <div
      class="layout row wrap"
      ref="page-template__footer"
    >
      <!-- TODO: v-if if nothing in footer -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'
import { defineAsyncComponent } from 'vue'

const PageHeader = defineAsyncComponent(() => import(/* webpackChunkName: 'page-header' */ '@vuescape/components/PageHeader').then(m => m.default))

@Component({
  components: { PageHeader },
})
class PageTemplate extends Vue {
  @Prop({ default: '' })
  private title: string

  @Prop({ type: Boolean, default: false })
  private shouldFixFooterAtBottom: boolean
}

export default toNative(PageTemplate)
</script>
