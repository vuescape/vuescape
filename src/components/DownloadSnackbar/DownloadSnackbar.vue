<template>
  <v-snackbar
    absolute
    :timeout="0"
    :bottom="true"
    :right="true"
    v-model="shouldShowDownloadSnackbar"
  >
    <div>
      <v-layout row>
        <v-flex xs12>
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-flex
        >
      </v-layout>
      <v-layout
        row
        style="margin-top: -10px"
      >
        <v-flex xs12>
          <slot> Your file is being prepared for download.</slot>
          <v-btn
            flat
            color="primary"
            @click="() => setShouldShowDownloadSnackbar(false)"
          >Close
          </v-btn>
        </v-flex>
      </v-layout
      >
    </div>
  </v-snackbar>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import { StoreOperation } from '@vuescape/store/modules/types'

import { ComponentBase } from '@vuescape/index'

@Component({})
export default class DownloadSnackbar extends ComponentBase {
  public static DownloadSnackbarNamespace = 'downloadSnackbar'

  @namespace(DownloadSnackbar.DownloadSnackbarNamespace).State(state => {
    if (state && state.value) {
      return state.value.shouldShowDownloadSnackbar
    }
    return false
  })
  private shouldShowDownloadSnackbar: boolean

  @namespace(DownloadSnackbar.DownloadSnackbarNamespace).Mutation(StoreOperation.Mutation.SET_VALUE)
  private setShouldShowDownloadSnackbarValue: any

  private setShouldShowDownloadSnackbar(shouldShowDownloadSnackbar: boolean) {
    this.setShouldShowDownloadSnackbarValue(this.setShouldShowDownloadSnackbarValue)
  }

  private async created() {
    this.registerStoreModuleWithInitialValueIfNotExists<{ shouldShowDownloadSnackbar: boolean }>(
      DownloadSnackbar.DownloadSnackbarNamespace,
      {
        shouldShowDownloadSnackbar: false,
      },
    )
  }
}
</script>
