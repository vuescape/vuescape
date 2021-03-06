export interface Step {
  component: object | (() => {})
  shouldKeepComponentAlive: boolean
  icon?: Array<string>
  name?: string
  title?: string
  subtitle?: string
  shouldDisplayLoadingOnNext?: boolean
}
