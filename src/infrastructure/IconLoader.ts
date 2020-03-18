import Vue from 'vue'

import { dom, library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.component('font-awesome-icon', FontAwesomeIcon)

import {
  faCheckCircle,
  faCloudDownloadAlt,
  faFileDownload,
  faFileImage,
  faFilePdf,
  faSort,
  faSortDown,
  faSortUp,
} from '@fortawesome/pro-duotone-svg-icons'
import {
  faCaretDown,
  faMinus,
  faPlus,
  faSignOutAlt,
  faTable,
} from '@fortawesome/pro-solid-svg-icons'

// import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons'

import { faChevronDown, faChevronRight } from '@fortawesome/pro-light-svg-icons'
import { faInfo } from '@fortawesome/pro-solid-svg-icons'

library.add(
  faCheckCircle,
  faCloudDownloadAlt,
  faSignOutAlt,
  faChevronDown,
  faChevronRight,
  faFileDownload,
  faCaretDown,
  faMinus,
  faPlus,
  faFilePdf,
  faFileImage,
  faInfo,
  faTable,
  faSort,
  faSortUp,
  faSortDown,
)

dom.watch()

export default 'faSvg'
