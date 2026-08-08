import { LogoGithub } from "@carbon/icons-react"
import { useUser } from "../../hooks/useUser"

const SnapshotCardBanner = () => {

    const { user } = useUser()

    return (
        <article className="snapshot-card-banner">
            <section>
                <div>
                    <h1>{user?.name}</h1>
                    <hr />
                    <p><LogoGithub size={16} />{user?.username}</p>
                </div>
            </section>
        </article>
    )
}

export default SnapshotCardBanner
