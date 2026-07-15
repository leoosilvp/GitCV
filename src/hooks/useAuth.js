import { useEffect, useState } from 'react'
import { getMe } from '../services/auth.service'

const CACHE_TIME = 2 * 60 * 1000 // 2 min

let authCache = null

export function useAuth() {
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        async function checkAuth() {
            const now = Date.now()

            if (authCache && now - authCache.timestamp < CACHE_TIME) {
                setIsAuthenticated(authCache.isAuthenticated)
                setLoading(false)
                return
            }

            try {
                const user = await getMe()

                authCache = { isAuthenticated: Boolean(user), timestamp: now }
                setIsAuthenticated(Boolean(user))
            } catch {
                authCache = { isAuthenticated: false, timestamp: now }
                setIsAuthenticated(false)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    return { loading, isAuthenticated }
}