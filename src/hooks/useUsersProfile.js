import { useEffect, useSyncExternalStore } from "react"
import { getUserByUsername, UsersApiError } from "../services/users.service"
import { createResourceCache } from "../utils/createResourceCache"

const NO_USERNAME_SNAPSHOT = { data: null, isLoading: false, error: null, isStale: false }

async function fetchUser(username) {
    return getUserByUsername(username)
}

const cache = createResourceCache(fetchUser, { ttlMs: 2 * 60 * 1000 })

export const useUserProfile = (username) => {
    const snapshot = useSyncExternalStore(
        (listener) => (username ? cache.subscribe(username, listener) : () => { }),
        () => (username ? cache.getSnapshot(username) : NO_USERNAME_SNAPSHOT)
    )

    useEffect(() => {
        if (!username) return
        cache.ensureFresh(username)
    }, [username])

    const is404 = snapshot.error instanceof UsersApiError && snapshot.error.status === 404

    return {
        username,
        ...(snapshot.data ?? {}),
        isLoading: Boolean(username) && snapshot.isLoading,
        isNotFound: is404,
        error: snapshot.error && !is404 ? (snapshot.error.message ?? "Failed to load user.") : null,
    }
}