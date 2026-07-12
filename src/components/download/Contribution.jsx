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

            <section className="download-contribution-themes">
                <h1>Themes</h1>
                <div className="download-contribution-themes-grid">
                    <button>
                        <div>
                            <span style={{background: '#033a15'}} />
                            <span style={{background: '#196c2e'}} />
                            <span style={{background: '#2da043'}} />
                            <span style={{background: '#56d364'}} />
                        </div>
                        GitHub Dark
                    </button>

                    <button>
                        <div>
                            <span style={{background: '#333333'}} />
                            <span style={{background: '#555555'}} />
                            <span style={{background: '#777777'}} />
                            <span style={{background: '#bbbbbb'}} />
                        </div>
                        Carbon
                    </button>

                    <button>
                        <div>
                            <span style={{background: '#45475a'}} />
                            <span style={{background: '#6272a4'}} />
                            <span style={{background: '#be93f9'}} />
                            <span style={{background: '#ff79c6'}} />
                        </div>
                        Dracula
                    </button>

                    <button>
                        <div>
                            <span style={{background: '#3B0D13'}} />
                            <span style={{background: '#7F1D1D'}} />
                            <span style={{background: '#B91C1C'}} />
                            <span style={{background: '#EF4444'}} />
                        </div>
                        Crimson
                    </button>

                    <button>
                        <div>
                            <span style={{background: '#e48bdc'}} />
                            <span style={{background: '#ca5bcc'}} />
                            <span style={{background: '#a74aa8'}} />
                            <span style={{background: '#61185f'}} />
                        </div>
                        Pink
                    </button>

                    <button>
                        <div>
                            <span style={{background: '#33353b'}} />
                            <span style={{background: '#6fc1ff'}} />
                            <span style={{background: '#1af9d8'}} />
                            <span style={{background: '#ff4b82'}} />
                        </div>
                        Panda
                    </button>

                    <button>
                        <div>
                            <span style={{background: '#263342'}} />
                            <span style={{background: '#344e6c'}} />
                            <span style={{background: '#416895'}} />
                            <span style={{background: '#4f83bf'}} />
                        </div>
                        Blue
                    </button>
                </div>
            </section>
        </main>
    )
}

export default Contribution
