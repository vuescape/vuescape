import type { Component } from 'vue'

import { HoverContentKind } from './HoverContentKind'

export interface Hover {
  title?: string
  content?: string
  component?: string | Component
  contentKind?: HoverContentKind
}
