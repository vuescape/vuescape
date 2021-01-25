<template>
  <div>
    <v-menu
      :close-on-content-click="false"
      offset-x
      :nudge-left="nudgeLeft"
      origin="center right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          outline
          depressed
          v-on="on"
          class="legend-table__v-btn--style"
        >
          <font-awesome-icon
            :icon="['fas', 'info']"
            class="legend-table__font-awesome-icon--style"
          />
          <!-- <v-icon>fas fa-info</v-icon> -->
        </v-btn>
      </template>

      <div class="legend-table__div--spaced">
        <table class="legend-table__table--legend">
          <slot name="header">
            <thead>
              <tr>
                <td>&nbsp;</td>
                <td>Legend</td>
              </tr>
            </thead>
          </slot>
          <tbody>
            <slot></slot>
          </tbody>
        </table>
      </div>
    </v-menu>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({})
export default class LegendTable extends Vue {
  @Prop({ type: Number, default: 315 })
  private nudgeLeft: number
}
</script>

<style>
.legend-table__div--spaced {
  background: white;
  padding: 10px;
}
.legend-table__font-awesome-icon--style {
  color: #bbbbbb;
  font-size: 14px;
  margin-right: 0px;
}
.legend-table__v-btn--style {
  border: 1px solid #dddddd !important;
  border-radius: 5px;
  height: 26px;
  width: 26px;
  padding-left: 8px;
  padding-right: 8px;
  margin-top: 6px;
  margin-right: 6px;
  margin-bottom: -7px;
  vertical-align: text-bottom;
}
table.legend-table__table--legend thead td {
  border: 0px;
  background-color: #16a5c6 !important;
  color: #ffffff;
  text-align: center;
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  padding-right: 20px;
  padding-left: 20px;
  border-bottom-color: rgb(85, 85, 85);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
table.legend-table__table--legend tbody td {
  padding-left: 10px;
  padding-right: 10px;
}
table.legend-table__table--legend {
  border-collapse: collapse;
  /* font-family: 'Segoe UI'; */
  padding: 10px;
}
table.legend-table__table--legend tr {
  height: 28px;
  min-width: 100px;
}
table.legend-table__table--legend tr:last-child {
  border-bottom-color: rgb(85, 85, 85);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
table.legend-table__table--legend thead td {
  font-size: 13px;
  border: 0px;
  background-color: #16a5c6 !important;
  color: #ffffff;
  text-align: center;
  height: 32px;
  font-weight: 500;
  padding-right: 20px;
  padding-left: 20px;
  border-bottom-color: rgb(85, 85, 85);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
table.legend-table__table--legend tbody td {
  padding-left: 10px;
  padding-right: 10px;
  font-size: 13px;
}
</style>
