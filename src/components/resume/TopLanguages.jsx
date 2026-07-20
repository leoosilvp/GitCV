import { useGithubStats } from "../../hooks/useGithubStats"

const TopLanguages = ({ username, contributions }) => {
    const { topLanguages, isLoading, error } = useGithubStats(username, contributions)

    if (error) {
        return (
            <section className="toplanguage-grid">
                <article className="toplanguage-language">
                    <h1>Unable to load languages.</h1>
                </article>
            </section>
        )
    }

    if (!isLoading && topLanguages.length === 0) {
        return (
            <section className="toplanguage-grid">
                <article className="toplanguage-language">
                    <h1>No language found.</h1>
                </article>
            </section>
        )
    }

    return (
        <section className="toplanguage-grid">
            {(isLoading ? Array.from({ length: 4 }) : topLanguages).map((entry, index) => (
                <article className="toplanguage-language" key={entry?.language ?? index}>
                    <h1>{isLoading ? "—" : entry.language}</h1>
                    <section className="toplanguage-right">
                        <h1>{isLoading ? "—" : `${entry.percentage}%`}</h1>
                        <div className="toplanguage-line">
                            <div
                                className="toplanguage-filled-line"
                                style={{ width: isLoading ? "0%" : `${entry.percentage * 5}%` }}
                            />
                            <div className="toplanguage-blank-line" />
                        </div>
                    </section>
                </article>
            ))}
        </section>
    )
}

export default TopLanguages