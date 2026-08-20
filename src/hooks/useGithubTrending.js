import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchTrendingRepositories, TRENDING_SINCE, TrendingApiError } from '../services/trending.service'

export function useGithubTrending({ since = TRENDING_SINCE.DAILY, language } = {}) {
  const [repositories, setRepositories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const abortControllerRef = useRef(null)

  const runFetch = useCallback(async () => {

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchTrendingRepositories({ since, language, signal: controller.signal })
      if (controller.signal.aborted) return
      setRepositories(result.repositories)
    } catch (err) {
      if (err.name === 'AbortError' || controller.signal.aborted) return

      setError(
        err instanceof TrendingApiError
          ? err
          : new TrendingApiError('Erro inesperado ao buscar repositórios em alta.', { cause: err })
      )
    } finally {
      if (!controller.signal.aborted) setIsLoading(false)
    }
  }, [since, language])

  useEffect(() => {

    const timeoutId = setTimeout(runFetch, 0)

    return () => {
      clearTimeout(timeoutId)
      abortControllerRef.current?.abort()
    }
  }, [runFetch])

  return {
    repositories,
    isLoading,
    error,
    refresh: runFetch,
  }
}
