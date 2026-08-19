const TRENDING_ENDPOINT = 'https://api-gitcv-app.vercel.app/api/github/trending'
const REQUEST_TIMEOUT_MS = 8000

export const TRENDING_SINCE = Object.freeze({
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
})

export class TrendingApiError extends Error {
  constructor(message, { status, cause } = {}) {
    super(message)
    this.name = 'TrendingApiError'
    this.status = status ?? null
    this.cause = cause ?? null
  }
}

function buildQueryString({ since, language }) {
  const params = new URLSearchParams()

  if (since) params.set('since', since)
  if (language) params.set('language', language)

  const query = params.toString()
  return query ? `?${query}` : ''
}

async function parseErrorBody(response) {
  try {
    const body = await response.json()
    return body?.error ?? response.statusText
  } catch {
    return response.statusText || 'Unknown error'
  }
}

export async function fetchTrendingRepositories({
  since = TRENDING_SINCE.DAILY,
  language,
  signal,
} = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  const onExternalAbort = () => controller.abort()
  if (signal) {
    if (signal.aborted) controller.abort()
    else signal.addEventListener('abort', onExternalAbort, { once: true })
  }

  const url = `${TRENDING_ENDPOINT}${buildQueryString({ since, language })}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      const message = await parseErrorBody(response)
      throw new TrendingApiError(message, { status: response.status })
    }

    return await response.json()
  } catch (err) {
    if (err instanceof TrendingApiError) throw err

    if (err.name === 'AbortError') {
      if (signal?.aborted) throw err
      throw new TrendingApiError('Request timed out while fetching trending repositories.', {
        status: 408,
        cause: err,
      })
    }

    throw new TrendingApiError('Network failure while fetching trending repositories.', { cause: err })
  } finally {
    clearTimeout(timeoutId)
    if (signal) signal.removeEventListener('abort', onExternalAbort)
  }
}
