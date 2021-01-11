<template>
  <span></span>
</template>

<script <script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { TreeTableItem } from '@vuescape/components/TreeTable'
import ComponentBase from '@vuescape/infrastructure/ComponentBase'

@Component({})
export default class EmptyCellRenderer extends ComponentBase {
  @Prop({ type: Object, required: true })
  private cell: TreeTableItem

  @Prop({ type: Boolean, default: false })
  private isHovering: boolean
}
</script>
