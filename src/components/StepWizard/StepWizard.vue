<template>
  <div class="step-wizard__stepper-box">
    <div
      v-if="shouldShowProgressBarValue"
      class="top"
    >
      <div class="steps-wrapper">
        <template v-if="shouldShowTopButtons">
          <div
            v-if="currentStepIndex > 0"
            class="stepper-button-top previous"
            @click="backStep()"
          >
            <i class="fa-duotone fa-arrow-alt-circle-left" />
          </div>
        </template>
        <template v-for="(step, index) in steps">
          <div
            :key="index"
            :class="['step', getStepStatus(index, step)]"
            :style="{ width: `${100 / steps.length}%` }"
          >
            <div
              :class="{ 'divider-line': index !== steps.length - 1 }"
              class="circle"
            >
              <!-- <div class="divider-line" :style="{ width: `${(100 / steps.length) * (steps.length - 1) - 10}%` }"></div> -->
              <!-- TODO: -->
              <!-- <font-awesome-icon :icon="['fa-light', 'chevron-down']" /> -->
              <!-- <i class="material-icons md-18">
                {{ step.completed ? 'done' : step.icon }}
              </i> -->
            </div>
            <div class="step-title">
              <h4>{{ step.title }}</h4>
              <h5 class="step-subtitle">{{ step.subtitle }}</h5>
            </div>
          </div>
        </template>
        <div
          v-if="shouldShowTopButtons"
          :class="['stepper-button-top next', !canContinue ? 'deactivated' : '']"
          @click="nextStep()"
        >
          <i class="fa-duotone fa-arrow-alt-circle-right" />
        </div>
      </div>
    </div>
    <div
      v-else
      style="height: 63.66px;"
    ></div>
    <div
      v-loading="isSpinning"
      class="content"
    >
      <transition
        :name="enterAnimation"
        mode="out-in"
      >
        <!--If keep alive-->
        <keep-alive v-if="steps[currentStepIndex] && steps[currentStepIndex].shouldKeepComponentAlive">
          <component
            :is="steps[currentStepIndex].component"
            :key="steps[currentStepIndex].name + currentStepIndex"
            :clickedNext="nextButton[currentStepIndex]"
            :current-step="steps[currentStepIndex]"
            v-bind="steps[currentStepIndex].props"
            @can-continue="proceed"
            @component-activated="componentActivated"
            @change-next="changeNextBtnValue"
          ></component>
        </keep-alive>
        <!--If not show component and destroy it in each step change. Instead of v-else use another v-if with the opposite logic to avoid a script error.-->
        <component
          :is="steps[currentStepIndex].component"
          v-if="steps[currentStepIndex] && !steps[currentStepIndex].shouldKeepComponentAlive"
          :key="steps[currentStepIndex].name + currentStepIndex"
          :clickedNext="nextButton[currentStepIndex]"
          :current-step="steps[currentStepIndex]"
          v-bind="steps[currentStepIndex].props"
          @can-continue="proceed"
          @change-next="changeNextBtnValue"
        ></component>
      </transition>
    </div>
    <div class="content">
      <div class="bottom">
        <!-- only-next -->
        <div class="stepper-button previous">
          <vuescape-button
            v-if="currentStepIndex !== 0"
            :disabled="false"
            :icons="['fa-duotone', 'arrow-alt-circle-left']"
            Depressed
            @click="backStep()"
          >
            &nbsp;Back
          </vuescape-button>
        </div>
        <div
          v-if="cancelRouteOrCallback"
          class="cancel-div"
        >
          <v-btn
            class="cancel"
            flat
            @click="cancel"
          >Cancel
          </v-btn>
          <!-- <a class="cancel" @click="cancel">Cancel</a> -->
        </div>
        <div
          class="stepper-button next"
        >
          <vuescape-button
            :class="{ finalStep: isFinalStep }"
            :icons="isFinalStep ? ['fa-duotone', 'arrow-alt-circle-right'] : ['fa-duotone', 'arrow-alt-circle-right']"
            :isDisabled="!canContinue"
            Depressed
            iconPosition="after"
            @click="nextStep()"
          >
            {{ isFinalStep ? finalStepButtonTextValue : 'Next' }}&nbsp;
          </vuescape-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Step } from './Step'

const VuescapeButton = () => import(/* webpackChunkName: 'vuescape-button' */ '@vuescape/components/VuescapeButton/').then(
  m => m.default)

@Component({
  components: { VuescapeButton },
})
export default class StepWizard extends Vue {
  private isSpinning = false
  @Prop({
    type   : Boolean,
    default: true,
  }) private shouldShowTopButtons: boolean
  @Prop({
    type   : Boolean,
    default: true,
  }) private shouldShowProgressBar: boolean
  @Prop({
    type   : String,
    default: 'Finish',
  }) private finalStepButtonText: string
  @Prop({
    type    : Array,
    required: false,
    default : () => [],
  }) private wizardSteps: Array<Step>
  @Prop({
    type    : [String, Function],
    required: false,
  }) private cancelRouteOrCallback: any

  private shouldShowProgressBarValue = true
  private finalStepButtonTextValue   = ''

  private currentStepIndex: number   = 0
  private previousStepIndex: number  = 0
  private nextButton: Array<boolean> = []
  private canContinue                = false
  private steps: Array<Step>         = []

  private get activeStep() {
    const result = this.steps.filter((_: Step, index: number) => index === this.currentStepIndex)
    return result
  }

  private get isFinalStep() {
    if (!this.steps || this.steps.length === 0) {
      return false
    }

    const result = this.steps.length === this.currentStepIndex + 1
    return result
  }

  private get enterAnimation() {
    return 'step-wizard__animation'
    // if (this.currentStepIndex < this.previousStepIndex) {
    //   return 'step-wizard__animation-slide-out'
    // }
    // else {
    //   return 'step-wizard__animation-slide-in'
    // }
  }

  private get leaveAnimation() {
    return 'step-wizard__animation'
    // if (this.currentStepIndex > this.previousStepIndex) {
    //   return 'step-wizard__animation-slide-in'
    // }
    // else {
    //   return 'step-wizard__animation-slide-out'
    // }
  }

  @Watch('shouldShowProgressBar')
  private onShouldShowProgressBarChanged(newValue: boolean, oldValue: boolean) {
    this.shouldShowProgressBarValue = newValue
  }

  @Watch('finalStepButtonText')
  private onFinalStepButtonTextChanged(newValue: string, oldValue: string) {
    this.finalStepButtonTextValue = newValue
  }

  @Watch('wizardSteps')
  private onStepsChanged(newValue: Array<Step>, oldValue: Array<Step>) {
    this.nextButton        = []
    this.currentStepIndex  = 0
    this.previousStepIndex = 0
    this.canContinue       = false
    this.steps             = newValue
    this.activateStep(0)
  }

  private getStepStatus(index: number, step: Step) {
    if (this.currentStepIndex === index) {
      return 'activated'
    }
    if (this.currentStepIndex > index) {
      return 'completed'
    }
    return 'deactivated'
  }

  private activateStep(index: number, back = false) {
    if (this.steps[index]) {
      this.previousStepIndex = this.currentStepIndex
      this.currentStepIndex  = index
      if (!back) {
        this.$emit('completed-step', this.previousStepIndex)
      }
    }
    this.$emit('active-step', this.currentStepIndex)
  }

  private cancel() {
    if (this.cancelRouteOrCallback) {
      if (typeof this.cancelRouteOrCallback === 'function') {
        this.cancelRouteOrCallback()
        return
      }
      this.$router.push(this.cancelRouteOrCallback)
    }
  }

  private async nextStepAction() {
    this.canContinue                       = true
    this.nextButton[this.currentStepIndex] = true
    if (this.canContinue) {
      if (this.steps[this.currentStepIndex].shouldDisplayLoadingOnNext) {
        this.isSpinning = true
      }

      if (this.isFinalStep) {
        this.$emit('stepper-finished', this.currentStepIndex)
      }
      this.activateStep(this.currentStepIndex + 1)
      await this.$nextTick()
    }
    this.canContinue = false
  }

  private nextStep() {
    if (!this.$listeners || !this.$listeners['before-next-step']) {
      this.nextStepAction()
    }
    this.canContinue = false
    this.$emit('before-next-step', this.currentStepIndex, (next: boolean = true) => {
      if (next) {
        this.canContinue = true
        this.nextStepAction()
      }
    })
  }

  private backStep() {
    const currentIndex = this.currentStepIndex - 1
    if (currentIndex >= 0) {
      this.$emit('clicking-back', currentIndex)
      this.activateStep(currentIndex, true)
    }
  }

  private componentActivated() {
    this.isSpinning = false
  }

  private proceed(payload: any) {
    this.canContinue = payload.value
  }

  private changeNextBtnValue(payload: { nextBtnValue: boolean }) {
    this.nextButton[this.currentStepIndex] = payload.nextBtnValue
    this.$forceUpdate()
  }

  private init() {
    // Initiate stepper
    this.finalStepButtonTextValue   = this.finalStepButtonText
    this.shouldShowProgressBarValue = this.shouldShowProgressBar
    this.steps                      = this.wizardSteps
    this.activateStep(0)
  }

  private created() {
    this.init()
  }
}
</script>

<style>
.v-btn {
  min-width: 0;
}
.step-wizard__animation-enter-active,
.step-wizard__animation-leave-active {
  transition: opacity 0.3s ease;
}
.step-wizard__animation-enter,
.step-wizard__animation-leave-to {
  opacity: 0;
}
/* .step-wizard__animation-slide-in {
  /* transition: opacity .3s ease-in;
  transform: translateX(-900px);
}
*/
.step-wizard__animation-slide-out {
  transition: opacity 0.3s ease-out;
}
.step-wizard__stepper-box {
  background-color: white;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); */
  min-height:       200px;
}
.step-wizard__stepper-box .top {
  display:         flex;
  align-items:     center;
  position:        relative;
  justify-content: center;
}
.step-wizard__stepper-box .top .stepper-button-top {
  z-index:         20;
  padding:         0.4rem;
  border-radius:   100rem;
  /* cursor: pointer; */
  position:        absolute;
  display:         flex;
  align-items:     center;
  justify-content: space-between;
}
.step-wizard__stepper-box .top .stepper-button-top.next {
  border: 2px solid #3383c8;
  color:  #3383c8;
  right:  1%;
}
.step-wizard__stepper-box .top .stepper-button-top.next.deactivated {
  border: 2px solid #ccc !important;
  color:  #ccc;
  cursor: not-allowed !important;
}
.step-wizard__stepper-box .top .stepper-button-top.previous {
  color: #333;
  left:  1%;
}
.step-wizard__stepper-box .top .steps-wrapper {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  position:        relative;
  width:           95%;
  left:            0;
  padding:         2% 0%;
}
.step-wizard__stepper-box .top .steps-wrapper .step {
  position:       relative;
  display:        flex;
  flex-direction: column;
  align-items:    center;
  text-align:     center;
}
.step-wizard__stepper-box .top .steps-wrapper .step.completed .circle.divider-line::before {
  background-position: left bottom;
}
.step-wizard__stepper-box .top .steps-wrapper .step .circle.divider-line::before {
  content:             '';
  display:             inline-block;
  height:              2px;
  position:            absolute;
  width:               calc(100% - 1rem - 4px);
  margin-left:         calc(0.5rem + 2px);
  background:          linear-gradient(to right, #16a5c6 50%, #ccc 50%);
  background-size:     200% 100%;
  background-position: right bottom;
  transition:          all 600ms ease;
}
.step-wizard__stepper-box .top .steps-wrapper .step .circle {
  border-style:     solid;
  border-width:     2px;
  padding:          0 1rem;
  background-color: white;
  border-radius:    100rem;
  padding:          0.5rem;
}

.step-wizard__stepper-box .top .steps-wrapper .step.deactivated .circle {
  border-color: #bbb;
}
.step-wizard__stepper-box .top .steps-wrapper .step.completed .circle {
  border-color:     #16a5c6;
  background-color: #16a5c6;
}
.step-wizard__stepper-box .top .steps-wrapper .step.completed .circle::after {
  /* content: '\2713'; */
}
.step-wizard__stepper-box .top .steps-wrapper .step.activated .circle {
  border-color: #16a5c6;
}
.step-wizard__stepper-box .top .steps-wrapper .step.deactivated .step-title {
  opacity: 0.35;
}
.step-wizard__stepper-box .top .steps-wrapper .step .step-title {
  position: absolute;
  top:      90%;
  width:    100%;
}
.step-wizard__stepper-box .top .steps-wrapper .step .step-title h1,
.step-wizard__stepper-box .top .steps-wrapper .step .step-title h2,
.step-wizard__stepper-box .top .steps-wrapper .step .step-title h3,
.step-wizard__stepper-box .top .steps-wrapper .step .step-title h4,
.step-wizard__stepper-box .top .steps-wrapper .step .step-title h5 {
  margin:      0 0 0.2rem 0;
  color:       #333;
  font-weight: bold;
}
.step-wizard__stepper-box .top .steps-wrapper .step .step-title .step-subtitle {
  font-weight: lighter;
  margin:      0;
  color:       #555;
}
.step-wizard__stepper-box .content {
  overflow: hidden;
  margin:   2rem 0;
}
.step-wizard__stepper-box .bottom .stepper-button.next {
  position: fixed;
  right:    5vw;
  bottom:   47px;
}
.step-wizard__stepper-box .bottom .stepper-button.next.deactivated {
  background-color: #ccc !important;
  cursor: not-allowed !important;
}
.step-wizard__stepper-box .bottom .stepper-button.previous {
  position: fixed;
  left:     5vw;
  bottom:   47px;
}
.step-wizard__stepper-box .bottom .vuescape-button__v-btn--style {
  height:    40px;
  font-size: 16px;
}
.step-wizard__stepper-box .bottom .cancel-div {
  position: absolute;
  left:     calc(50% - 50px);
}
.step-wizard__stepper-box .bottom .cancel {
  text-decoration: underline;
  font-size:       16px;
  height:          40px;
  position:        fixed;
  bottom:          41px;
}
.step-wizard__stepper-box .bottom .vuescape-button__v-btn--style {
  border-color: #9bdddb !important;
  /*  background-color: #16a5c6 !important;
  color: white !important; */
}
.step-wizard__stepper-box .bottom .next .vuescape-button__v-btn--style.v-btn--disabled {
  color:            unset !important;
  background-color: unset !important;
  /* border-color: #16a5c6 !important;
  background-color: unset !important;
  color: unset!important; */
}
.step-wizard__stepper-box .bottom .next .vuescape-button__v-btn--style {
  border-color:     #9bdddb !important;
  background-color: #16a5c6 !important;
  color:            white !important;
  /* background-color: unset !important;
  color: unset!important; */
}

.step-wizard__stepper-box .bottom .vuescape-button__v-btn--style svg {
  font-size: 20px;
}
.step-wizard__stepper-box .bottom .next .vuescape-button__v-btn--style svg[style] {
  color: white !important;
}
.step-wizard__stepper-box .bottom .next .vuescape-button__v-btn--style.v-btn--disabled svg[style] {
  color: unset !important;
}
</style>
