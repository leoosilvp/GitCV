import { useEffect, useMemo, useRef, useState } from "react"
import { searchGithubUsers, UsersApiError } from "../services/users.service"

const DEFAULT_PER_PAGE = 10
const SEARCH_DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 2

const INITIAL_RESULT = {
    key: null,
    usernames: [],
    total: 0,
    error: null,
}

function buildRequestKey({ query, page, perPage }) {
    return `${query}::${page}::${perPage}`
}

export const useUsersSearch = ({ perPage = DEFAULT_PER_PAGE, initialSearch = "" } = {}) => {
    const [searchInput, setSearchInput] = useState(initialSearch)
    const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(INITIAL_RESULT)

    const requestIdRef = useRef(0)

    const isQueryLongEnough = debouncedSearch.length >= MIN_QUERY_LENGTH
    const requestKey = buildRequestKey({ query: debouncedSearch, page, perPage })

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchInput.trim())
            setPage(1)
        }, SEARCH_DEBOUNCE_MS)

        return () => clearTimeout(timeout)
    }, [searchInput])

    useEffect(() => {
        if (!isQueryLongEnough) return

        const controller = new AbortController()
        const requestId = ++requestIdRef.current

        searchGithubUsers(debouncedSearch, { page, perPage, signal: controller.signal })
            .then((response) => {
                if (requestId !== requestIdRef.current) return // superseded by a newer request

                setResult({
                    key: requestKey,
                    usernames: response.usernames,
                    total: response.total,
                    error: null,
                })
            })
            .catch((err) => {
                if (err.name === "AbortError") return
                if (requestId !== requestIdRef.current) return

                setResult((prev) => ({
                    ...prev,
                    key: requestKey,
                    error:
                        err instanceof UsersApiError
                            ? err.message
                            : "Failed to search GitHub users.",
                }))
            })

        return () => controller.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, page, perPage, isQueryLongEnough])

    const isLoading = isQueryLongEnough && result.key !== requestKey
    const error = result.key === requestKey ? result.error : null

    const totalPages = Math.max(1, Math.ceil(result.total / perPage))
    const hasNextPage = isQueryLongEnough && page < totalPages
    const hasPreviousPage = page > 1

    return useMemo(
        () => ({
            search: searchInput,
            setSearch: setSearchInput,
            page,
            setPage,
            usernames: isQueryLongEnough ? result.usernames : [],
            total: isQueryLongEnough ? result.total : 0,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            goToNextPage: () => setPage((current) => (current < totalPages ? current + 1 : current)),
            goToPreviousPage: () => setPage((current) => (current > 1 ? current - 1 : current)),
            isQueryTooShort: searchInput.trim().length > 0 && searchInput.trim().length < MIN_QUERY_LENGTH,
            isLoading,
            error,
        }),
        [
            searchInput,
            page,
            result,
            isQueryLongEnough,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            isLoading,
            error,
        ]
    )
}