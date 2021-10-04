<template>
  <div>
    <span
      v-if="prefixText"
      class="multiselect__tags multiple-select__span--prefix"
      :style="`--custom-font-size: ${customFontSize};`"
    >{{ prefixText }}
    </span>
    <div
      ref="multiselectDiv"
      :id="id"
      style="display:inline-block;"
    >
      <multiselect
        :multiple="canSelectMultiple"
        :close-on-select="!canSelectMultiple"
        :style="`--custom-font-size: ${customFontSize}; --border-style: ${borderStyle}`"
        :placeholder="placeholderVal"
        :value="valueVal"
        :options="optionsVal"
        @input="itemChanged"
        @open="onMultiselectOpen"
        @close="onMultiselectClose"
        @search-change="onSearchChange"
        @select=onSelect($event)
        @remove=onRemove($event)
        :searchable="isSearchable"
        :allow-empty="shouldAllowEmpty"
        :label="label"
        :track-by="trackBy"
        selectLabel=""
        deselectLabel=""
        selectedLabel=""
        :optionsLimit="10000"
      >
        <span
          v-if="canSelectMultiple"
          class="checkbox-label"
          slot="option"
          slot-scope="scope"
        >
          <input
            class=""
            type="checkbox"
            v-model="scope.option.checked"
            @focus.prevent
            style="margin-right: 6px;"
          />
          <span v-html="scope.option[label]"></span>
        </span>
        <span
          v-else
          slot="option"
          v-html="scope.option[label]"
        >
        </span>
        <!-- https://stackoverflow.com/questions/50891858/vue-how-to-pass-down-slots-inside-wrapper-component -->
        <!-- Pass on all named slots -->
        <template slot="noResult">
          {{ noSearchResults }}
        </template>
        <slot
          v-for="slot in Object.keys($slots)"
          :name="slot"
          :slot="slot"
        />
        <!-- Pass on all scoped slots -->
        <template
          v-for="slot in Object.keys($scopedSlots)"
          :slot="slot"
          slot-scope="scope"
        >
          <slot
            :name="slot"
            v-bind="scope"
          />
        </template>
      </multiselect>
    </div>
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
export default class MultipleSelect extends Vue {
  private id = ''

  private areWatchersEnabled = false
  private valueVal: any = {}
  private optionsVal: Array<any> = []
  
  private placeholderVal: string = ''
  private oldPlaceholderVal: string = ''

  @Prop({ type: String, required: false, default: '' })
  private customFontSize: string

  @Prop({ type: String, required: false, default: '' })
  private prefixText: string

  // Current default of '0' is no border
  // Multiselect default is '1px solid #e8e8e8;'
  @Prop({ type: String, required: false, default: '0' })
  private borderStyle: string

  @Prop({ type: String, required: false, default: 'name' })
  private label: string

  @Prop({ type: String, required: false, default: 'id' })
  private trackBy: string

  @Prop({ type: Boolean, default: true })
  private isSearchable: boolean

  @Prop({ type: Boolean, default: false })
  private canSelectMultiple: boolean

  @Prop({ type: Boolean, default: false })
  private shouldAllowEmpty: boolean

  @Prop({ type: [Array, Object, Number, String], required: true })
  private value: any

  @Prop({ type: Array, required: false, default: [] })
  private options: Array<any>

  @Prop({ type: String, required: false })
  private placeholder: string

  @Prop({ type: String, required: false, default: 'No results found' })
  private noSearchResults: string

  @Prop({ type: Function, required: false })
  private itemChanged: (value: any, id: string) => void

  @Prop({ type: String, default: 'left' })
  private alignment: 'left' | 'right' | 'center'

  @Prop({ type: Function })
  private optionFormatter: (option: any) => string

  @Watch('value')
  private onValueChanged(val: any, oldVal: any) {
    // Might not work for arbitrary objects (e.g. if they contain circular references)
    // If that is an issue then might have to provide a prop to provide a comparer function
    if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
      this.valueVal = val
    }
  }

  @Watch('options')
  private onOptionsChanged(val: Array<any>, oldVal: Array<any>) {
    if (!this.canSelectMultiple) {
      this.optionsVal = val
      return
    }
    const optionsWithCheck = val.map(_ => {
      _.checked = this.valueVal.some((v: any) => _[this.trackBy] === v[this.trackBy])
      return _
    })

    this.optionsVal = optionsWithCheck
  }

  @Watch('placeholder')
  private onPlaceholderChanged(val: any, oldVal: any) {
    this.placeholderVal = val
  }

  private async onSelect(option: any) {
    if (this.canSelectMultiple) {
      option.checked = true
      this.valueVal.push(option)
      console.info(option)
      this.clearMultiselectSize()
    }
  }

  private onRemove(option: any) {
    if (this.canSelectMultiple) {
      this.valueVal = (this.valueVal as Array<any>).filter(_ => _[this.trackBy] !== option[this.trackBy])
      option.checked = false
      console.info(option)
      this.clearMultiselectSize()
    }
  }

  private clearMultiselectSize() {
    const el = (this.$refs.multiselectDiv as unknown) as any
    const child = el.children[0]
    // TODO : Get padding
    child.style.width = ''
  }

  private onMultiselectClose(id: any) {
    if (this.canSelectMultiple) {
      this.placeholderVal = this.oldPlaceholderVal
    }
    this.clearMultiselectSize()
  }
  
  private onMultiselectOpen(id: any) {
    if (this.canSelectMultiple) {
      this.oldPlaceholderVal = this.placeholderVal
      this.placeholderVal = ''
    }
    const el = (this.$refs.multiselectDiv as unknown) as any
    const child = el.children[0]
    const rect = child.getBoundingClientRect()
    child.style.width = rect.width + 'px'
    this.alignSelect(false, rect)
  }

  private onSearchChange() {
    this.alignSelect(true)
  }

  private alignSelect(shouldUpdateAsync: boolean, rect?: any) {
    if (this.alignment !== 'left') {
      if (!rect) {
        const el = (this.$refs.multiselectDiv as unknown) as any
        const child = el.children[0]
        rect = child.getBoundingClientRect()
      }
      const updateAlignment = () => {
        const dropDownElement = document.getElementsByClassName('multiselect__content-wrapper')[0] as any
        if (!shouldUpdateAsync) {
          dropDownElement.style.left = '-99999px'
          dropDownElement.style.display = ''
        }
        const selectRect = dropDownElement.getBoundingClientRect()
        let adjustment = -1 * (selectRect.width - rect.width)
        if (this.alignment === 'center') {
          adjustment = adjustment / 2.0
        }
        if (!shouldUpdateAsync) {
          dropDownElement.style.display = 'none'
        }
        dropDownElement.style.left = `${adjustment}px`
      }
      if (shouldUpdateAsync) {
        setTimeout(updateAlignment, 100)
      } else {
        updateAlignment()
      }
    }
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
.multiple-select__span--prefix {
  vertical-align: top;
  padding-right: 0;
  font-weight: 500;
  display: inline-block;
  line-height: 20px;
}
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
.multiple-select__span--prefix {
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
  padding-left: 0;
}
.multiselect__single {
  font-size: var(--custom-font-size);
  font-weight: 500;
}
.multiselect__input {
  font-size: var(--custom-font-size);
}
.multiselect__tag {
  background-color: #dcdcdc !important;
  color: rgba(0, 0, 0, 0.87);
}
.multiselect__tag-icon {
  background-color: #dcdcdc !important;
  color: rgba(0, 0, 0, 0.87);
}
.multiselect__tags-wrap {
  padding-left: 10px;
  display: inline-block;
}
.multiselect__placeholder {
  padding-left: 10px;
}
</style>
