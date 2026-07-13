import { Calendar, Events, GitRepo, Star } from "@carbon/icons-react"
import { useUser } from "../../hooks/useUser"
import { useGithubContributions } from "../../hooks/useGithubContributions"
import { useGithubStats } from "../../hooks/useGithubStats"

const GithubStats = () => {

    const { user } = useUser()

    const { contributions } = useGithubContributions(user?.username)
    const {
        followers,
        publicRepos,
        totalStars,
        longestStreak,
        isLoading,
        error,
    } = useGithubStats(user?.username, contributions)

    const formatValue = (value) => (isLoading ? "—" : value)

    return (
        <article className="github-stats-main">
            <header className="github-stats-header">
                <h1>GitHub Metrics</h1>
                <p>@{user?.username}</p>
            </header>

            {error ? (
                <p className="github-stats-error">Failed to load GitHub metrics: {error}</p>
            ) : (
                <section className="github-stats-content">
                    <div>
                        <header>
                            <Star size={22} />
                            <p>Stars</p>
                        </header>
                        <section>
                            <h1>{formatValue(totalStars)}</h1>
                        </section>
                    </div>

                    <div>
                        <header>
                            <GitRepo size={22} />
                            <p>Repositories</p>
                        </header>
                        <section>
                            <h1>{formatValue(publicRepos)}</h1>
                        </section>
                    </div>

                    <div>
                        <header>
                            <Events size={22} />
                            <p>Followers</p>
                        </header>
                        <section>
                            <h1>{formatValue(followers)}</h1>
                        </section>
                    </div>

                    <div>
                        <header>
                            <Calendar size={22} />
                            <p>Longest Streak</p>
                        </header>
                        <section>
                            <h1>{formatValue(longestStreak)}</h1>
                        </section>
                    </div>
                </section>
            )}
        </article>
    )
}

export default GithubStats