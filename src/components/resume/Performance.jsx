import { Code, Error, Fire, PullRequest, Star } from "@carbon/icons-react"
import { useGithubStats } from "../../hooks/useGithubStats"

const Performance = ({ username, contributions }) => {

    const {
        averagePerWeek,
        longestStreak,
        currentStreak,
        pullRequestCount,
        mergedPullRequestCount,
        totalStars,
        topRepo,
        isLoading,
        error,
    } = useGithubStats(username, contributions)

    const totalContributions = contributions?.reduce(
        (sum, entry) => sum + (entry.count ?? 0),
        0
    ) ?? 0

    if (error) {
        return (
            <section className="performance-grid">
                <article className="performance-card error">
                    <Error size={30} />
                    <h1>Error</h1>
                    <h2>Statistics not available</h2>
                </article>

                <article className="performance-card error">
                    <Error size={30} />
                    <h1>Error</h1>
                    <h2>Statistics not available</h2>
                </article>

                <article className="performance-card error">
                    <Error size={30} />
                    <h1>Error</h1>
                    <h2>Statistics not available</h2>
                </article>

                <article className="performance-card error">
                    <Error size={30} />
                    <h1>Error</h1>
                    <h2>Statistics not available</h2>
                </article>
            </section>
        )
    }

    return (
        <section className="performance-grid">
            <article className="performance-card">
                <Code className="icon" size={30} />
                <h1>{isLoading ? "—" : totalContributions.toLocaleString("pt-BR")}</h1>
                <h2>Contributions</h2>
                <div>
                    <p>Weekly Average:</p>
                    <p>{isLoading ? "—" : averagePerWeek}</p>
                </div>
            </article>

            <article className="performance-card">
                <Fire className="icon" size={30} />
                <h1>{isLoading ? "—" : currentStreak}</h1>
                <h2>Longest Streak</h2>
                <div>
                    <p>Best:</p>
                    <p>{isLoading ? "—" : `${longestStreak} days`}</p>
                </div>
            </article>

            <article className="performance-card">
                <PullRequest className="icon" size={30} />
                <h1>{isLoading ? "—" : pullRequestCount}</h1>
                <h2>Pull Requests</h2>
                <div>
                    <p>Merged:</p>
                    <p>{isLoading ? "—" : mergedPullRequestCount}</p>
                </div>
            </article>

            <article className="performance-card">
                <Star className="icon" size={30} />
                <h1>{isLoading ? "—" : totalStars}</h1>
                <h2>Stars Earned</h2>
                <div>
                    <p>Top Repo:</p>
                    <p>{isLoading ? "—" : topRepo?.stars}</p>
                </div>
            </article>
        </section>
    )
}

export default Performance