import type { Directive } from 'vue'

import './loading.css'

// Covers the element with a spinner while the bound value is true. Replaces Element UI's v-loading and
// renders the same markup, so styles targeting .el-loading-mask keep working.
export const loadingMaskClass = 'el-loading-mask'

const maskHtml = '<div class="el-loading-spinner">' +
  '<svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none"/></svg>' +
  '</div>'

type LoadingElement = HTMLElement & { loadingMask?: HTMLElement }

function update(el: LoadingElement, isLoading: boolean) {
  if (isLoading && !el.loadingMask) {
    const mask     = document.createElement('div')
    mask.className = loadingMaskClass
    mask.innerHTML = maskHtml
    if (getComputedStyle(el).position === 'static') {
      el.classList.add('el-loading-parent--relative')
    }
    el.appendChild(mask)
    el.loadingMask = mask
  }
  else if (!isLoading && el.loadingMask) {
    el.loadingMask.remove()
    el.loadingMask = undefined
    el.classList.remove('el-loading-parent--relative')
  }
}

export const loading: Directive<LoadingElement, boolean> = {
  mounted(el, binding) {
    update(el, binding.value)
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      update(el, binding.value)
    }
  },
  beforeUnmount(el) {
    update(el, false)
  },
}
