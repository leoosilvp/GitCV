import { useEffect, useState } from "react"

const CONTRIBUTIONS_ENDPOINT = "https://api-gitcv-app.vercel.app/api/github/contributions"

const CACHE_TTL_MS = 5 * 60 * 1000

const cache = new Map()
const inflightRequests = new Map()

function getCached(username) {
    const entry = cache.get(username)
    if (!entry) return null
    return { ...entry, isStale: Date.now() > entry.expiresAt }
}

function setCached(username, data) {
    cache.set(username, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

async function fetchContributions(username, signal) {
    const response = await fetch(
        `${CONTRIBUTIONS_ENDPOINT}?username=${encodeURIComponent(username)}`,
        { signal, credentials: "include" }
    )

    if (!response.ok) {
        throw new Error(`Failed to load contributions (${response.status})`)
    }

    const body = await response.json()
    return {
        contributions: body.contributions ?? [],
        totalCount: body.total ?? 0,
    }
}

function loadContributions(username, signal) {
    if (inflightRequests.has(username)) {
        return inflightRequests.get(username)
    }

    const promise = fetchContributions(username, signal)
        .then((result) => {
            setCached(username, result)
            return result
        })
        .finally(() => {
            inflightRequests.delete(username)
        })

    inflightRequests.set(username, promise)
    return promise
}

function buildStateForUsername(username) {
    const entry = username ? getCached(username) : null

    return {
        username,
        contributions: entry?.data.contributions ?? [],
        totalCount: entry?.data.totalCount ?? 0,
        isLoading: Boolean(username) && !entry,
        error: null,
    }
}

export const useGithubContributions = (username) => {
    const [state, setState] = useState(() => buildStateForUsername(username))

    if (username !== state.username) {
        setState(buildStateForUsername(username))
    }

    useEffect(() => {
        if (!username) return

        const entry = getCached(username)

        if (entry && !entry.isStale) return

        const controller = new AbortController()

        loadContributions(username, controller.signal)
            .then((result) => {
                setState((prev) =>
                    prev.username === username
                        ? { ...prev, contributions: result.contributions, totalCount: result.totalCount, isLoading: false, error: null }
                        : prev
                )
            })
            .catch((err) => {
                if (err.name === "AbortError") return
                setState((prev) =>
                    prev.username === username
                        ? { ...prev, isLoading: false, error: err.message }
                        : prev
                )
            })

        return () => controller.abort()
    }, [username])

    return {
        contributions: state.contributions,
        totalCount: state.totalCount,
        isLoading: state.isLoading,
        error: state.error,
    }
}