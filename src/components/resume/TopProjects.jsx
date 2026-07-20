import { Fork, Star } from "@carbon/icons-react"
import { Link } from "react-router-dom"
import { useGithubStats } from "../../hooks/useGithubStats"

function truncateDescription(description) {
    if (!description) return "No description provided."
    if (description.length <= 135) return description
    return `${description.slice(0, 135).trimEnd()}...`
}

const LANGUAGE_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Java: "#b07219",
    Shell: "#89e051",
    Go: "#00ADD8",
}

const TopProjects = ({ username }) => {
    const { topRepos, isLoading } = useGithubStats(username)

    if (isLoading) {
        return (
            <section className="top-projects-grid">
                <p>Loading top repositories...</p>
            </section>
        )
    }

    if (!topRepos.length) {
        return (
            <section className="top-projects-grid">
                <p>No public repositories found.</p>
            </section>
        )
    }

    return (
        <section className="top-projects-grid">
            {topRepos.map((repo, index) => (
                <div key={repo.name}>
                    <Link
                        className="top-projects-card"
                        to={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <section className="top-projects-card-left">
                            <div className="top-projects-card-img">
                                {repo.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1>{repo.name}</h1>
                                {repo.language && (
                                    <p>
                                        <span style={{ background: LANGUAGE_COLORS[repo.language] }} />
                                        {repo.language}
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="top-projects-card-center">
                            <p>{truncateDescription(repo.description)}</p>
                        </section>

                        <section className="top-projects-card-right">
                            <div>
                                <Star size={20} />
                                <h1>{repo.stars}</h1>
                            </div>

                            <div>
                                <Fork size={20} />
                                <h1>{repo.forks}</h1>
                            </div>
                        </section>
                    </Link>

                    {index < topRepos.length - 1 && <hr />}
                </div>
            ))}
        </section>
    )
}

export default TopProjects