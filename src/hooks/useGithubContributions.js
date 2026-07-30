import { useEffect, useSyncExternalStore } from "react"
import { createResourceCache } from "../utils/createResourceCache"

const CONTRIBUTIONS_ENDPOINT = "https://api-gitcv-app.vercel.app/api/github/contributions"
const NO_USERNAME_SNAPSHOT = { data: null, isLoading: false, error: null, isStale: false }

async function fetchContributions(username) {
    const response = await fetch(
        `${CONTRIBUTIONS_ENDPOINT}?username=${encodeURIComponent(username)}`,
        { credentials: "include" }
    )

    if (!response.ok) {
        throw new Error(`Failed to load contributions (${response.status})`)
    }

    const body = await response.json()
    return {
        contributions: body.contributions ?? [],
        totalCount: body.total ?? 0,
    }
}

const cache = createResourceCache(fetchContributions)

export const useGithubContributions = (username) => {
    const snapshot = useSyncExternalStore(
        (listener) => (username ? cache.subscribe(username, listener) : () => { }),
        () => (username ? cache.getSnapshot(username) : NO_USERNAME_SNAPSHOT)
    )

    useEffect(() => {
        if (!username) return
        cache.ensureFresh(username)
    }, [username])

    return {
        contributions: snapshot.data?.contributions ?? [],
        totalCount: snapshot.data?.totalCount ?? 0,
        isLoading: Boolean(username) && snapshot.isLoading,
        error: snapshot.error?.message ?? null,
    }
}