export interface SlidingPaneAction {
  trigger: {
    namespace: string
    getter: (state: any) => any
  }
  action: (value?: any, oldValue?: any, panes?: Array<{ width: number; savedWidth: number }>, context?: any) => void
  context?: any
}
