const API_BASE_URL = 'https://api-gitcv-app.vercel.app/api/auth'

const DEFAULT_PAGE_SIZE = 20

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
        throw new UsersApiError("Network error while reaching the users API.", 0)
    }

    const isJson = response.headers.get("content-type")?.includes("application/json")
    const body = isJson ? await response.json().catch(() => null) : null

    if (!response.ok) {
        throw new UsersApiError(body?.error ?? `Request failed (${response.status})`, response.status)
    }

    return body
}

export function listUsers({ search, page = 1, pageSize = DEFAULT_PAGE_SIZE, signal } = {}) {
    const query = buildQueryString({ search, page, pageSize })
    return request(`/api/users${query}`, { signal })
}

export function getUserByUsername(username, { signal } = {}) {
    if (!username) {
        return Promise.reject(new UsersApiError("Username is required.", 400))
    }

    return request(`/api/users/${encodeURIComponent(username)}`, { signal })
}