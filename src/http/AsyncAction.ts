export type AsyncAction<T> = (args: any, abortController?: AbortController) => Promise<T>
