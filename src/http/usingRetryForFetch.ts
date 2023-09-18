const MAX_NB_RETRY   = 3
const RETRY_DELAY_MS = 250

export async function usingRetryForFetch(url: string, init: RequestInit | undefined) {
  let retryNumber = 0
  while (true) {
    try {
      const response = await fetch(url, init)
      if (response.ok || response.status === 400 || response.status === 401) {
        return response
      }

      if (++retryNumber > MAX_NB_RETRY) {
        console.error(`Max retries exceeded calling ${url}.`)
        return response
      }
      await sleep(RETRY_DELAY_MS)
    }
    catch (err) {
      await sleep(RETRY_DELAY_MS)
    }
  }
}

function sleep(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}
