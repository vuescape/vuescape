<template>
  <div>
    <v-card>
      <v-card-title style="width:98vw;">
        <slot name="header"></slot>
      </v-card-title>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      hide-default-footer
      :items-per-page="-1"
    >
      <template v-slot:item="props">
        <tr>
          <td
            v-for="(value, key) in props.item"
            :key="key"
            class="text-left"
          >{{ value }}
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        <v-alert
          :model-value="!areResultsFound"
          color="primary"
          variant="outlined"
        >
          No Results Found
        </v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue, Watch } from '@vuescape/decorators'

@Component
class DataTableRenderer extends Vue {
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
    }
    else if (this.shouldAddSpacesToColumnHeaders) {
      if (val && val.length > 0) {
        const firstItem = val[0]
        Object.keys(firstItem).forEach((key, index) => {
          const inferredColumnHeading = this.sentenceFromCamelCase(this.capitalizeFirstCharacter(key))
          this.headers.push({
            title: inferredColumnHeading,
            key,
            align: 'start',
          })
        })
      }
    }
    else {
      if (val && val.length > 0) {
        const firstItem = val[0]
        Object.keys(firstItem).forEach((key, index) => {
          this.headers.push({
            title: key,
            key,
            align: 'start',
          })
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

export default toNative(DataTableRenderer)
</script>
