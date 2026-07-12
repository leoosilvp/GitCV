import { useState } from "react"
import { Copy, Download, Share } from "@carbon/icons-react"
import { useGithubContributions } from "../../hooks/useGithubContributions"
import { useUser } from "../../hooks/useUser"
import ContributionPanel from "../home/ContributionPanel"
import { CONTRIBUTION_THEMES, CONTRIBUTION_THEME_ORDER, DEFAULT_CONTRIBUTION_THEME } from "../../utils/contributionThemes"

const Contribution = () => {
    const { user } = useUser()
    const { totalCount } = useGithubContributions(user?.username)

    const [selectedTheme, setSelectedTheme] = useState(DEFAULT_CONTRIBUTION_THEME)

    return (
        <main className="download-contribution-main">
            <header className="download-contribution-main-header">
                <div>
                    <button><Copy size={16} />Copy</button>
                    <button><Share size={16} />Share</button>
                </div>
                <button className="active"><Download size={16} />Download</button>
            </header>
            <article className="download-contribution-card">
                <header className="download-contribution-card-header">
                    <div>
                        <h1>@{user?.username} on GitHub</h1>
                        <p>Total Contributions: {totalCount}</p>
                    </div>
                    <h2>over the past year</h2>
                </header>
                <ContributionPanel isDownload theme={selectedTheme} />
            </article>

            <section className="download-contribution-themes">
                <h1>Themes</h1>
                <div className="download-contribution-themes-grid">
                    {CONTRIBUTION_THEME_ORDER.map((themeKey) => {
                        const { label, colors } = CONTRIBUTION_THEMES[themeKey]

                        return (
                            <button
                                key={themeKey}
                                className={themeKey === selectedTheme ? "active" : ""}
                                onClick={() => setSelectedTheme(themeKey)}
                            >
                                <div>
                                    {colors.slice(1).map((color, index) => (
                                        <span key={index} style={{ background: color }} />
                                    ))}
                                </div>
                                {label}
                            </button>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}

export default Contribution