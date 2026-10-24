<template>
  <v-snackbar
    attach
    contained
    :timeout="-1"
    v-model="shouldShowDownloadSnackbar"
    location="bottom end"
  >
    <div>
      <div class="layout row">
        <div class="flex xs12">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </div>
      </div>
      <div
        class="layout row"
        style="margin-top: -10px"
      >
        <div class="flex xs12">
          <slot> Your file is being prepared for download.</slot>
          <v-btn
            color="primary"
            @click="() => setShouldShowDownloadSnackbar(false)"
            variant="text"
          >Close
          </v-btn>
        </div>
      </div>
    </div>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, namespace, toNative } from '@vuescape/decorators'

import { StoreOperation } from '@vuescape/store/modules/types'

import { ComponentBase } from '@vuescape/index'

import { DownloadSnackbarNamespace } from './DownloadSnackbarNamespace'

@Component({})
class DownloadSnackbar extends ComponentBase {
  public static DownloadSnackbarNamespace = DownloadSnackbarNamespace

  @(namespace(DownloadSnackbar.DownloadSnackbarNamespace).State(state => {
    if (state && state.value) {
      return state.value.shouldShowDownloadSnackbar
    }
    return false
  }))
  private shouldShowDownloadSnackbar: boolean

  @(namespace(DownloadSnackbar.DownloadSnackbarNamespace).Mutation(StoreOperation.Mutation.SET_VALUE))
  private setShouldShowDownloadSnackbarValue: any

  private setShouldShowDownloadSnackbar(shouldShowDownloadSnackbar: boolean) {
    this.setShouldShowDownloadSnackbarValue(this.setShouldShowDownloadSnackbarValue)
  }

  private async created() {
    this.registerStoreModuleWithInitialValueIfNotExists<{ shouldShowDownloadSnackbar: boolean }>(DownloadSnackbar.DownloadSnackbarNamespace,
      {
        shouldShowDownloadSnackbar: false,
      },
    )
  }
}

export default toNative(DownloadSnackbar)
</script>
