import { Section } from './Section'
import { Link } from '../index'

export interface Report {
  id?: string
  title?: string
  sections: Array<Section>
  additionalReportInfo?: string
  downloadLinks?: Array<Link>
}
