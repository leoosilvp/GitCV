const ENDPOINT = "https://api-gitcv-app.vercel.app/api/news"

const CACHE_TTL_MS = 15 * 60 * 1000

// One cache entry per page — the previous version cached a single global
// entry and never forwarded `page` to the request, so every call silently
// returned page 1 regardless of what was requested.
const cacheByPage = new Map()
const inFlightByPage = new Map()

function isCacheValid(entry) {
    return entry && entry.expiresAt > Date.now()
}

async function requestNews(page) {
    const url = new URL(ENDPOINT)
    url.searchParams.set("page", String(page))

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

export async function fetchTechNews({ page = 1, force = false } = {}) {
    const cached = cacheByPage.get(page)

    if (!force && isCacheValid(cached)) {
        return cached.data
    }

    if (inFlightByPage.has(page)) {
        return inFlightByPage.get(page)
    }

    const request = requestNews(page)
        .then((data) => {
            cacheByPage.set(page, { data, expiresAt: Date.now() + CACHE_TTL_MS })
            return data
        })
        .finally(() => {
            inFlightByPage.delete(page)
        })

    inFlightByPage.set(page, request)
    return request
}

export function clearTechNewsCache() {
    cacheByPage.clear()
}