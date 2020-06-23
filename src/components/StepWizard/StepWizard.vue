<template>
  <div class="step-wizard__stepper-box">
    <div v-show="shouldShowProgressBar" class="top">
      <div class="steps-wrapper">
        <template v-if="shouldShowTopButtons">
          <div v-if="currentStepIndex > 0" class="stepper-button-top previous" @click="backStep()">
            <font-awesome-icon :icon="['fad', 'arrow-alt-circle-left']" />
          </div>
        </template>
        <template v-for="(step, index) in steps">
          <div :class="['step', getStepStatus(index, step)]" :key="index" :style="{ width: `${100 / steps.length}%` }">
            <div class="circle" :class="{ 'divider-line': index !== steps.length - 1 }">
              <!-- <div class="divider-line" :style="{ width: `${(100 / steps.length) * (steps.length - 1) - 10}%` }"></div> -->
              <!-- TODO: -->
              <!-- <font-awesome-icon :icon="['fal', 'chevron-down']" /> -->
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
          <font-awesome-icon :icon="['fad', 'arrow-alt-circle-right']" />
        </div>
      </div>
    </div>
    <div class="content">
      <transition :name="enterAnimation" mode="out-in">
        <!--If keep alive-->
        <keep-alive v-if="steps[currentStepIndex].shouldKeepComponentAlive">
          <component
            :is="steps[currentStepIndex].component"
            :clickedNext="nextButton[currentStepIndex]"
            @can-continue="proceed"
            @change-next="changeNextBtnValue"
            :current-step="steps[currentStepIndex]"
          ></component>
        </keep-alive>
        <!--If not show component and destroy it in each step change-->
        <component
          v-else
          :is="steps[currentStepIndex].component"
          :clickedNext="nextButton[currentStepIndex]"
          @can-continue="proceed"
          @change-next="changeNextBtnValue"
          :current-step="steps[currentStepIndex]"
        ></component>
      </transition>
    </div>
    <div :class="['bottom', currentStepIndex > 0 ? '' : '']">
      <!-- only-next -->
      <div class="stepper-button previous">
        <vuescape-button
          :isDisabled="currentStepIndex == 0"
          :icons="['fad', 'arrow-alt-circle-left']"
          :disabled="false"
          Depressed
          @click="backStep()"
        >
          &nbsp;back
        </vuescape-button>
      </div>
      <vuescape-button
        :isDisabled="!canContinue"
        :icons="['fad', 'arrow-alt-circle-right']"
        Depressed
        @click="nextStep()"
        iconPosition="after"
      >
        {{ isFinalStep ? 'finish' : 'next' }}&nbsp;
      </vuescape-button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

const VuescapeButton = () =>
  import(/* webpackChunkName: 'vuescape-button' */ '@vuescape/components/VuescapeButton/').then(m => m.default)

import { Step } from './Step'

@Component({
  components: { VuescapeButton },
})
export default class StepWizard extends Vue {
  @Prop({ type: Boolean, default: true })
  private shouldShowTopButtons: boolean
  @Prop({ type: Boolean, default: true })
  private shouldShowProgressBar: boolean
  @Prop({ type: Array, required: false, default: () => [] })
  private steps: Array<Step>

  private currentStepIndex: number = 0
  private previousStepIndex: number = 0
  private nextButton: Array<boolean> = []
  private canContinue = false

  private get isFinalStep() {
    if (!this.steps || this.steps.length === 0) {
      return false
    }

    const result = this.steps.length === this.currentStepIndex
    return result
  }

  private get enterAnimation() {
    return 'step-wizard__animation'
    if (this.currentStepIndex < this.previousStepIndex) {
      return 'step-wizard__animation-slide-out'
    } else {
      return 'step-wizard__animation-slide-in'
    }
  }

  private get leaveAnimation() {
    return 'step-wizard__animation'
    if (this.currentStepIndex > this.previousStepIndex) {
      return 'step-wizard__animation-slide-in'
    } else {
      return 'step-wizard__animation-slide-out'
    }
  }

  private getStepStatus(index: number, step: number) {
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
      this.currentStepIndex = index
      if (!back) {
        this.$emit('completed-step', this.previousStepIndex)
      }
    }
    this.$emit('active-step', this.currentStepIndex)
  }

  private nextStepAction() {
    this.canContinue = true
    this.nextButton[this.currentStepIndex] = true
    if (this.canContinue) {
      if (this.isFinalStep) {
        this.$emit('stepper-finished', this.currentStepIndex)
      }
      this.activateStep(this.currentStepIndex + 1)
    }
    this.canContinue = false
    this.$forceUpdate()
  }

  private nextStep() {
    if (!this.$listeners || !this.$listeners['before-next-step']) {
      this.nextStepAction()
    }
    this.canContinue = false
    this.$emit('before-next-step', this.currentStepIndex, (next: boolean = true) => {
      this.canContinue = true
      if (next) {
        this.nextStepAction()
      }
    })
  }

  private backStep() {
    this.$emit('clicking-back')
    const currentIndex = this.currentStepIndex - 1
    if (currentIndex >= 0) {
      this.activateStep(currentIndex, true)
    }
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
    this.activateStep(0)
    this.steps.map((step: Step, index: number) => false)
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
.step-wizard__animation-enter-active, .step-wizard__animation-leave-active {
  transition: opacity .3s ease;
}
.step-wizard__animation-enter, .step-wizard__animation-leave-to {
  opacity: 0;
}
/* .step-wizard__animation-slide-in {
  /* transition: opacity .3s ease-in; 
  transform: translateX(-900px);
}
*/
.step-wizard__animation-slide-out {
  transition: opacity 0.3s ease-out;
} */
.step-wizard__stepper-box {
  background-color: white;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); */
  min-height: 200px;
}
.step-wizard__stepper-box .top {
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
}
.step-wizard__stepper-box .top .stepper-button-top {
  z-index: 20;
  padding: 0.4rem;
  border-radius: 100rem;
  /* cursor: pointer; */
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.step-wizard__stepper-box .top .stepper-button-top.next {
  border: 2px solid #3383c8;
  color: #3383c8;
  right: 1%;
}
.step-wizard__stepper-box .top .stepper-button-top.next.deactivated {
  border: 2px solid #ccc !important;
  color: #ccc;
  cursor: not-allowed !important;
}
.step-wizard__stepper-box .top .stepper-button-top.previous {
  color: #333;
  left: 1%;
}
/* .step-wizard__stepper-box .top .divider-line {
  border-bottom: 2px solid #ccc;
  height: 2px;
  position: absolute;
} */

/* @media (max-width: 767px) {
  .step-wizard__stepper-box .top .steps-wrapper {
    width: 90%;
    justify-content: center;
  }
}
@media (max-width: 767px) {
  .step-wizard__stepper-box .top .divider-line {
    width: 90%;
  }
}
@media (max-width: 767px) {
  .step-wizard__stepper-box .top .steps-wrapper .step {
    width: 100% !important;
  }
}
@media (max-width: 767px) {
  .step-wizard__stepper-box .top .steps-wrapper .step.deactivated {
    display: none;
  }
} */
.step-wizard__stepper-box .top .steps-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 95%;
  left: 0;
  padding: 2% 4%;
}
.step-wizard__stepper-box .top .steps-wrapper .step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.step-wizard__stepper-box .top .steps-wrapper .step.completed .circle.divider-line::before {
  background-position: left bottom;
}
.step-wizard__stepper-box .top .steps-wrapper .step .circle.divider-line::before {
  content: '';
  display: inline-block;
  height: 2px;
  position: absolute;
  width: calc(100% - 1rem - 4px);
  margin-left: calc(0.5rem + 2px);
  background: linear-gradient(to right, #16a5c6 50%, #ccc 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  transition: all 600ms ease;
}
.step-wizard__stepper-box .top .steps-wrapper .step .circle {
  border-style: solid;
  border-width: 2px;
  padding: 0 1rem;
  background-color: white;
  border-radius: 100rem;
  padding: 0.5rem;
}

.step-wizard__stepper-box .top .steps-wrapper .step.deactivated .circle {
  border-color: #bbb;
}
.step-wizard__stepper-box .top .steps-wrapper .step.completed .circle {
  border-color: #16a5c6;
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
  top: 90%;
  width: 100%;
}
.step-wizard__stepper-box .top .steps-wrapper .step .step-title h1,
.step-wizard__stepper-box .top .steps-wrapper .step .step-title h2,
.step-wizard__stepper-box .top .steps-wrapper .step .step-title h3,
.step-wizard__stepper-box .top .steps-wrapper .step .step-title h4,
.step-wizard__stepper-box .top .steps-wrapper .step .step-title h5 {
  margin: 0 0 0.2rem 0;
  color: #333;
  font-weight: bold;
}
.step-wizard__stepper-box .top .steps-wrapper .step .step-title .step-subtitle {
  font-weight: lighter;
  margin: 0;
  color: #555;
}
.step-wizard__stepper-box .content {
  overflow: hidden;
  margin: 2rem 0;
}
.step-wizard__stepper-box .bottom {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  /* border-top: 1px solid #ccc; */
}
.step-wizard__stepper-box .bottom.only-next {
  justify-content: flex-end;
}
.step-wizard__stepper-box .bottom .stepper-button {
  padding: 0.5rem 1rem;
  /* cursor: pointer; */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.step-wizard__stepper-box .bottom .stepper-button.next {
  background-color: #16a5c6;
  color: white;
  /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24); */
}
.step-wizard__stepper-box .bottom .stepper-button.next.deactivated {
  background-color: #ccc !important;
  cursor: not-allowed !important;
}
.step-wizard__stepper-box .bottom .stepper-button.previous {
  color: #333;
}
</style>
