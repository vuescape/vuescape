<template>
  <v-layout
    :key="idValue"
    row
    justify-center
  >
    <v-dialog
      v-model="isModalDialogShowingValue"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title
          v-if="titleValue"
          class="modal-dialog__dialog--title"
        >{{ titleValue }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout
            row
            wrap
          >
            <v-flex xs2>
              <i
                :class="iconsValue.join(' ')"
                :style="{
                      '--fa-secondary-color': '#FDB833',
                      '--fa-secondary-opacity': '1',
                      '--fa-primary-opacity': '0',
                      'font-size': '46px',
                    }"
              ></i>
            </v-flex>
            <v-flex xs10>
              <div>
                {{ messageValue }}
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="shouldShowCancelButtonValue"
            @click="onCancelClicked"
            class="modal-dialog__v-btn--cancel"
            flat
          >{{ cancelButtonTextValue }}
          </v-btn>
          <vuescape-button
            v-if="shouldShowOKButtonValue"
            Depressed
            @click="onOKClicked"
            class="modal-dialog__v-btn--ok"
          >
            {{ okButtonTextValue }}
          </vuescape-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

const VuescapeButton = () => import(/* webpackChunkName: 'vuescape-button' */ '@vuescape/components/VuescapeButton/').then(
  m => m.default)

@Component({
  components: { VuescapeButton },
})
export default class ModalDialog extends Vue {
  private idValue                     = ''
  private isModalDialogShowingValue   = false
  private titleValue                  = ''
  private okButtonTextValue           = ''
  private cancelButtonTextValue       = ''
  private shouldShowOKButtonValue     = true
  private shouldShowCancelButtonValue = true
  private iconsValue: Array<string> = []
  private messageValue = ''

  @Prop({ type: String, default: '' })
  private id: string

  @Prop({ type: Boolean, default: false })
  private isModalDialogShowing: boolean

  @Prop({ type: String, required: false })
  private title: string

  @Prop({ type: String, default: 'OK' })
  private okButtonText: string

  @Prop({ type: String, default: 'Cancel' })
  private cancelButtonText: string

  @Prop({ type: Boolean, default: true })
  private shouldShowOKButton: boolean

  @Prop({ type: Boolean, default: true })
  private shouldShowCancelButton: boolean

  @Prop({ type: Array, default: () => ['fa-duotone', 'fa-circle-exclamation'] })
  private icons: Array<string>

  @Prop({ type: String, required: false })
  private message: string

  @Watch('id')
  private onIdChanged(newValue: string, oldValue: string) {
    this.idValue = newValue
  }

  @Watch('isModalDialogShowing')
  private onIsModalDialogShowingChanged(newValue: boolean, oldValue: boolean) {
    this.isModalDialogShowingValue = newValue
  }

  @Watch('isModalDialogShowingValue')
  private onIsModalDialogShowingValueChanged(newValue: boolean, oldValue: boolean) {
    if (newValue !== oldValue) {
      if (newValue) {
        this.$emit('dialog-open')
      }
      else {
        this.$emit('dialog-close')
      }
    }
  }

  @Watch('title')
  private onTitleChanged(newValue: string, oldValue: string) {
    this.titleValue = newValue
  }

  @Watch('okButtonText')
  private onOKButtonTextChanged(newValue: string, oldValue: string) {
    this.okButtonTextValue = newValue
  }

  @Watch('cancelButtonText')
  private onCancelButtonTextChanged(newValue: string, oldValue: string) {
    this.cancelButtonTextValue = newValue
  }

  @Watch('shouldShowOKButton')
  private onShouldShowOKButtonChanged(newValue: boolean, oldValue: boolean) {
    this.shouldShowOKButtonValue = newValue
  }

  @Watch('shouldShowCancelButton')
  private onShouldShowCancelButtonChanged(newValue: boolean, oldValue: boolean) {
    this.shouldShowCancelButtonValue = newValue
  }

  @Watch('icons')
  private onIconsChanged(newValue: Array<string>, oldValue: Array<string>) {
    this.iconsValue = newValue
  }

  @Watch('message')
  private onMessageChanged(newValue: string, oldValue: string) {
    this.messageValue = newValue
  }

  private onCancelClicked(e: any) {
    this.isModalDialogShowingValue = false
    this.$emit('cancel-click')
  }

  private onOKClicked(e: any) {
    this.isModalDialogShowingValue = false
    this.$emit('ok-click')
  }

  private created() {
    this.idValue                     = this.id
    this.isModalDialogShowingValue   = this.isModalDialogShowing
    this.titleValue                  = this.title
    this.okButtonTextValue           = this.okButtonText
    this.cancelButtonTextValue       = this.cancelButtonText
    this.shouldShowOKButtonValue     = this.shouldShowOKButton
    this.shouldShowCancelButtonValue = this.shouldShowCancelButton
    this.iconsValue                  = this.icons
    this.messageValue                = this.message
  }
}
</script>

<style>
.modal-dialog__dialog--title {
  font-size:   18px;
  font-weight: 500;
}
.modal-dialog__v-btn--cancel {
  text-decoration: underline;
  font-size:       16px;
  height:          40px;
}
div.v-card__actions button.modal-dialog__v-btn--ok {
  height:           40px;
  background-color: #16a5c6 !important;
  color:            white !important;
  font-size:        16px;
}
</style>
