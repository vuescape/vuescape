import { defineComponent } from 'vue'

// vue-router 4 requires every route to have a component. Routes whose guards always cancel or redirect
// the navigation never render it.
export const guardOnlyRouteComponent = defineComponent({ render: () => null })
