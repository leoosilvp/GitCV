import { Cafe, Certificate, HeatMap_03, Home, IbmKnowledgeCatalogPremium, LogoGithub, Logout, Star } from "@carbon/icons-react"
import { useUser } from "../hooks/useUser"
import { Link } from "react-router-dom"
import { logout } from "../services/auth.service"

const ModalProfile = () => {

    const { user } = useUser()

    return (
        <article className="modalProfile-modal">
            <p>{user?.email}</p>
            <hr />
            <nav>
                <Link to='/home'><Home className='icon' size={16} />Home</Link>
                <Link to='/download/snapshots'><Certificate className='icon' size={16} />Snapshot</Link>
                <Link to='/news'><Cafe className='icon' size={16} />News</Link>
                <Link to='/download/contributions'><HeatMap_03 className='icon' size={16} />Contributions</Link>
                <Link to='/resume'><IbmKnowledgeCatalogPremium className='icon' size={16} />Resume</Link>
                <hr />
                <Link to={`https://github.com/${user?.username}`} target="_blank"><LogoGithub className='icon' size={16} />My GitHub</Link>
                <Link to='https://github.com/leoosilvp/GitCV' target="_blank"><Star className='icon' size={16} />Star this project</Link>
                <hr />
                <Link onClick={() => logout()}><Logout size={16} />LogOut</Link>
            </nav>
        </article>
    )
}

export default ModalProfile
