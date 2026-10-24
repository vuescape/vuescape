<template>
  <div>
    <div v-if="renderAs === RenderText">
      <text-renderer :item="item"></text-renderer>
    </div>
    <!-- <div v-if="renderAs === RenderKind.Table">
      Table
    </div> -->
    <div v-if="renderAs === RenderDataTable">
      Data Table
    </div>
    <!--
    <div v-if="renderAs === RenderKind.Tree">
      Tree
    </div>
    <div v-if="renderAs === RenderKind.Card">
      Card
    </div>
    <div v-if="renderAs === RenderKind.Form">
      Form
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from '@vuescape/decorators'
import { defineAsyncComponent } from 'vue'

import { RenderKind } from './RenderKind'

const DataTableRenderer = defineAsyncComponent(() => import(/* webpackChunkName: 'data-table-renderer' */ '@vuescape/components/ObjectRenderer').then(
  m => m.DataTableRenderer))
const TextRenderer      = defineAsyncComponent(() => import(/* webpackChunkName: 'text-renderer' */ '@vuescape/components/ObjectRenderer').then(
  m => m.TextRenderer))

@Component({
  components: {
    DataTableRenderer,
    TextRenderer,
  },
})
class ObjectRenderer extends Vue {
  @Prop() private renderAs: RenderKind
  @Prop() private item: any
  private readonly RenderText = RenderKind.Text
  private readonly RenderDataTable = RenderKind.DataTable
}

export default toNative(ObjectRenderer)
</script>
