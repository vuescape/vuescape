<template>
  <div>
    <v-card>
      <v-card-title style="width:98vw;">
        <slot name="header"></slot>
      </v-card-title>
    </v-card>
    <v-data-table :headers="headers" :items="items" :search="search" hide-actions>
      <template slot="items" slot-scope="props">
        <!-- // eslint-disable-line require-v-for-key -->
        <td v-for="(value) in props.item" class="text-xs-left">{{ value }}</td>
      </template>
      <template slot="no-data">
        <v-alert :value="!areResultsFound" outline color="primary">
          No Results Found
        </v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class DataTableRenderer extends Vue {
  // TODO: what type is data table header
  private headers: Array<any> = []

  @Prop() private items: Array<object>
  @Prop() private areResultsFound: boolean
  @Prop() private isLoading: boolean
  @Prop() private search: string
  @Prop() private columnHeaders: Array<any>
  @Prop() private shouldAddSpacesToColumnHeaders: boolean

  @Watch('items')
  private onItemsChanged(val: string, oldVal: string) {
    this.headers.splice(0)
    if (this.columnHeaders && this.columnHeaders.length !== 0) {
      this.headers = this.columnHeaders
    } else if (this.shouldAddSpacesToColumnHeaders) {
      if (val && val.length > 0) {
        const firstItem = val[0]
        Object.keys(firstItem).forEach((key, index) => {
          const inferredColumnHeading = this.sentenceFromCamelCase(this.capitalizeFirstCharacter(key))
          this.headers.push({ text: inferredColumnHeading, value: key, align: 'left' })
        })
      }
    } else {
      if (val && val.length > 0) {
        const firstItem = val[0]
        Object.keys(firstItem).forEach((key, index) => {
          this.headers.push({ text: key, value: key, align: 'left' })
        })
      }
    }
  }

  private capitalizeFirstCharacter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
  private sentenceFromCamelCase(text: string) {
    return text.replace(/([A-Z])/g, ' $1').slice(1)
  }
}
</script>
