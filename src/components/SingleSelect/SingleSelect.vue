<template>
  <div ref="multiselectDiv" :id="id" style="display:inline-block;">
    <multiselect
      :style="`--custom-font-size: ${customFontSize}; --border-style: ${borderStyle}`"
      :placeholder="placeholderVal"
      :value="valueVal"
      :options="optionsVal"
      @input="itemChanged"
      @open="onMultiselectOpen"
      @close="onMultiselectClose"
      :searchable="isSearchable"
      :allow-empty="shouldAllowEmpty"
      :label="label"
      :track-by="trackBy"
      selectLabel=""
      deselectLabel=""
      selectedLabel=""
      :optionsLimit="10000"
    >
      <!-- https://stackoverflow.com/questions/50891858/vue-how-to-pass-down-slots-inside-wrapper-component -->
      <!-- Pass on all named slots -->
      <template slot="noResult">
        {{ noSearchResults }}
      </template>
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" />
      <!-- Pass on all scoped slots -->
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope"
        ><slot :name="slot" v-bind="scope"
      /></template>
    </multiselect>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

import { Guid } from '@vuescape/index'

@Component({
  components: { Multiselect },
  inheritAttrs: false,
})
export default class SingleSelect extends Vue {
  private id = ''

  private areWatchersEnabled = false
  private valueVal: any = {}
  private optionsVal: Array<any> = []
  private placeholderVal: string = ''

  @Prop({ type: String, required: false, default: '' })
  private customFontSize: string

  // Current default of '0' is no border
  // Multiselect default is '1px solid #e8e8e8;'
  @Prop({ type: String, required: false, default: '0' })
  private borderStyle: string

  @Prop({ type: String, required: false, default: 'name' })
  private label: string

  @Prop({ type: String, required: false, default: 'id' })
  private trackBy: string

  @Prop({ type: Boolean, default: true })
  private isSearchable: string

  @Prop({ type: Boolean, default: false })
  private shouldAllowEmpty: string

  @Prop({ type: [Object, Number, String], required: true })
  private value: string

  @Prop({ type: Array, required: false, default: [] })
  private options: Array<any>

  @Prop({ type: String, required: false })
  private placeholder: string

  @Prop({ type: String, required: false, default: 'No results found' })
  private noSearchResults: string

  @Prop({ type: Function, required: false })
  private itemChanged: (value: any, id: string) => void

  @Watch('value')
  private onValueChanged(val: any, oldVal: any) {
    this.valueVal = val
  }

  @Watch('options')
  private onOptionsChanged(val: any, oldVal: any) {
    this.optionsVal = val
  }

  @Watch('placeholder')
  private onPlaceholderChanged(val: any, oldVal: any) {
    this.placeholderVal = val
  }

  private onMultiselectClose(id: any) {
    const el = (this.$refs.multiselectDiv as unknown) as any
    const child = el.children[0]
    // TODO : Get padding
    child.style.width = ''
  }
  private onMultiselectOpen(id: any) {
    const el = (this.$refs.multiselectDiv as unknown) as any
    const child = el.children[0]
    const rect = child.getBoundingClientRect()
    child.style.width = rect.width + 'px'
  }

  private created() {
    this.id = Guid.newGuid()

    this.valueVal = this.value
    this.optionsVal = this.options
    this.placeholderVal = this.placeholder
  }
}
</script>

<style>
.multiselect__content-wrapper {
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14),
    0px 3px 14px 2px rgba(0, 0, 0, 0.12);
}
.multiselect {
  font-size: var(--custom-font-size);
  width: fit-content;
}

.multiselect__content-wrapper /*, .multiselect__element */ {
  width: fit-content;
}

.multiselect__option {
  width: 100%;
  font-size: var(--custom-font-size);
}
.multiselect__option--selected.multiselect__option--highlight {
  background: rgba(0, 0, 0, 0.03);
  color: unset;
}
.multiselect__option--highlight {
  background: rgba(0, 0, 0, 0.03);
  outline: none;
  color: unset;
}
.multiselect__tags {
  border: var(--border-style);
}
.multiselect__single {
  font-size: var(--custom-font-size);
}
.multiselect__input {
  font-size: var(--custom-font-size);
}
</style>
