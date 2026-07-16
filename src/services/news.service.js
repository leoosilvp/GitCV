const ENDPOINT = "https://api-gitcv-app.vercel.app/api/news"

const CACHE_TTL_MS = 15 * 60 * 1000

// Cache key combines page + search, since each distinct combination is a
// distinct server-side result set.
const cacheByKey = new Map()
const inFlightByKey = new Map()

function buildCacheKey(page, search) {
    return `${page}::${search}`
}

function isCacheValid(entry) {
    return entry && entry.expiresAt > Date.now()
}

async function requestNews(page, search) {
    const url = new URL(ENDPOINT)
    url.searchParams.set("page", String(page))
    if (search) url.searchParams.set("search", search)

    const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
    })

    if (!response.ok) {
        const body = await response.json().catch(() => null)
        const message = body?.error ?? `Request failed with status ${response.status}`
        throw new Error(message)
    }

    return response.json()
}

export async function fetchTechNews({ page = 1, search = "", force = false } = {}) {
    const normalizedSearch = search.trim().toLowerCase()
    const key = buildCacheKey(page, normalizedSearch)

    const cached = cacheByKey.get(key)
    if (!force && isCacheValid(cached)) {
        return cached.data
    }

    if (inFlightByKey.has(key)) {
        return inFlightByKey.get(key)
    }

    const request = requestNews(page, normalizedSearch)
        .then((data) => {
            cacheByKey.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
            return data
        })
        .finally(() => {
            inFlightByKey.delete(key)
        })

    inFlightByKey.set(key, request)
    return request
}

export function clearTechNewsCache() {
    cacheByKey.clear()
}