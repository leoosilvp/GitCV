import { useEffect, useState } from 'react'

const ME_URL = 'https://api-gitcv-app.vercel.app/api/auth/me'
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
                const res = await fetch(ME_URL, { credentials: 'include' })

                authCache = { isAuthenticated: res.ok, timestamp: now }
                setIsAuthenticated(res.ok)
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