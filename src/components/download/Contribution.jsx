import { Copy, Download, Share } from "@carbon/icons-react"
import { useGithubContributions } from "../../hooks/useGithubContributions"
import { useUser } from "../../hooks/useUser"
import ContributionPanel from "../home/ContributionPanel"

const Contribution = () => {

    const { user } = useUser()

    const { totalCount } = useGithubContributions(user?.username)

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
                <ContributionPanel isDownload />
            </article>
        </main>
    )
}

export default Contribution
