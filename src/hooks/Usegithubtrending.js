import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchTrendingRepositories, TRENDING_SINCE, TrendingApiError } from '../services/trending.service'

const INITIAL_STATE = {
  repositories: [],
  total: 0,
  page: 0,
  hasMore: false,
}

export function useGithubTrending({
  since = TRENDING_SINCE.DAILY,
  language,
  perPage = 25,
} = {}) {
  const [data, setData] = useState(INITIAL_STATE)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)

  const abortControllerRef = useRef(null)
  const isMountedRef = useRef(true)

  const runFetch = useCallback(
    async (page, { append }) => {
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      if (append) setIsLoadingMore(true)
      else setIsLoading(true)
      setError(null)

      try {
        const result = await fetchTrendingRepositories({
          since,
          language,
          page,
          perPage,
          signal: controller.signal,
        })

        if (!isMountedRef.current) return

        setData((prev) => ({
          repositories: append ? [...prev.repositories, ...result.repositories] : result.repositories,
          total: result.total,
          page: result.page,
          hasMore: result.page * result.perPage < result.total,
        }))
      } catch (err) {
        if (err.name === 'AbortError') return
        if (!isMountedRef.current) return

        setError(
          err instanceof TrendingApiError
            ? err
            : new TrendingApiError('Erro inesperado ao buscar repositórios em alta.', { cause: err })
        )
      } finally {
        if (!isMountedRef.current)
          if (append) setIsLoadingMore(false)
          else setIsLoading(false)
      }
    },
    [since, language, perPage]
  )

  useEffect(() => {
    isMountedRef.current = true

    const controller = new AbortController()
    abortControllerRef.current = controller
    queueMicrotask(() => {
      if (controller.signal.aborted) return
      runFetch(1, { append: false })
    })

    return () => {
      isMountedRef.current = false
      controller.abort()
    }
  }, [runFetch])

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore || !data.hasMore) return
    runFetch(data.page + 1, { append: true })
  }, [runFetch, isLoading, isLoadingMore, data.hasMore, data.page])

  const refresh = useCallback(() => {
    runFetch(1, { append: false })
  }, [runFetch])

  return {
    repositories: data.repositories,
    total: data.total,
    hasMore: data.hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    refresh,
  }
}