import { Location, LogoGithub } from "@carbon/icons-react"
import { useGithubStats } from "../../hooks/useGithubStats"
import { useUser } from "../../hooks/useUser"
import ContributionPanel from "../ContributionPanel"
import { Link } from "react-router-dom"

const SnapshotCard4 = () => {

    const { user } = useUser()

    const username = user?.username || ''

    const { profile } = useGithubStats(username)

    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date());

    return (
        <article className='snapshot-card-horizontal'>
            <header className='snapshot-card-horizontal-header'>
                <div className="snapshot-card-horizontal-header-content">
                    <img src={profile?.avatarUrl} />
                    <div>
                        <h1>{profile?.name}</h1>
                        <h2>{profile?.company}</h2>
                        <p>{profile?.bio}</p>
                    </div>
                </div>
                <div className='snapshot-card-horizontal-header-links'>
                    <Link><LogoGithub size={17} />github/{username}</Link>
                    {profile?.location &&
                        <>
                            <p>|</p>
                            <Link><Location size={16} />{profile?.location}</Link>
                        </>
                    }
                </div>
            </header>
            <ContributionPanel isDownload />
            <footer className='snapshot-card-horizontal-footer'>
                <p>{formattedDate}</p>
            </footer>
        </article>
    )
}

export default SnapshotCard4
