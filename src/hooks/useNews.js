import { useCallback, useEffect, useRef, useState } from "react"
import { fetchTechNews } from "../services/news.service"

export function useTechNews({ initialPage = 1 } = {}) {
    const [page, setPage] = useState(initialPage)
    const [resolvedPage, setResolvedPage] = useState(null) // last page whose data is currently applied
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [articles, setArticles] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalArticles, setTotalArticles] = useState(0)
    const [fetchedAt, setFetchedAt] = useState(null)
    const [error, setError] = useState(null)

    const isMounted = useRef(true)

    // Derived, not stored: true whenever the page we want isn't the page
    // we've actually applied data for yet, or a manual refresh is running.
    // This avoids ever calling setIsLoading(true) synchronously inside an effect.
    const isLoading = isRefreshing || page !== resolvedPage

    const applyResult = useCallback((targetPage, data) => {
        if (!isMounted.current) return
        setArticles(data.articles ?? [])
        setTotalPages(data.totalPages ?? 1)
        setTotalArticles(data.totalArticles ?? 0)
        setFetchedAt(data.fetchedAt ?? null)
        setError(null)
        setResolvedPage(targetPage)
    }, [])

    const applyError = useCallback((targetPage, err) => {
        if (!isMounted.current) return
        setError(err.message ?? "Failed to load tech news")
        setResolvedPage(targetPage) // stop showing loading state even though it failed
    }, [])

    const load = useCallback(
        (targetPage, { force = false } = {}) =>
            fetchTechNews({ page: targetPage, force })
                .then((data) => applyResult(targetPage, data))
                .catch((err) => applyError(targetPage, err)),
        [applyResult, applyError]
    )

    useEffect(() => {
        isMounted.current = true
        load(page)

        return () => {
            isMounted.current = false
        }
    }, [page, load])

    // Triggered from a user event (button click), never from an effect body,
    // so setting isRefreshing synchronously here is safe.
    const refresh = useCallback(() => {
        setIsRefreshing(true)
        return load(page, { force: true }).finally(() => {
            if (isMounted.current) setIsRefreshing(false)
        })
    }, [load, page])

    const goToPage = useCallback(
        (targetPage) => {
            setPage((current) => {
                const next = Math.max(1, Math.min(targetPage, totalPages))
                return next === current ? current : next
            })
        },
        [totalPages]
    )

    const nextPage = useCallback(() => goToPage(page + 1), [goToPage, page])
    const previousPage = useCallback(() => goToPage(page - 1), [goToPage, page])

    return {
        articles,
        page,
        totalPages,
        totalArticles,
        fetchedAt,
        isLoading,
        error,
        goToPage,
        nextPage,
        previousPage,
        refresh,
    }
}