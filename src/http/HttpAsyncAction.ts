import { AxiosPromise } from 'axios'

export type HttpAsyncAction<T> = (args: any, abortController?: AbortController) => AxiosPromise<T>
