import { ModuleState, StoreModule, StoreModuleOptions } from '.'
import { RootState } from '../../RootState'

export const makeStoreModule = <TYPE>(initialValue : TYPE) => {
  const storeModuleOptions = new StoreModuleOptions<TYPE, RootState>({ initialValue })
  const storeModule = () => new StoreModule<TYPE, ModuleState<TYPE>, RootState>(storeModuleOptions)
  return storeModule
}
