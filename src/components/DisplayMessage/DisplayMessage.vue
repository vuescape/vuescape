<template>
  <div
    :class="containerCss"
  >
    <div
      v-if="title"
      class="display-message__title--format"
    >{{ title }}
    </div>
    <v-layout
      align-bottom
      fill-height
      justify-start
      row
    >
      <v-flex
        lg12
        md12
        xs12
      >
        <br>
      </v-flex>
    </v-layout>
    <v-layout
      align-bottom
      fill-height
      justify-start
      row
    >
      <v-flex
        lg12
        md12
        xs12
      >
        <div
          v-if="messageType === MessageType.Html"
          v-html="contentValue"
        ></div>
        <div
          v-if="messageType === MessageType.Text"
        >{{ contentValue }}
        </div>
        <div
          v-if="messageType === MessageType.NotificationMessage"
        >
          <v-alert
            :key="contentValue.key"
            :type="contentValue.type"
            :value="contentValue"
            class="display-message__v-alert--margin"
            outline
            transition="fade-transition"
          >
            {{ contentValue.message }}
          </v-alert>
        </div>
        <div
          v-if="messageType === MessageType.SessionTimeout || messageType === MessageType.SignedOut"
        >{{ contentValue }}
        </div>
      </v-flex>
    </v-layout>
    <br />
    <v-layout
      v-if="actionText"
      align-bottom
      fill-height
      justify-center
      row
    >
      <div
        class="xs12"
      >
        <v-btn
          class="display-message"
          color="secondary"
          depressed
          value=""
          @click="clickAction"
        >{{ actionText }}
        </v-btn
        >
      </div>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'

import ComponentBase from '@vuescape/infrastructure/ComponentBase'
import { NotificationMessage } from '@vuescape/store/modules'
import { MessageType } from '@vuescape/types'

@Component({
  computed: {
    MessageType() {
      return MessageType
    },
  },
})
export default class DisplayMessage extends ComponentBase {
  private contentValue: string | NotificationMessage = ''

  @Prop({
    type    : Number,
    required: true,
  }) private messageType: MessageType

  @Prop({
    type    : String,
    required: false,
  }) private containerCss: string

  @Prop({
    type    : String,
    required: false,
  }) private title: string

  @Prop({
    type    : Object,
    required: false,
  }) private content: string | NotificationMessage

  @Prop({
    type   : Function,
    default: () => { /* no-op */
    },
  }) private action: () => {}

  @Prop({
    type    : String,
    required: false,
  }) private actionText: string

  private clickAction() {
    this.action()
  }

  private created() {
    this.messageType = this.messageType ?? MessageType.SignedOut

    switch (this.messageType) {
      case MessageType.None:
        console.warn(`Prop MessageType value is ${MessageType.None} so no content will be displayed.`)
        break
      case MessageType.Html:
      case MessageType.Text:
        this.contentValue = this.content as string
        break
      case MessageType.NotificationMessage:
        this.contentValue = this.content as NotificationMessage
        break
      case MessageType.SessionTimeout:
        this.title        = 'Your Session Has Expired'
        this.contentValue = 'For your security you have been automatically signed out.  To sign in click the button below.'
        break
      case MessageType.SignedOut:
        this.title        = 'You Have Been Signed Out'
        this.contentValue = 'To sign in click the button below.'
        break
    }
  }
}
</script>

<style>
.display-message__title--format {
  font-size:   16.8px;
  font-weight: 500;
  text-align:  left;
  margin-top:  18px
}
.display-message__v-alert--margin {
  margin-top:   1em;
  margin-right: 10px;
  font-weight:  500;
}
.display-message__btn {
  margin-top: 10px;
  width:      100%;
  margin:     0px;
}

</style>
