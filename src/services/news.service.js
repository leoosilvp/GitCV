const ENDPOINT = "/api/tech-news"

const CACHE_TTL_MS = 15 * 60 * 1000

let cache = {
    data: null,
    expiresAt: 0,
}

let inFlightRequest = null

function isCacheValid() {
    return cache.data && cache.expiresAt > Date.now()
}

async function requestNews() {
    const response = await fetch(ENDPOINT, {
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

export async function fetchTechNews({ force = false } = {}) {
    if (!force && isCacheValid()) {
        return cache.data
    }

    if (inFlightRequest) {
        return inFlightRequest
    }

    inFlightRequest = requestNews()
        .then((data) => {
            cache = { data, expiresAt: Date.now() + CACHE_TTL_MS }
            return data
        })
        .finally(() => {
            inFlightRequest = null
        })

    return inFlightRequest
}

export function clearTechNewsCache() {
    cache = { data: null, expiresAt: 0 }
}