<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'

import { HttpMethod } from '@vuescape/http'
import ComponentBase from '@vuescape/infrastructure/ComponentBase'
import { ns, StoreModuleState, ValueMapper } from '@vuescape/store/modules/types'

@Component
export default class ModuleStore extends ComponentBase {
  private static validateHttpMethod(val: string) {
    const result = (Object as any).values(HttpMethod).includes(val)
    return result
  }

  @Prop({ type: String, required: true })
  private namespace: string

  @Prop({ type: String, required: false, default: HttpMethod.Get, validator: ModuleStore.validateHttpMethod })
  private httpMethod: HttpMethod

  @Prop({ type: String, required: true })
  private endpointUrl: string

  @Prop({ type: String, required: true })
  private apiBaseUrl: string

  @Prop({ type: Boolean, required: false, default: true })
  private shouldUseCache: boolean

  @Prop()
  private initialValue: any

  @Prop({ type: Object, required: false })
  private args: object

  @Prop({ type: Boolean, required: false, default: true })
  private shouldInvokeOnCreate: boolean

  @Prop({ type: Function, required: false })
  private valueMapper: ValueMapper<Array<any>> | undefined

  private defaultModuleState = new StoreModuleState(false, false, false, false, { status: 0 }, [], this.initialValue)

  public async invoke(args?: any) {
    await this.$store.dispatch(ns(this.namespace, this.endpointUrl), args)
  }

  private async created() {
    this.registerStoreModule(
      this.namespace,
      this.httpMethod,
      this.endpointUrl,
      this.apiBaseUrl,
      this.shouldUseCache,
      this.initialValue,
      this.valueMapper,
    )

    if (this.shouldInvokeOnCreate) {
      await this.invoke(this.args)
    }
  }

  private render() {
    // Suppress Typescript errors, TS2532 & TS2722
    if (!this.$scopedSlots || !this.$scopedSlots.default) {
      return null
    }

    const moduleState = this.$store.state[this.namespace] ? this.$store.state[this.namespace] : this.defaultModuleState
    const result = this.$scopedSlots.default({
      moduleState: this.$store.state[this.namespace],
    })

    return result
  }
}
</script>
