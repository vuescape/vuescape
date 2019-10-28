export interface SlidingPaneAction {
  trigger: {
    namespace: string
    // tslint:disable-next-line: trailing-comma
    getter: (state: any) => any
  }
  action: (value?: any, oldValue?: any, panes?: Array<{ width: number; savedWidth: number }>, context?: any) => void
  context?: any
}
