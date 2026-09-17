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
 * Maps a cell's configured renderer to its stateless (functional) equivalent.
 *
 * A functional component creates no component instance and no placeholder vnode, so it never
 * enters Vue's insertedVnodeQueue.  That queue is spliced with Function.prototype.apply, which
 * throws RangeError: Maximum call stack size exceeded somewhere past 125,000 arguments, so a table
 * of rows x columns cells can exceed it on its own.
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
