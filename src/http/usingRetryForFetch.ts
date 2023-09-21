const MAX_NUMBER_RETRIES = 3
const RETRY_DELAY_MS     = 250

export async function usingRetryForFetch(url: string, init: RequestInit | undefined) {
  let retryNumber        = 0
  let response: Response = new Response(undefined,
    {
      status: 418,
      statusText: 'Default response value',
    },
  )
  while (retryNumber <= MAX_NUMBER_RETRIES) {
    try {
      response = await fetch(url, init)
      if (response.ok || response.status === 400 || response.status === 401) {
        return response
      }
    }
    catch (err) {
      // Swallow error and retry
    }
    finally {
      retryNumber++
      await sleep(RETRY_DELAY_MS)
    }
  }

  console.error(`Max retries exceeded calling ${url}. Returning:`, response)
  return response
}

function sleep(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}
