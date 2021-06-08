import { RouteConfig } from 'vue-router'

// TODO: need to wire in auth in vuescape or move route definition out
// import { authenticationNavigationGuard, isInReportAccessRoleNavigationGuard, ReportAccessRole } from ''
import { makeDocumentTitleSetter, withNavigationGuards } from '@vuescape/index'

// const isInReportAccessRole = isInReportAccessRoleNavigationGuard(ReportAccessRole.BenchmarkingPortfolioStrategy)

const documentTitleSetter = makeDocumentTitleSetter('Reporting | CoMetrics')

const route: RouteConfig = {
  path: '/reporting/:reportId',
  name: '/reporting',
  beforeEnter: withNavigationGuards(documentTitleSetter),
  component: () =>
    import(/* webpackChunkName: 'report-panes' */
    '.').then(m => m.default),
  props: true,
  // pass props dynamically -- use reportingContext as property name that can contain an Any type
}
export default route
