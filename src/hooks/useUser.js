import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

const ME_URL = 'https://api-gitcv-app.vercel.app/api/auth/me'
const CACHE_TTL = 1000 * 60 * 5 // 5 min

let cachedUser = null
let lastFetch = 0
let pendingPromise = null
const listeners = new Set()

function getSnapshot() {
    return cachedUser
}

function subscribe(listener) {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

function notifyListeners() {
    listeners.forEach((listener) => listener())
}

function setCachedUser(newUser) {
    cachedUser = newUser
    lastFetch = Date.now()
    notifyListeners()
}

async function requestUser() {
    const response = await fetch(ME_URL, {
        method: 'GET',
        credentials: 'include',
    })

    if (!response.ok) {
        if (response.status === 401) {
            return null
        }
        throw new Error(
            `Erro ao buscar usuário: ${response.status} ${response.statusText}`
        )
    }

    const data = await response.json()

    return {
        id: data.id,
        email: data.email,
        username: data.username,
        avatar: data.avatar,
        name: data.name,
        createdAt: data.created_at,
    }
}

function fetchUser() {
    const now = Date.now()

    if (cachedUser && now - lastFetch < CACHE_TTL) {
        return Promise.resolve(cachedUser)
    }

    if (pendingPromise) {
        return pendingPromise
    }

    pendingPromise = requestUser()
        .then((normalizedUser) => {
            setCachedUser(normalizedUser)
            return normalizedUser
        })
        .catch((err) => {
            lastFetch = 0
            setCachedUser(null)
            throw err
        })
        .finally(() => {
            pendingPromise = null
        })

    return pendingPromise
}

export function useUser() {
    const user = useSyncExternalStore(subscribe, getSnapshot)
    const [loading, setLoading] = useState(() => !cachedUser)
    const [error, setError] = useState(null)

    useEffect(() => {
        let mounted = true

        fetchUser()
            .then(() => {
                if (mounted) setError(null)
            })
            .catch((err) => {
                if (mounted) setError(err.message)
            })
            .finally(() => {
                if (mounted) setLoading(false)
            })

        return () => {
            mounted = false
        }
    }, [])

    const setUser = useCallback((newUser) => {
        setCachedUser(newUser)
    }, [])

    const refreshUser = useCallback(async () => {
        cachedUser = null
        lastFetch = 0
        return fetchUser()
    }, [])

    const clearUserCache = useCallback(() => {
        lastFetch = 0
        setCachedUser(null)
    }, [])

    return {
        user,
        loading,
        error,
        setUser,
        refreshUser,
        clearUserCache,
    }
}