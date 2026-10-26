import FunctionalEmptyCellRenderer from './EmptyCellRenderer.vue'
import FunctionalFixedCellRenderer from './FixedCellRenderer.vue'
import FunctionalHeaderCellRenderer from './HeaderCellRenderer.vue'
import FunctionalHtmlCellRenderer from './HtmlCellRenderer.vue'
import FunctionalTextCellRenderer from './TextCellRenderer.vue'

const functionalCellRenderersByName: { [name: string]: any } = {
  EmptyCellRenderer : FunctionalEmptyCellRenderer,
  FixedCellRenderer : FunctionalFixedCellRenderer,
  HeaderCellRenderer: FunctionalHeaderCellRenderer,
  HtmlCellRenderer  : FunctionalHtmlCellRenderer,
  TextCellRenderer  : FunctionalTextCellRenderer,
}

/**
 * Maps a cell's renderer to the component that renders it: an unset renderer is the text renderer, a renderer named
 * by string is the renderer of that name, and a renderer supplied as a component is used as is.
 */
export function resolveFunctionalCellRenderer(renderer: string | any) {
  if (renderer && typeof renderer !== 'string') {
    return renderer
  }

  return functionalCellRenderersByName[renderer || 'TextCellRenderer']
}

export type BuiltInCellKind = 'empty' | 'fixed' | 'html' | 'text'

const builtInCellKindsByRenderer = new Map<any, BuiltInCellKind>([
  [FunctionalEmptyCellRenderer, 'empty'],
  [FunctionalFixedCellRenderer, 'fixed'],
  [FunctionalHtmlCellRenderer, 'html'],
  [FunctionalTextCellRenderer, 'text'],
])

/**
 * Names the built-in cell a renderer resolves to, so rows can render it inline. Vue 3 creates a component instance
 * even for a functional component, and a component per cell of a large table (e.g. 96 months by 1,000 rows) uses
 * gigabytes; undefined for any other renderer.
 */
export function getBuiltInCellKind(renderer: string | any): BuiltInCellKind | undefined {
  return builtInCellKindsByRenderer.get(resolveFunctionalCellRenderer(renderer))
}
