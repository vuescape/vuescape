<template>
  <v-autocomplete
    v-on="$listeners"
    v-bind="$attrs"
    :label="label"
    :no-data-text="noDataText"
    :filter="filterFunctionImpl"
    :return-object="true"
    menu-props="auto"
  >
    <!-- https://stackoverflow.com/questions/50891858/vue-how-to-pass-down-slots-inside-wrapper-component -->
    <!-- Pass on all named slots -->
    <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />
    <!-- Pass on all scoped slots -->
    <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope"
      ><slot :name="slot" v-bind="scope"
    /></template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class ItemSelect extends Vue {
  @Prop({ type: String, required: false, default: 'Select an Item' })
  private label: string
  @Prop({ type: String, required: false, default: 'No Items Found' })
  private noDataText: string
  @Prop({ type: Function, required: false })
  private filterFunction: (item: any, queryText: string) => boolean
  @Prop({ type: Array, required: false, default: () => ['id', 'name'] })
  private filterProperties: Array<string>
  @Prop({ type: Function, required: false })
  private beforeFilter: any

  private get filterFunctionImpl() {
    return this.filterFunction || this.doFilter
  }

  private doFilter(item: any, queryText: string) {
    if (!queryText || !item) {
      return true
    }
    if (this.beforeFilter) {
      this.beforeFilter()
    }
    const lowerCaseQueryText = queryText.toLowerCase()
    const isFound = this.filterProperties.some(propertyName =>
      this.compareProperty(item, propertyName, lowerCaseQueryText),
    )
    return isFound
  }

  private compareProperty(item: any, propertyName: string, query: string) {
    return item[propertyName] && item[propertyName].toLowerCase().indexOf(query) !== -1
  }
}
</script>

<style>
/* To size font awesome svg icon in the apped slot */
.v-input__append-inner .v-input__icon--append svg.v-icon {
  font-size: 13px;
}
</style>