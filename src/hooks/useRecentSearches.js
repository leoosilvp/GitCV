import { useCallback, useSyncExternalStore } from "react"

const STORAGE_KEY = "gitcv:recent-searches"
const MAX_ENTRIES = 10

const listeners = new Set()

function readFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []

        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string") : []
    } catch {
        return []
    }
}

let cache = readFromStorage()

function writeToStorage(usernames) {
    cache = usernames
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usernames))
    } catch {
        // ignore
    }
    for (const listener of listeners) listener()
}

function subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

function getSnapshot() {
    return cache
}

export function recordRecentSearch(username) {
    if (!username) return

    const normalized = username.trim()
    if (!normalized) return

    const withoutExisting = cache.filter(
        (entry) => entry.toLowerCase() !== normalized.toLowerCase()
    )

    writeToStorage([normalized, ...withoutExisting].slice(0, MAX_ENTRIES))
}

export function removeRecentSearch(username) {
    writeToStorage(cache.filter((entry) => entry.toLowerCase() !== username.toLowerCase()))
}

export function useRecentSearches() {
    const usernames = useSyncExternalStore(subscribe, getSnapshot)

    const remove = useCallback((username) => removeRecentSearch(username), [])

    return { usernames, removeRecentSearch: remove }
}