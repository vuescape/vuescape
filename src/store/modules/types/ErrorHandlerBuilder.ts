import { ErrorHandler } from '.'

export interface ErrorHandlerBuilder {
  build(config: any): ErrorHandler
}
