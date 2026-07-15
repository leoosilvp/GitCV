import { CalendarHeatMap, ChartAverage, Fire, Star, Trophy } from "@carbon/icons-react"
import { useUser } from "../../hooks/useUser"
import { useGithubContributions } from "../../hooks/useGithubContributions"
import { useGithubStats } from "../../hooks/useGithubStats.js"

const GithubStats = () => {

    const { user } = useUser()

    const { contributions } = useGithubContributions(user?.username)
    const {
        totalStars,
        longestStreak,
        mostActiveWeekday,
        averagePerWeek,
        currentStreak,
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
                            <Star size={25} />
                            <p>Stars</p>
                        </header>
                        <section>
                            <h1>{formatValue(totalStars) || '—'}</h1>
                        </section>
                    </div>

                    <div>
                        <header>
                            <ChartAverage size={25} />
                            <p>Average / Week</p>
                        </header>
                        <section>
                            <h1>{formatValue(averagePerWeek) || '—'} {averagePerWeek ? <span>Commits</span> : ''}</h1>
                        </section>
                    </div>

                    <div>
                        <header>
                            <Fire size={25} />
                            <p>Current Streak</p>
                        </header>
                        <section>
                            <h1>{formatValue(currentStreak) || '—'}</h1>
                        </section>
                    </div>

                    <div>
                        <header>
                            <CalendarHeatMap size={25} />
                            <p>Most Active Day</p>
                        </header>
                        <section>
                            <h1>{formatValue(mostActiveWeekday?.label ?? "—")}</h1>
                        </section>
                    </div>

                    <div>
                        <header>
                            <Trophy size={25} />
                            <p>Longest Streak</p>
                        </header>
                        <section>
                            <h1>{formatValue(longestStreak) || '—'}</h1>
                        </section>
                    </div>
                </section>
            )}
        </article>
    )
}

export default GithubStats