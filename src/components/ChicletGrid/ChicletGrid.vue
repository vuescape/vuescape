<template>
  <v-container
    ref="chicletGridContainer"
    grid-list-lg
    text-xs-center
    style="display: inline"
    class="chiclet-grid__container"
  >
    <template v-for="rowIndex in Math.ceil(visibleChiclets.length / numberOfColumns)">
      <v-layout
        justify-center
        row
        v-bind:key="rowIndex + '_icon'"
      >
        <v-flex
          v-for="chiclet in getChiclets(rowIndex, numberOfColumns)"
          v-bind="{ [`xs${breakpoints}`]: true }"
          v-bind:key="chiclet.id + '_icon'"
          class="chiclet-grid__chiclet--layout"
        >
          <a
            :style="chiclet.isVisible ? 'visibility: visible;' : 'visibility: hidden;'"
            v-if="chiclet.link"
            :href="chiclet.link.href"
            :target="chiclet.link.target"
          >
            <v-card
              flat
              tile
              class="chiclet-grid__v-card--hover"
              :class="chiclet.cssClass"
              :width="chicletWidth"
              :height="chicletHeight"
              style="margin-top: -10px; border-radius: 20px; background-color: #eeeeee"
            >
              <font-awesome-icon
                :title="chiclet.title"
                :icon="chiclet.icons"
                :style="{
                    'font-size': '8em',
                    'margin-top': '.22em',
                    color: '#555555',
                  }"
              />
            </v-card>
          </a>
          <v-card
            @click="chiclet.onclick"
            v-else
            flat
            tile
            :class="['chiclet-grid__v-card--hover',
            chiclet.cssClass,
            !chiclet.icons || !chiclet.icons.length ? 'chiclet-grid__title--center-vertical' : '' ]"
            :width="chicletWidth"
            :height="chicletHeight"
            :style="chiclet.isVisible ? 'visibility: visible;' : 'visibility: hidden;'"
          >
            <font-awesome-icon
              v-if="chiclet.icons && chiclet.icons.length"
              :title="chiclet.title"
              :icon="chiclet.icons"
              :style="{
                  'font-size': '8em',
                  'margin-top': '.22em',
                  color: '#555555',
                }"
            />
            <span
              v-else
              class="chiclet-grid__title--inside"
              :class="chiclet.cssClass"
            >
              {{ chiclet.title }}
            </span>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout
        v-if="titleRenderingStrategy === 'TitleUnderChiclet'"
        justify-center
        row
        v-bind:key="rowIndex + '_text'"
        style="margin-top: -10px; margin-bottom: 50px"
      >
        <v-flex
          v-for="chiclet in getChiclets(rowIndex, numberOfColumns)"
          v-bind:key="chiclet.id + '_text'"
          v-bind="{ [`xs${breakpoints}`]: true }"
          class="chiclet-grid__chiclet--layout"
        >
          <span
            class="chiclet-grid__span--title-under"
            :style="chiclet.isVisible ? 'visibility: visible;' : 'visibility: hidden;'"
          >{{ chiclet.title }}</span>
        </v-flex>
      </v-layout>
    </template>
  </v-container>

</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'
import { Chiclet } from '@vuescape/types'

@Component
export default class ChicletGrid extends ComponentBase {
  private get visibleChiclets() {
    const result = this.chicletsValue.filter((_: any) => _.isVisible)
    return result
  }

  @Prop({ type: Array, required: true })
  private chiclets: Array<Chiclet>

  @Prop({ type: Number, default: 162 })
  private chicletHeight?: number

  @Prop({ type: Number, default: 162 })
  private chicletWidth?: number

  @Prop({ type: String, default: 'TitleUnderChiclet' })
  private titleRenderingStrategy: 'TitleUnderChiclet' | 'TitleInChiclet'

  private chicletsValue: Array<Chiclet> = []
  private numberOfColumns = 5
  private breakpoints = 4

  @(namespace('window/availableHeight').State((state: any) => state.value))
  private availableHeight: Array<number>

  @Watch('chiclets')
  private onChicletsChanged(newVal: Array<Chiclet>, oldVal: Array<Chiclet>) {
    this.chicletsValue = newVal
  }

  @Watch('availableHeight')
  private onAvailableHeightChanged(newVal: Array<number>, oldVal: Array<number>) {
    // TODO: Can use refs
    const chicletGridContainer = document.querySelector('.chiclet-grid__container')
    if (chicletGridContainer && chicletGridContainer.parentElement) {
      const width          = chicletGridContainer.parentElement.clientWidth
      this.numberOfColumns = Math.floor(width / 230)
      this.breakpoints     = Math.ceil(12 / this.numberOfColumns)
    }
  }

  private getChiclets(rowIndex: number, numberOfColumns: number) {
    const results             = this.visibleChiclets.slice((rowIndex - 1) * numberOfColumns,
      (rowIndex - 1) * numberOfColumns + numberOfColumns,
    )
    const numberOfColumnsLeft = results.length
    for (let i = 0; i < numberOfColumns - numberOfColumnsLeft; i++) {
      results.push({
        id       : 'dummy' + i,
        title    : '',
        icons    : [],
        isVisible: false,
      })
    }
    return results
  }

  private async mounted() {
    this.onAvailableHeightChanged([0], [0])
  }

  private created() {
    this.chicletsValue = this.chiclets
  }
}
</script>

<style>
.chiclet-grid__container .chiclet-grid__v-card--hover:hover {
  border: 2px solid rgb(173, 227, 239);
}
.chiclet-grid__container .chiclet-grid__v-card--hover {
  border:           2px solid #eeeeee;
  background-color: #eeeeee;
  margin-top:       -10px;
  cursor:           pointer;
  border-radius:    20px;
}
.chiclet-grid__chiclet--layout {
  display:      unset;
  margin-left:  10px;
  margin-right: 10px;
}
.chiclet-grid__title--inside {
  font-weight:  500;
  font-size:    16px;
  margin-right: 4px;
  margin-left:  4px;
  line-height:  20px;
}
.chiclet-grid__span--title-under {
  font-size:   15px;
  font-weight: 500;
  width:       160px;
  max-width:   160px;
  min-width:   160px;
  display:     block;
}
.chiclet-grid__title--center-vertical {
  display:         flex;
  justify-content: center;
  align-content:   center;
  flex-direction:  column;
}
</style>
