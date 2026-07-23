const API_BASE_URL = 'https://api-gitcv-app.vercel.app'

const DEFAULT_PER_PAGE = 10

export class UsersApiError extends Error {
    constructor(message, status) {
        super(message)
        this.name = "UsersApiError"
        this.status = status
    }
}

function buildQueryString(params) {
    const query = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "") continue
        query.set(key, String(value))
    }

    const queryString = query.toString()
    return queryString ? `?${queryString}` : ""
}

async function request(path, { signal } = {}) {
    let response

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            signal,
        })
    } catch (err) {
        if (err.name === "AbortError") throw err
        throw new UsersApiError("Network error while reaching the API.", 0)
    }

    const isJson = response.headers.get("content-type")?.includes("application/json")
    const body = isJson ? await response.json().catch(() => null) : null

    if (!response.ok) {
        throw new UsersApiError(body?.error ?? `Request failed (${response.status})`, response.status)
    }

    return body
}

export function searchGithubUsers(query, { page = 1, perPage = DEFAULT_PER_PAGE, signal } = {}) {
    const q = buildQueryString({ q: query, page, perPage })
    return request(`/api/github/search-users${q}`, { signal })
}

export function getUserByUsername(username, { signal } = {}) {
    if (!username) {
        return Promise.reject(new UsersApiError("Username is required.", 400))
    }

    return request(`/api/users/${encodeURIComponent(username)}`, { signal })
}