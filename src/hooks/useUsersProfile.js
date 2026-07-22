import { useEffect, useMemo, useRef, useState } from "react"
import { getUserByUsername, UsersApiError } from "../services/users.service"

const EMPTY_STATS = {
    isRegistered: false,
    followers: 0,
    following: 0,
    publicRepos: 0,
    totalStars: 0,
    topRepo: null,
    topRepos: [],
    pullRequestCount: 0,
    mergedPullRequestCount: 0,
    topLanguages: [],
    mostActiveWeekday: null,
    mostActiveMonth: null,
    averagePerWeek: 0,
    longestStreak: 0,
    currentStreak: 0,
    profile: null,
}

const INITIAL_RESULT = {
    username: null,
    stats: EMPTY_STATS,
    isNotFound: false,
    error: null,
}

export const useUserProfile = (username) => {
    const [result, setResult] = useState(INITIAL_RESULT)
    const requestIdRef = useRef(0)

    useEffect(() => {
        if (!username) return

        const controller = new AbortController()
        const requestId = ++requestIdRef.current

        getUserByUsername(username, { signal: controller.signal })
            .then((response) => {
                if (requestId !== requestIdRef.current) return

                setResult({
                    username,
                    stats: response,
                    isNotFound: false,
                    error: null,
                })
            })
            .catch((err) => {
                if (err.name === "AbortError") return
                if (requestId !== requestIdRef.current) return

                setResult({
                    username,
                    stats: EMPTY_STATS,
                    isNotFound: err instanceof UsersApiError && err.status === 404,
                    error: err instanceof UsersApiError ? err.message : "Failed to load user.",
                })
            })

        return () => controller.abort()
    }, [username])

    const isLoading = Boolean(username) && result.username !== username
    const isCurrent = result.username === username

    return useMemo(
        () => ({
            username,
            ...(isCurrent ? result.stats : EMPTY_STATS),
            isLoading,
            isNotFound: isCurrent ? result.isNotFound : false,
            error: isCurrent ? result.error : null,
        }),
        [username, result, isCurrent, isLoading]
    )
}