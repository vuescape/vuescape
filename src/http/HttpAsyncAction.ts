import { AxiosPromise } from 'axios'

export type HttpAsyncAction<T> = (args: any) => AxiosPromise<T>
