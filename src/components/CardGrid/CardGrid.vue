<template>
  <v-layout justify-center>
    <v-flex
      xs12
      sm6
    >
      <v-container
        fluid
        grid-list-md
      >
        <v-layout
          row
          wrap
        >
          <v-flex
            v-for="card in cards"
            v-bind="{ [`xs${card.flex}`]: true }"
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
                <v-container
                  fill-height
                  fluid
                  pa-2
                >
                  <v-layout fill-height>
                    <v-flex
                      xs12
                      align-end
                      flexbox
                    >
                      <span
                        class="headline"
                        v-text="card.title"
                      ></span>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </a>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'

@Component
export default class CardGrid extends ComponentBase {
  @Prop({ type: Array, required: true })
  public cards: Array<any>
}
</script>

<style scoped>
.card-grid__resource--href {
  text-decoration: none;
  overflow: hidden;
}
.card-grid__resource-image--response {
  width: 100%;
  height: auto;
}
.card-grid__resource-card--full-height {
  height: 100% !important;
}
</style>
