import FunctionalEmptyCellRenderer from './EmptyCellRenderer.vue'
import FunctionalFixedCellRenderer from './FixedCellRenderer.vue'
import FunctionalHtmlCellRenderer from './HtmlCellRenderer.vue'
import FunctionalTextCellRenderer from './TextCellRenderer.vue'

export {
  FunctionalEmptyCellRenderer,
  FunctionalFixedCellRenderer,
  FunctionalHtmlCellRenderer,
  FunctionalTextCellRenderer,
}

const functionalCellRenderersByName: { [name: string]: any } = {
  EmptyCellRenderer: FunctionalEmptyCellRenderer,
  FixedCellRenderer: FunctionalFixedCellRenderer,
  HtmlCellRenderer : FunctionalHtmlCellRenderer,
  TextCellRenderer : FunctionalTextCellRenderer,
}

/**
 * Maps a cell's configured renderer to its functional equivalent.
 *
 * An unset renderer -- the common case, since reports mapped from the API never set one -- becomes
 * the functional text renderer.  A renderer named by string resolves to its functional equivalent
 * when one exists.  A renderer supplied as a component is returned untouched so that an explicit
 * choice is always honored.
 */
export function resolveFunctionalCellRenderer(renderer: string | any) {
  if (!renderer) {
    return FunctionalTextCellRenderer
  }

  if (typeof renderer === 'string') {
    return functionalCellRenderersByName[renderer] || renderer
  }

  return renderer
}

export type BuiltInCellKind = 'empty' | 'fixed' | 'html' | 'text'

const builtInCellKindsByRenderer = new Map<any, BuiltInCellKind>([
  [FunctionalEmptyCellRenderer, 'empty'],
  [FunctionalFixedCellRenderer, 'fixed'],
  [FunctionalHtmlCellRenderer, 'html'],
  [FunctionalTextCellRenderer, 'text'],
])

/**
 * Names the built-in cell a renderer resolves to, so rows can render it inline. Vue 3 creates a component
 * instance even for a functional component, and a component per cell of a large table (e.g. 96 months by
 * 1,000 rows) uses gigabytes; undefined for any other renderer.
 */
export function getBuiltInCellKind(renderer: string | any): BuiltInCellKind | undefined {
  return builtInCellKindsByRenderer.get(resolveFunctionalCellRenderer(renderer))
}
