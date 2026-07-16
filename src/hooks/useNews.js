import { useCallback, useEffect, useRef, useState } from "react"
import { fetchTechNews } from "../services/news.service"

const SEARCH_DEBOUNCE_MS = 400

export function useTechNews({ initialPage = 1 } = {}) {
    const [page, setPage] = useState(initialPage)
    const [searchInput, setSearchInput] = useState("") // raw value, updates every keystroke
    const [debouncedSearch, setDebouncedSearch] = useState("") // value actually sent to the backend

    const [resolvedKey, setResolvedKey] = useState(null) // last "page::search" whose data is applied
    const [isRefreshing, setIsRefreshing] = useState(false)

    const [articles, setArticles] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalArticles, setTotalArticles] = useState(0)
    const [fetchedAt, setFetchedAt] = useState(null)
    const [error, setError] = useState(null)

    const isMounted = useRef(true)

    const previousSearchRef = useRef("")

    // Debounce: only update `debouncedSearch` (and therefore trigger a fetch)
    // after the user stops typing for SEARCH_DEBOUNCE_MS. The page reset lives
    // in the same timeout callback — not a separate effect reacting to
    // `debouncedSearch` — so these setState calls happen inside an async timer
    // callback rather than synchronously in the effect body.
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const trimmed = searchInput.trim()
            if (previousSearchRef.current !== trimmed) {
                previousSearchRef.current = trimmed
                setDebouncedSearch(trimmed)
                setPage(1)
            }
        }, SEARCH_DEBOUNCE_MS)

        return () => clearTimeout(timeoutId)
    }, [searchInput])

    const currentKey = `${page}::${debouncedSearch}`
    const isLoading = isRefreshing || currentKey !== resolvedKey

    const applyResult = useCallback((key, data) => {
        if (!isMounted.current) return
        setArticles(data.articles ?? [])
        setTotalPages(data.totalPages ?? 1)
        setTotalArticles(data.totalArticles ?? 0)
        setFetchedAt(data.fetchedAt ?? null)
        setError(null)
        setResolvedKey(key)
    }, [])

    const applyError = useCallback((key, err) => {
        if (!isMounted.current) return
        setError(err.message ?? "Failed to load tech news")
        setResolvedKey(key)
    }, [])

    const load = useCallback(
        (targetPage, targetSearch, { force = false } = {}) => {
            const key = `${targetPage}::${targetSearch}`
            return fetchTechNews({ page: targetPage, search: targetSearch, force })
                .then((data) => applyResult(key, data))
                .catch((err) => applyError(key, err))
        },
        [applyResult, applyError]
    )

    useEffect(() => {
        isMounted.current = true
        load(page, debouncedSearch)

        return () => {
            isMounted.current = false
        }
    }, [page, debouncedSearch, load])

    // Triggered from a user event (button click), never from an effect body,
    // so setting isRefreshing synchronously here is safe.
    const refresh = useCallback(() => {
        setIsRefreshing(true)
        return load(page, debouncedSearch, { force: true }).finally(() => {
            if (isMounted.current) setIsRefreshing(false)
        })
    }, [load, page, debouncedSearch])

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

    const clearSearch = useCallback(() => setSearchInput(""), [])

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
        searchTerm: searchInput,
        setSearchTerm: setSearchInput,
        clearSearch,
    }
}