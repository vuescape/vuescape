import { Link } from '../index'
import { Section } from './Section'

export interface Report {
  id?: string
  title?: string
  sections: Array<Section>
  additionalReportInfo?: string
  downloadLinks?: Array<Link>
}
