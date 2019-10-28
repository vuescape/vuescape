import { AsyncAction } from './AsyncAction'
export function usingRetryFor<T>(
  asyncAction: AsyncAction<T>,
  retryDelay: number = 250,
  maxNumberOfRetries: number = 3,
) {
  const wrappedAction: AsyncAction<T> = async (args: any) => {
    let retryNumber = 0
    const retryFunction = async () => {
      while (retryNumber <= maxNumberOfRetries) {
        try {
          const result = await asyncAction(args)
          return result as T
        } catch (error) {
          if (retryNumber++ >= maxNumberOfRetries) {
            throw error
          }
          if (error && error.response) {
            switch (error.response.status) {
              case 400:
              case 401:
                throw error
              default:
                break
            }
          }
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }
      throw new Error(`Invalid Operation: retryNumber <= maxNumberOfRetries: ${retryNumber} <= ${maxNumberOfRetries}`)
    }
    return retryFunction()
  }
  return wrappedAction
}
