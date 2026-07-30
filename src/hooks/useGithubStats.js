import { useEffect, useSyncExternalStore } from "react"
import { useUser } from "./useUser"
import { createResourceCache } from "../utils/createResourceCache"

const GITHUB_API_BASE = "https://api.github.com"
const MAX_REPO_PAGES = 10
const REPOS_PER_PAGE = 100
const TOP_LANGUAGES_LIMIT = 4
const TOP_REPOS_LIMIT = 3
const NO_USERNAME_SNAPSHOT = { data: null, isLoading: false, error: null, isStale: false }

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

const EMPTY_LANGUAGES = []
const EMPTY_REPOS = []

function normalizeUrl(url) {
    if (!url) return null
    const trimmed = url.trim()
    if (!trimmed) return null
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function extractSocialLinks(profile, socialAccounts) {
    const accountsByProvider = new Map(
        socialAccounts.map((account) => [account.provider.toLowerCase(), account.url])
    )

    const linkedinUrl = normalizeUrl(accountsByProvider.get("linkedin"))
    const instagramUrl = normalizeUrl(accountsByProvider.get("instagram"))

    const twitterUrl =
        normalizeUrl(accountsByProvider.get("twitter")) ??
        normalizeUrl(accountsByProvider.get("x")) ??
        (profile.twitter_username ? `https://twitter.com/${profile.twitter_username}` : null)

    const genericAccountUrl = normalizeUrl(
        accountsByProvider.get("generic") ?? accountsByProvider.get("website")
    )
    const websiteUrl = genericAccountUrl ?? normalizeUrl(profile.blog)

    return { linkedinUrl, instagramUrl, twitterUrl, websiteUrl }
}

function buildGithubHeaders(accessToken) {
    const headers = { Accept: "application/vnd.github+json" }

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`
    }

    return headers
}

async function fetchProfile(username, accessToken) {
    const response = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
        headers: buildGithubHeaders(accessToken),
    })

    if (!response.ok) {
        throw new Error(`Failed to load GitHub profile (${response.status})`)
    }

    return response.json()
}

async function fetchSocialAccounts(username, accessToken) {
    const response = await fetch(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/social_accounts`,
        { headers: buildGithubHeaders(accessToken) }
    )

    if (!response.ok) return []

    return response.json()
}

async function fetchAllRepos(username, accessToken) {
    const repos = []

    for (let page = 1; page <= MAX_REPO_PAGES; page += 1) {
        const response = await fetch(
            `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=${REPOS_PER_PAGE}&page=${page}&sort=updated`,
            { headers: buildGithubHeaders(accessToken) }
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

async function fetchPullRequestCount(username, accessToken) {
    const response = await fetch(
        `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(`type:pr author:${username}`)}&per_page=1`,
        { headers: buildGithubHeaders(accessToken) }
    )

    if (!response.ok) {
        throw new Error(`Failed to load pull request count (${response.status})`)
    }

    const body = await response.json()
    return body.total_count ?? 0
}

async function fetchMergedPullRequestCount(username, accessToken) {
    const response = await fetch(
        `${GITHUB_API_BASE}/search/issues?q=${encodeURIComponent(`type:pr author:${username} is:merged`)}&per_page=1`,
        { headers: buildGithubHeaders(accessToken) }
    )

    if (!response.ok) {
        throw new Error(`Failed to load merged pull request count (${response.status})`)
    }

    const body = await response.json()
    return body.total_count ?? 0
}

async function fetchRepoLanguages(repo, accessToken) {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${repo.full_name}/languages`, {
        headers: buildGithubHeaders(accessToken),
    })

    if (!response.ok) return {}

    return response.json()
}

async function fetchLanguageBreakdown(repos, accessToken) {
    const sourceRepos = repos.filter((repo) => !repo.fork)

    const perRepoLanguages = await Promise.all(
        sourceRepos.map((repo) => fetchRepoLanguages(repo, accessToken))
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

    const topRepos = [...repos]
        .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
        .slice(0, TOP_REPOS_LIMIT)
        .map((repo) => ({
            name: repo.name,
            language: repo.language,
            description: repo.description,
            stars: repo.stargazers_count ?? 0,
            forks: repo.forks_count ?? 0,
            url: repo.html_url,
        }))

    return { totalStars, topRepo, topRepos }
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

async function fetchGithubStats(username, accessToken) {
    const [profile, repos, pullRequestCount, mergedPullRequestCount, socialAccounts] = await Promise.all([
        fetchProfile(username, accessToken),
        fetchAllRepos(username, accessToken),
        fetchPullRequestCount(username, accessToken),
        fetchMergedPullRequestCount(username, accessToken),
        fetchSocialAccounts(username, accessToken),
    ])

    const { totalStars, topRepo, topRepos } = summarizeRepos(repos)
    const topLanguages = await fetchLanguageBreakdown(repos, accessToken)
    const { linkedinUrl, instagramUrl, twitterUrl, websiteUrl } = extractSocialLinks(profile, socialAccounts)

    return {
        followers: profile.followers ?? 0,
        following: profile.following ?? 0,
        publicRepos: profile.public_repos ?? repos.length,
        totalStars,
        topRepo,
        topRepos,
        pullRequestCount,
        mergedPullRequestCount,
        topLanguages,
        profile: {
            login: profile.login,
            name: profile.name,
            avatarUrl: profile.avatar_url,
            bio: profile.bio,
            url: profile.html_url,
            company: profile.company ?? null,
            location: profile.location ?? null,
            linkedinUrl,
            instagramUrl,
            websiteUrl,
            twitterUrl,
        },
    }
}

const cache = createResourceCache(fetchGithubStats)

export const useGithubStats = (username, contributions) => {
    const { user } = useUser()
    const accessToken = user?.github_access_token

    const snapshot = useSyncExternalStore(
        (listener) => (username ? cache.subscribe(username, listener) : () => { }),
        () => (username ? cache.getSnapshot(username) : NO_USERNAME_SNAPSHOT)
    )

    useEffect(() => {
        if (!username) return
        cache.ensureFresh(username, accessToken)
    }, [username, accessToken])

    const data = snapshot.data
    const { mostActiveWeekday, mostActiveMonth, averagePerWeek, longestStreak, currentStreak } =
        analyzeContributions(contributions)

    return {
        followers: data?.followers ?? 0,
        following: data?.following ?? 0,
        publicRepos: data?.publicRepos ?? 0,
        totalStars: data?.totalStars ?? 0,
        topRepo: data?.topRepo ?? null,
        topRepos: data?.topRepos ?? EMPTY_REPOS,
        pullRequestCount: data?.pullRequestCount ?? 0,
        mergedPullRequestCount: data?.mergedPullRequestCount ?? 0,
        topLanguages: data?.topLanguages ?? EMPTY_LANGUAGES,
        mostActiveWeekday,
        mostActiveMonth,
        averagePerWeek,
        longestStreak,
        currentStreak,
        profile: data?.profile ?? null,
        isLoading: Boolean(username) && snapshot.isLoading,
        error: snapshot.error?.message ?? null,
    }
}