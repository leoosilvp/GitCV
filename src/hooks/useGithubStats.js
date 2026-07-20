import { useEffect, useState } from "react"

const GITHUB_API_BASE = "https://api.github.com"
const CACHE_TTL_MS = 5 * 60 * 1000
const MAX_REPO_PAGES = 10
const REPOS_PER_PAGE = 100
const TOP_LANGUAGES_LIMIT = 5

const WEEKDAY_LABELS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

const MONTH_LABELS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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

async function fetchPullRequestCount(username, signal) {
    const response = await fetch(
        `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(`type:pr author:${username}`)}&per_page=1`,
        { signal, headers: { Accept: "application/vnd.github+json" } }
    )

    if (!response.ok) {
        throw new Error(`Failed to load pull request count (${response.status})`)
    }

    const body = await response.json()
    return body.total_count ?? 0
}

async function fetchMergedPullRequestCount(username, signal) {
    const response = await fetch(
        `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(`type:pr author:${username} is:merged`)}&per_page=1`,
        { signal, headers: { Accept: "application/vnd.github+json" } }
    )

    if (!response.ok) {
        throw new Error(`Failed to load merged pull request count (${response.status})`)
    }

    const body = await response.json()
    return body.total_count ?? 0
}

async function fetchRepoLanguages(repo, signal) {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${repo.full_name}/languages`, {
        signal,
        headers: { Accept: "application/vnd.github+json" },
    })

    if (!response.ok) return {}

    return response.json()
}

async function fetchLanguageBreakdown(repos, signal) {
    const sourceRepos = repos.filter((repo) => !repo.fork)

    const perRepoLanguages = await Promise.all(
        sourceRepos.map((repo) => fetchRepoLanguages(repo, signal))
    )

    const bytesByLanguage = new Map()

    for (const languages of perRepoLanguages) {
        for (const [language, bytes] of Object.entries(languages)) {
            bytesByLanguage.set(language, (bytesByLanguage.get(language) ?? 0) + bytes)
        }
    }

    const totalBytes = [...bytesByLanguage.values()].reduce((sum, bytes) => sum + bytes, 0)

    if (totalBytes === 0) return []

    return [...bytesByLanguage.entries()]
        .sort(([, bytesA], [, bytesB]) => bytesB - bytesA)
        .slice(0, TOP_LANGUAGES_LIMIT)
        .map(([language, bytes]) => ({
            language,
            percentage: Math.round((bytes / totalBytes) * 1000) / 10,
        }))
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
        return {
            mostActiveWeekday: null,
            mostActiveMonth: null,
            averagePerWeek: 0,
            longestStreak: 0,
            currentStreak: 0,
        }
    }

    const countsByWeekday = new Array(7).fill(0)
    const countsByMonth = new Array(12).fill(0)

    const sorted = [...contributions].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    )

    let totalCount = 0
    let longestStreak = 0
    let runningStreak = 0
    let previousDate = null
    let lastActiveDate = null
    let streakAsOfLastActiveDate = 0

    for (const entry of sorted) {
        const date = new Date(`${entry.date}T00:00:00`)
        const count = entry.count ?? 0

        totalCount += count
        countsByWeekday[date.getDay()] += count
        countsByMonth[date.getMonth()] += count

        if (count > 0) {
            if (previousDate) {
                const diffDays = Math.round((date - previousDate) / 86_400_000)
                runningStreak = diffDays === 1 ? runningStreak + 1 : 1
            } else {
                runningStreak = 1
            }
            longestStreak = Math.max(longestStreak, runningStreak)
            lastActiveDate = date
            streakAsOfLastActiveDate = runningStreak
            previousDate = date
        } else {
            runningStreak = 0
            previousDate = date
        }
    }

    const lastEntry = sorted[sorted.length - 1]
    const lastTrackedDate = new Date(`${lastEntry.date}T00:00:00`)
    const daysSinceLastActivity = lastActiveDate
        ? Math.round((lastTrackedDate - lastActiveDate) / 86_400_000)
        : Infinity

    const activeCurrentStreak = daysSinceLastActivity <= 1 ? streakAsOfLastActiveDate : 0

    const pickBestIndex = (counts) =>
        counts.reduce((bestIndex, value, index, arr) => (value > arr[bestIndex] ? index : bestIndex), 0)

    const bestWeekdayIndex = pickBestIndex(countsByWeekday)
    const bestMonthIndex = pickBestIndex(countsByMonth)

    const firstDate = new Date(`${sorted[0].date}T00:00:00`)
    const lastDate = new Date(`${lastEntry.date}T00:00:00`)
    const trackedDays = Math.max(1, Math.round((lastDate - firstDate) / 86_400_000) + 1)
    const trackedWeeks = Math.max(1, trackedDays / 7)

    return {
        mostActiveWeekday: {
            index: bestWeekdayIndex,
            label: WEEKDAY_LABELS[bestWeekdayIndex],
            commitCount: countsByWeekday[bestWeekdayIndex],
        },
        mostActiveMonth: {
            index: bestMonthIndex,
            label: MONTH_LABELS[bestMonthIndex],
            commitCount: countsByMonth[bestMonthIndex],
        },
        averagePerWeek: Math.round(totalCount / trackedWeeks),
        longestStreak,
        currentStreak: activeCurrentStreak,
    }
}

async function fetchGithubStats(username, signal) {
    const [profile, repos, pullRequestCount, mergedPullRequestCount] = await Promise.all([
        fetchProfile(username, signal),
        fetchAllRepos(username, signal),
        fetchPullRequestCount(username, signal),
        fetchMergedPullRequestCount(username, signal),
    ])

    const { totalStars, topRepo } = summarizeRepos(repos)
    const topLanguages = await fetchLanguageBreakdown(repos, signal)

    return {
        followers: profile.followers ?? 0,
        following: profile.following ?? 0,
        publicRepos: profile.public_repos ?? repos.length,
        totalStars,
        topRepo,
        pullRequestCount,
        mergedPullRequestCount,
        topLanguages,
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
        pullRequestCount: entry?.data.pullRequestCount ?? 0,
        mergedPullRequestCount: entry?.data.mergedPullRequestCount ?? 0,
        topLanguages: entry?.data.topLanguages ?? [],
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
                            pullRequestCount: result.pullRequestCount,
                            mergedPullRequestCount: result.mergedPullRequestCount,
                            topLanguages: result.topLanguages,
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

    const { mostActiveWeekday, mostActiveMonth, averagePerWeek, longestStreak, currentStreak } =
        analyzeContributions(contributions)

    return {
        followers: state.followers,
        following: state.following,
        publicRepos: state.publicRepos,
        totalStars: state.totalStars,
        topRepo: state.topRepo,
        pullRequestCount: state.pullRequestCount,
        mergedPullRequestCount: state.mergedPullRequestCount,
        topLanguages: state.topLanguages,
        mostActiveWeekday,
        mostActiveMonth,
        averagePerWeek,
        longestStreak,
        currentStreak,
        profile: state.profile,
        isLoading: state.isLoading,
        error: state.error,
    }
}