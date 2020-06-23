export interface Step {
  index: number
  component: object | (() => {})
  shouldKeepComponentAlive: boolean
  icon?: Array<string>
  name?: string
  title?: string
  subtitle?: string
}
