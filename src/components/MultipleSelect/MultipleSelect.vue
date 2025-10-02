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
      style="display: inline-block"
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
        @select="onSelect($event)"
        @remove="onRemove($event)"
        :searchable="isSearchable"
        :allow-empty="shouldAllowEmpty"
        :label="label"
        :track-by="trackBy"
        selectLabel=""
        deselectLabel=""
        selectedLabel=""
        :optionsLimit="10000"
        :disabled="isSelectDisabled"
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
            style="margin-right: 6px"
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
  private isDisabledVal: boolean = false
  private isOpen: boolean = false
  private viewportHandler?: () => void
  private visualViewportHandler?: () => void

  private placeholderVal: string = ''
  private oldPlaceholderVal: string = ''

  @Prop({ type: Boolean, default: false })
  private shouldSingleItemSelectBeDisabled: boolean

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

  @Prop({ type: Array, required: false, default: () => [] })
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

  @Prop({ type: Boolean, default: false })
  private isDisabled: boolean

  @Prop({ type: Boolean, default: false })
  private useFixedDropdown: boolean

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

  @Watch('isDisabled')
  private onIsDisableChanged(val: boolean, oldVal: boolean) {
    this.isDisabledVal = val
  }

  private get isSelectDisabled() {
    const result =
      this.isDisabledVal || (this.shouldSingleItemSelectBeDisabled && this.options && this.options.length === 1)
    return result
  }

  private async onSelect(option: any) {
    if (this.canSelectMultiple) {
      option.checked = true
      this.valueVal.push(option)
      this.clearMultiselectSize()
    }
  }

  private onRemove(option: any) {
    if (this.canSelectMultiple) {
      this.valueVal = (this.valueVal as Array<any>).filter(_ => _[this.trackBy] !== option[this.trackBy])
      option.checked = false
      this.clearMultiselectSize()
    }
  }

  private clearMultiselectSize() {
    const el = this.$refs.multiselectDiv as unknown as any
    const child = el.children[0]
    // TODO : Get padding
    child.style.width = ''
  }

  private onMultiselectClose(id: any) {
    if (this.canSelectMultiple) {
      this.placeholderVal = this.oldPlaceholderVal
    }
    // Reset any fixed-positioning we may have applied
    if (this.useFixedDropdown) {
      const el = this.$refs.multiselectDiv as unknown as HTMLElement
      const wrapper = el.querySelector('.multiselect__content-wrapper') as HTMLElement | null
      if (wrapper) {
        wrapper.style.position = ''
        wrapper.style.left = ''
        wrapper.style.top = ''
        wrapper.style.minWidth = ''
      }
      this.removeViewportListeners()
    }
    this.isOpen = false
    this.clearMultiselectSize()
  }

  private onMultiselectOpen(id: any) {
    if (this.canSelectMultiple) {
      this.oldPlaceholderVal = this.placeholderVal
      this.placeholderVal = ''
    }
    const el = this.$refs.multiselectDiv as unknown as any
    const child = el.children[0]
    const rect = child.getBoundingClientRect()
    child.style.width = rect.width + 'px'
    this.alignSelect(false, rect)

    if (this.useFixedDropdown) {
      // Use a small delay to ensure the dropdown is fully rendered before positioning
      requestAnimationFrame(() => {
        const freshRect = child.getBoundingClientRect()
        this.positionFixedDropdown(freshRect)
      })
      this.addViewportListeners()
    }
    this.isOpen = true
  }

  private onSearchChange() {
    this.alignSelect(true)
  }

  private alignSelect(shouldUpdateAsync: boolean, rect?: any) {
    if (this.alignment !== 'left') {
      if (!rect) {
        const el = this.$refs.multiselectDiv as unknown as any
        const child = el.children[0]
        rect = child.getBoundingClientRect()
      }
      const updateAlignment = () => {
        const containerEl = this.$refs.multiselectDiv as unknown as HTMLElement
        const dropDownElement = containerEl.querySelector('.multiselect__content-wrapper') as any
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
        if (this.useFixedDropdown) {
          // With fixed positioning, left is viewport-based
          dropDownElement.style.left = `${rect.left + adjustment}px`
          dropDownElement.style.top = `${rect.bottom}px`
        } else {
          dropDownElement.style.left = `${adjustment}px`
        }
      }
      if (shouldUpdateAsync) {
        setTimeout(updateAlignment, 100)
      } else {
        updateAlignment()
      }
    }
  }

  private positionFixedDropdown(rect?: DOMRect) {
    const el = this.$refs.multiselectDiv as unknown as HTMLElement
    const wrapper = el.querySelector('.multiselect__content-wrapper') as HTMLElement | null
    const child = el.children[0] as HTMLElement
    // Get the actual input field container, not just the inner element
    const inputField = child.querySelector('.multiselect__tags') || child.querySelector('.multiselect__single') || child
    const bounds = rect || inputField.getBoundingClientRect()
    if (!wrapper) {
      return
    }

    // Store original styles
    const prevDisplay = wrapper.style.display
    const prevVisibility = wrapper.style.visibility
    const prevPosition = wrapper.style.position

    // Temporarily hide to measure without visual jump
    wrapper.style.visibility = 'hidden'
    wrapper.style.display = 'block'
    wrapper.style.position = 'fixed'
    wrapper.style.left = '-99999px'
    wrapper.style.top = '-99999px'

    const selectRect = wrapper.getBoundingClientRect()
    let leftPosition = bounds.left

    if (this.alignment === 'center') {
      // Center the dropdown relative to the trigger
      leftPosition = bounds.left + (bounds.width / 2) - (selectRect.width / 2)
    } else if (this.alignment === 'right') {
      // Right-align the dropdown with the trigger's right edge
      leftPosition = bounds.right - selectRect.width
    }
    // For 'left' alignment, use bounds.left (already set)

    // Set final position
    wrapper.style.position = 'fixed'
    wrapper.style.top = `${bounds.bottom}px`
    wrapper.style.left = `${leftPosition}px`
    wrapper.style.minWidth = `${bounds.width}px`

    // Reveal on next frame to avoid any intermediate paint
    requestAnimationFrame(() => {
      wrapper.style.display = 'block'
      wrapper.style.visibility = 'visible'
    })

    // Fallback to ensure visibility
    setTimeout(() => {
      if (wrapper.style.visibility === 'hidden') {
        wrapper.style.display = 'block'
        wrapper.style.visibility = 'visible'
      }
    }, 50)
  }

  private addViewportListeners() {
    this.removeViewportListeners()
    this.viewportHandler = () => {
      if (!this.isOpen || !this.useFixedDropdown) {
        return
      }
      this.positionFixedDropdown()
    }
    window.addEventListener('resize', this.viewportHandler as any, { passive: true })
    window.addEventListener('scroll', this.viewportHandler as any, { passive: true })
    window.addEventListener('orientationchange', this.viewportHandler as any, { passive: true })
    // Handle browser zoom on platforms that expose visualViewport
    if ((window as any).visualViewport) {
      this.visualViewportHandler = () => {
        if (!this.isOpen || !this.useFixedDropdown) {
          return
        }
        this.positionFixedDropdown()
      }
      ;(window as any).visualViewport.addEventListener('resize', this.visualViewportHandler)
      ;(window as any).visualViewport.addEventListener('scroll', this.visualViewportHandler)
    }
  }

  private removeViewportListeners() {
    if (this.viewportHandler) {
      window.removeEventListener('resize', this.viewportHandler as any)
      window.removeEventListener('scroll', this.viewportHandler as any)
      window.removeEventListener('orientationchange', this.viewportHandler as any)
      this.viewportHandler = undefined
    }
    if (this.visualViewportHandler && (window as any).visualViewport) {
      const win = window as any
      win.visualViewport.removeEventListener('resize', this.visualViewportHandler)
      win.visualViewport.removeEventListener('scroll', this.visualViewportHandler)
      this.visualViewportHandler = undefined
    }
  }

  private created() {
    this.id = Guid.newGuid()

    this.valueVal = this.value
    this.optionsVal = this.options
    this.placeholderVal = this.placeholder
    this.isDisabledVal = this.isDisabled
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
  color: #000;
  padding-left: 10px;
  font-size: var(--custom-font-size);
}
</style>
