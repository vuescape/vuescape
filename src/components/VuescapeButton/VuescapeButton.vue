<template>
  <v-btn
    @click="() => onButtonClick($event)"
    small
    outline
    depressed
    color="primary"
    class="vuescape-button__v-btn--style"
    :disabled="isButtonDisabled"
    :value="value"
  >
    <font-awesome-icon
      v-if="icons.length && iconPosition === 'before'"
      :icon="icons"
      class="vuescape-button__v-icon--font"
      :style="isButtonDisabled ? { color: 'rgb(85, 85, 85, 0.26)' } : { color: 'rgb(85, 85, 85)' }"
    />
    <slot></slot>
    <font-awesome-icon
      v-if="icons.length && iconPosition === 'after'"
      :icon="icons"
      class="vuescape-button__v-icon--font"
      :style="isButtonDisabled ? { color: 'rgb(85, 85, 85, 0.26)' } : { color: 'rgb(85, 85, 85)' }"
    />
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class VuescapeButton extends Vue {
  private isButtonDisabled = false

  @Prop({ type: Array, default: () => [] })
  private icons: Array<string>

  @Prop({ type: String })
  private value: string

  @Prop({ type: String, default: 'before' })
  private iconPosition: 'before' | 'after'

  @Prop({ type: Boolean, default: false })
  private isDisabled: boolean

  @Watch('isDisabled')
  private isDisabledWatcher(val: boolean, oldVal: boolean) {
    this.isButtonDisabled = val
  }

  private onButtonClick(event: any) {
    if (!this.isButtonDisabled) {
      this.$emit('click', event)
    }
  }

  private created() {
    this.isButtonDisabled = this.isDisabled
  }
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
  height: 24px;
}
.vuescape-button__v-icon--font {
  font-size: 15px;
}
.vuescape-button__v-btn--style.v-btn--disabled {
  cursor: not-allowed;
  pointer-events: all;
}
.vuescape-button__v-btn--style.v-btn--disabled:hover:before {
  background-color: unset !important;
}
</style>
