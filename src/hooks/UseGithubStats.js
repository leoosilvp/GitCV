import { useEffect, useState } from "react"

const GITHUB_API_BASE = "https://api.github.com"
const CACHE_TTL_MS = 5 * 60 * 1000
const MAX_REPO_PAGES = 10
const REPOS_PER_PAGE = 100

const WEEKDAY_LABELS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

const cache = new Map()
const inflightRequests = new Map()

function getCached(username) {
    const entry = cache.get(username)
    if (!entry) return null
    return { ...entry, isStale: Date.now() > entry.expiresAt }
}

function setCached(username, data) {
    cache.set(username, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

async function fetchProfile(username, signal) {
    const response = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
        signal,
        headers: { Accept: "application/vnd.github+json" },
    })

    if (!response.ok) {
        throw new Error(`Failed to load GitHub profile (${response.status})`)
    }

    return response.json()
}

async function fetchAllRepos(username, signal) {
    const repos = []

    for (let page = 1; page <= MAX_REPO_PAGES; page += 1) {
        const response = await fetch(
            `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=${REPOS_PER_PAGE}&page=${page}&sort=updated`,
            { signal, headers: { Accept: "application/vnd.github+json" } }
        )

        if (!response.ok) {
            throw new Error(`Failed to load GitHub repositories (${response.status})`)
        }

        const pageData = await response.json()
        repos.push(...pageData)

        if (pageData.length < REPOS_PER_PAGE) break
    }

    return repos
}

function summarizeRepos(repos) {
    let totalStars = 0
    let topRepo = null

    for (const repo of repos) {
        const stars = repo.stargazers_count ?? 0
        totalStars += stars

        if (!topRepo || stars > topRepo.stars) {
            topRepo = {
                name: repo.name,
                fullName: repo.full_name,
                url: repo.html_url,
                description: repo.description,
                stars,
                language: repo.language,
            }
        }
    }

    return { totalStars, topRepo }
}

function analyzeContributions(contributions) {
    if (!Array.isArray(contributions) || contributions.length === 0) {
        return { mostActiveWeekday: null, longestStreak: 0 }
    }

    const countsByWeekday = new Array(7).fill(0)

    const sorted = [...contributions].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    )

    let longestStreak = 0
    let currentStreak = 0
    let previousDate = null

    for (const entry of sorted) {
        const date = new Date(`${entry.date}T00:00:00`)
        const count = entry.count ?? 0

        countsByWeekday[date.getDay()] += count

        if (count > 0) {
            if (previousDate) {
                const diffDays = Math.round((date - previousDate) / 86_400_000)
                currentStreak = diffDays === 1 ? currentStreak + 1 : 1
            } else {
                currentStreak = 1
            }
            longestStreak = Math.max(longestStreak, currentStreak)
            previousDate = date
        } else {
            currentStreak = 0
            previousDate = date
        }
    }

    const bestWeekdayIndex = countsByWeekday.reduce(
        (bestIndex, value, index, arr) => (value > arr[bestIndex] ? index : bestIndex),
        0
    )

    return {
        mostActiveWeekday: {
            index: bestWeekdayIndex,
            label: WEEKDAY_LABELS[bestWeekdayIndex],
            commitCount: countsByWeekday[bestWeekdayIndex],
        },
        longestStreak,
    }
}

async function fetchGithubStats(username, signal) {
    const [profile, repos] = await Promise.all([
        fetchProfile(username, signal),
        fetchAllRepos(username, signal),
    ])

    const { totalStars, topRepo } = summarizeRepos(repos)

    return {
        followers: profile.followers ?? 0,
        following: profile.following ?? 0,
        publicRepos: profile.public_repos ?? repos.length,
        totalStars,
        topRepo,
        profile: {
            login: profile.login,
            name: profile.name,
            avatarUrl: profile.avatar_url,
            bio: profile.bio,
            url: profile.html_url,
        },
    }
}

function loadGithubStats(username, signal) {
    if (inflightRequests.has(username)) {
        return inflightRequests.get(username)
    }

    const promise = fetchGithubStats(username, signal)
        .then((result) => {
            setCached(username, result)
            return result
        })
        .finally(() => {
            inflightRequests.delete(username)
        })

    inflightRequests.set(username, promise)
    return promise
}

function buildStateForUsername(username) {
    const entry = username ? getCached(username) : null

    return {
        username,
        followers: entry?.data.followers ?? 0,
        following: entry?.data.following ?? 0,
        publicRepos: entry?.data.publicRepos ?? 0,
        totalStars: entry?.data.totalStars ?? 0,
        topRepo: entry?.data.topRepo ?? null,
        profile: entry?.data.profile ?? null,
        isLoading: Boolean(username) && !entry,
        error: null,
    }
}

export const useGithubStats = (username, contributions) => {
    const [state, setState] = useState(() => buildStateForUsername(username))

    if (username !== state.username) {
        setState(buildStateForUsername(username))
    }

    useEffect(() => {
        if (!username) return

        const entry = getCached(username)

        if (entry && !entry.isStale) return

        const controller = new AbortController()

        loadGithubStats(username, controller.signal)
            .then((result) => {
                setState((prev) =>
                    prev.username === username
                        ? {
                            ...prev,
                            followers: result.followers,
                            following: result.following,
                            publicRepos: result.publicRepos,
                            totalStars: result.totalStars,
                            topRepo: result.topRepo,
                            profile: result.profile,
                            isLoading: false,
                            error: null,
                        }
                        : prev
                )
            })
            .catch((err) => {
                if (err.name === "AbortError") return
                setState((prev) =>
                    prev.username === username
                        ? { ...prev, isLoading: false, error: err.message }
                        : prev
                )
            })

        return () => controller.abort()
    }, [username])

    const { mostActiveWeekday, longestStreak } = analyzeContributions(contributions)

    return {
        followers: state.followers,
        following: state.following,
        publicRepos: state.publicRepos,
        totalStars: state.totalStars,
        topRepo: state.topRepo,
        mostActiveWeekday,
        longestStreak,
        profile: state.profile,
        isLoading: state.isLoading,
        error: state.error,
    }
}