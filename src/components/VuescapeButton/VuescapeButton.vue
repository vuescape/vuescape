<template>
  <v-btn @click="$emit('click', $event)" small outline depressed color="primary" class="vuescape-button__v-btn--style"
    >
    <font-awesome-icon :icon="icons" class="vuescape-button__v-icon--font" :style="{ color: '#555'}" />

    <!-- <v-icon v-if="icons" class="vuescape-button__v-icon--font">{{ icons }}</v-icon> -->
    <slot></slot
  ></v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class VuescapeButton extends Vue {
  @Prop({ type: Array })
  private icons: Array<string>
}
</script>

<style>
/* turn off min-width for all buttons because buttons are too large by default */
.v-btn {
  min-width: 0;
}
.vuescape-button__v-btn--style {
  margin-bottom: 0;
  font-size: 11px;
  border-color: #dddddd !important;
  /* margin-top: -4px; */
  border-radius: 5px;
  height: 26px;
}
.vuescape-button__v-icon--font {
  font-size: 15px;
  /* margin-top: -1px; */
}
/* button.vuescape-button__v-btn--style .v-btn__content svg {

} */
</style>
