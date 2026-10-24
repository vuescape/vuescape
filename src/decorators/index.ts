// Class component decorators for Vue 3, keeping the signatures of vue-property-decorator and vuex-class
// so components only need their imports changed.
import {
  Base, Component as ComponentDecorator, createDecorator, Inject as InjectDecorator,
} from 'vue-facing-decorator'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export { Prop, Watch, toNative } from 'vue-facing-decorator'

// vue-class-component collected a component's data from an instance that proxied the component, so class
// field initializers could read props, injections and $-properties (e.g. `private items = this.initialItems`).
// vue-facing-decorator collects it from a plain `new MyComponent()`, so while Component's data() runs, Vue's
// constructor gives that instance read-only accessors to the component instance.
const instanceProperties = ['$attrs', '$el', '$emit', '$nextTick', '$parent', '$refs', '$root', '$route', '$router',
  '$slots', '$store', '$vuetify']
let dataInstance: any

function getInjectionKeys(instance: any): Array<string> {
  const inject = instance.$options?.inject
  if (!inject) {
    return []
  }
  return Array.isArray(inject) ? inject : Object.keys(inject)
}

export const Vue = class extends Base {
  constructor() {
    super()
    const instance = dataInstance
    if (!instance) {
      return
    }

    const keys = [...Object.keys(instance.$props ?? {}), ...getInjectionKeys(instance), ...instanceProperties]
    for (const key of keys) {
      if (!(key in this)) {
        Object.defineProperty(this, key, { configurable: true, enumerable: false, get: () => instance[key] })
      }
    }
  }
} as typeof Base

// vue-facing-decorator always declares emits, which makes Vue warn about every event a component emits without
// declaring it. vue-class-component never declared them, so leave them undeclared unless a component lists some.
function leaveEmptyEmitsUndeclared(option: any) {
  if (Array.isArray(option.emits) && option.emits.length === 0) {
    delete option.emits
  }
}

function collectDataWithInstance(option: any) {
  const data = option.data
  option.data = function (this: any) {
    const previous = dataInstance
    dataInstance   = this
    try {
      return data.call(this)
    }
    finally {
      dataInstance = previous
    }
  }
}

export const Component = function (optionOrClass?: any, context?: any) {
  if (typeof optionOrClass === 'function') {
    return ComponentDecorator({
      modifier: (option: any) => {
        collectDataWithInstance(option)
        leaveEmptyEmitsUndeclared(option)
      },
    })(optionOrClass, context)
  }

  const modifier = optionOrClass?.modifier
  return ComponentDecorator({
    ...optionOrClass,
    modifier: (option: any) => {
      collectDataWithInstance(option)
      leaveEmptyEmitsUndeclared(option)
      modifier?.(option)
    },
  })
} as typeof ComponentDecorator

// vue-property-decorator took the injection key directly
export function Inject(key?: string | symbol) {
  return InjectDecorator(key === undefined ? {} : { from: key })
}

type MapHelper = (...args: Array<any>) => { [key: string]: any }
type PropertyDecorator = (proto: any, key: string) => void
type StateTransformer = (state: any, getters: any) => any
interface BindingOptions {
  namespace?: string
}

// Used either bare, e.g. `@State isAuthenticated`, to map the property's own name,
// or called with what to map, e.g. `@State('value')` or `@State(state => state.value, { namespace })`
interface BindingHelper {
  (proto: object, key: string): void
  (map: string | StateTransformer, options?: BindingOptions): PropertyDecorator
}

// Components often map a namespace before the module is registered (e.g. window/availableHeight once App mounts).
// With Vue 2 the mapping recomputed after registration because reading $store.state also tracked the root state
// object; Vue 3 doesn't, so read the module's root state key to recompute when it's added, and skip the mapping
// (and vuex's "module namespace not found" error) until then.
function waitForNamespace(mapped: (this: any) => any, mapNamespace: string) {
  const moduleNamespace = mapNamespace.endsWith('/') ? mapNamespace : `${mapNamespace}/`
  const stateKey        = moduleNamespace.slice(0, -1)
  return function (this: any) {
    const store = this.$store
    if (store.state[stateKey] === undefined && !store._modulesNamespaceMap[moduleNamespace]) {
      return undefined
    }
    return mapped.call(this)
  }
}

function createBindingHelper(bindTo: 'computed' | 'methods', mapHelper: MapHelper, defaultNamespace?: string): BindingHelper {
  const makeDecorator = (map: any, mapNamespace?: string): PropertyDecorator =>
    createDecorator((componentOptions: any, key: string) => {
      componentOptions[bindTo] ??= {}
      const mapObject = { [key]: map }
      if (mapNamespace === undefined) {
        componentOptions[bindTo][key] = mapHelper(mapObject)[key]
        return
      }

      const mapped = mapHelper(mapNamespace, mapObject)[key]
      componentOptions[bindTo][key] = bindTo === 'computed' ? waitForNamespace(mapped, mapNamespace) : mapped
    }) as PropertyDecorator

  return function (protoOrMap: any, keyOrOptions?: any): any {
    if (typeof keyOrOptions === 'string') {
      return makeDecorator(keyOrOptions, defaultNamespace)(protoOrMap, keyOrOptions)
    }

    return makeDecorator(protoOrMap, (keyOrOptions as BindingOptions | undefined)?.namespace ?? defaultNamespace)
  } as BindingHelper
}

export const State    = createBindingHelper('computed', mapState)
export const Getter   = createBindingHelper('computed', mapGetters)
export const Action   = createBindingHelper('methods', mapActions)
export const Mutation = createBindingHelper('methods', mapMutations)

export function namespace(name: string) {
  return {
    State   : createBindingHelper('computed', mapState, name),
    Getter  : createBindingHelper('computed', mapGetters, name),
    Action  : createBindingHelper('methods', mapActions, name),
    Mutation: createBindingHelper('methods', mapMutations, name),
  }
}
