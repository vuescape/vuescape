export interface Chiclet {
  id: string
  cssClass?: string
  title: string
  icons?: Array<string>
  isVisible: boolean
  link?: { href: string; target: string }
  onclick?: () => void
}
