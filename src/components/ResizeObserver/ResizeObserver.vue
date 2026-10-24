<template>
  <div class="resize-observer" tabindex="-1"></div>
</template>

<script lang="ts">
import { Component, toNative, Vue } from '@vuescape/decorators'

// Fills its positioned parent and emits `notify` when the parent's size changes (replaces vue-resize)
@Component({ emits: ['notify'] })
class ResizeObserver extends Vue {
  private observer?: globalThis.ResizeObserver
  private isFirstObservation = true

  private mounted() {
    this.observer = new globalThis.ResizeObserver(() => {
      // ResizeObserver reports the initial size when observation starts; vue-resize only reported changes
      if (this.isFirstObservation) {
        this.isFirstObservation = false
        return
      }
      this.$emit('notify')
    })
    this.observer.observe(this.$el as Element)
  }

  private beforeUnmount() {
    this.observer?.disconnect()
  }
}

export default toNative(ResizeObserver)
</script>

<style>
.resize-observer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  pointer-events: none;
  display: block;
  overflow: hidden;
  opacity: 0;
}
</style>
