import { useCallback, useEffect, useRef, useState } from "react"
import { fetchTechNews } from "../services/techNewsService"

export function useTechNews() {
    const [articles, setArticles] = useState([])
    const [fetchedAt, setFetchedAt] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const isMounted = useRef(true)

    const applyResult = useCallback((data) => {
        if (!isMounted.current) return
        setArticles(data.articles ?? [])
        setFetchedAt(data.fetchedAt ?? null)
    }, [])

    const applyError = useCallback((err) => {
        if (!isMounted.current) return
        setError(err.message ?? "Failed to load tech news")
    }, [])

    const settle = useCallback(() => {
        if (isMounted.current) setIsLoading(false)
    }, [])

    const refresh = useCallback(() => {
        setIsLoading(true)
        setError(null)

        return fetchTechNews({ force: true }).then(applyResult).catch(applyError).finally(settle)
    }, [applyResult, applyError, settle])

    useEffect(() => {
        isMounted.current = true

        fetchTechNews().then(applyResult).catch(applyError).finally(settle)

        return () => {
            isMounted.current = false
        }
    }, [applyResult, applyError, settle])

    return { articles, fetchedAt, isLoading, error, refresh }
}