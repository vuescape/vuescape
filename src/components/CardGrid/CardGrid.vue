<template>
  <div class="layout justify-center">
    <div
      class="flex xs12 sm6"
    >
      <div
        class="container fluid grid-list-md"
      >
        <div
          class="layout row wrap"
        >
          <div
            class="flex"
            :class="`xs${card.flex}`"
            v-for="card in cards"
            :key="card.title"
          >
            <a
              :href="card.target"
              target="_blank"
              class="card-grid__resource--href"
            >
              <v-card class="card-grid__resource-card--full-height">
                <img
                  :alt="card.alt"
                  :src="card.src"
                  height="100px"
                  class="card-grid__resource-image--response"
                />
                <div
                  class="container fill-height fluid pa-2"
                >
                  <div class="layout fill-height">
                    <div
                      class="flex xs12 align-end flexbox"
                    >
                      <span
                        class="text-headline-small"
                        v-text="card.title"
                      ></span>
                    </div>
                  </div>
                </div>
              </v-card>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, toNative } from '@vuescape/decorators'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

@Component
class CardGrid extends ComponentBase {
  @Prop({ type: Array, required: true })
  private cards: Array<any>
}

export default toNative(CardGrid)
</script>

<style>
.card-grid__resource--href {
  text-decoration: none;
  overflow:        hidden;
}
.card-grid__resource-image--response {
  width:  100%;
  height: auto;
}
.card-grid__resource-card--full-height {
  height: 100% !important;
}
</style>
