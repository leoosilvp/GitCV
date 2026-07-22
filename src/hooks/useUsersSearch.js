import { useEffect, useMemo, useRef, useState } from "react"
import { listUsers, UsersApiError } from "../services/users.service"

const DEFAULT_PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 300

const INITIAL_RESULT = {
    key: null,
    users: [],
    total: 0,
    totalPages: 1,
    error: null,
}

function buildRequestKey({ search, page, pageSize }) {
    return `${search}::${page}::${pageSize}`
}

export const useUsersSearch = ({ pageSize = DEFAULT_PAGE_SIZE, initialSearch = "" } = {}) => {
    const [searchInput, setSearchInput] = useState(initialSearch)
    const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(INITIAL_RESULT)

    const requestIdRef = useRef(0)

    const requestKey = buildRequestKey({ search: debouncedSearch, page, pageSize })

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchInput.trim())
            setPage(1)
        }, SEARCH_DEBOUNCE_MS)

        return () => clearTimeout(timeout)
    }, [searchInput])

    useEffect(() => {
        const controller = new AbortController()
        const requestId = ++requestIdRef.current

        listUsers({ search: debouncedSearch, page, pageSize, signal: controller.signal })
            .then((response) => {
                if (requestId !== requestIdRef.current) return

                setResult({
                    key: requestKey,
                    users: response.users,
                    total: response.total,
                    totalPages: response.totalPages,
                    error: null,
                })
            })
            .catch((err) => {
                if (err.name === "AbortError") return
                if (requestId !== requestIdRef.current) return

                setResult((prev) => ({
                    ...prev,
                    key: requestKey,
                    error: err instanceof UsersApiError ? err.message : "Failed to load users.",
                }))
            })

        return () => controller.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, page, pageSize])

    const isLoading = result.key !== requestKey
    const error = result.key === requestKey ? result.error : null

    const hasNextPage = page < result.totalPages
    const hasPreviousPage = page > 1

    return useMemo(
        () => ({
            search: searchInput,
            setSearch: setSearchInput,
            page,
            setPage,
            users: result.users,
            total: result.total,
            totalPages: result.totalPages,
            hasNextPage,
            hasPreviousPage,
            goToNextPage: () =>
                setPage((current) => (current < result.totalPages ? current + 1 : current)),
            goToPreviousPage: () => setPage((current) => (current > 1 ? current - 1 : current)),
            isLoading,
            error,
        }),
        [searchInput, page, result, hasNextPage, hasPreviousPage, isLoading, error]
    )
}