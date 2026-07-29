import { Cafe, Certificate, HeatMap_03, Home, IbmKnowledgeCatalogPremium, LogoGithub, Logout, Settings } from "@carbon/icons-react"
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
                <Link to='/snapshot'><Certificate className='icon' size={16} />Snapshot</Link>
                <Link to='/news'><Cafe className='icon' size={16} />News</Link>
                <Link to='/download/contributions'><HeatMap_03 className='icon' size={16} />Contributions</Link>
                <Link to='/resume'><IbmKnowledgeCatalogPremium className='icon' size={16} />My Resume</Link>
                <hr />
                <Link to='/settings'><Settings className='icon' size={16} />Settings</Link>
                <Link to={`https://github.com/${user?.username}`} target="_blank"><LogoGithub className='icon' size={16} />GitHub</Link>
                <hr />
                <Link onClick={()=>logout()}><Logout size={16} />LogOut</Link>
            </nav>
        </article>
    )
}

export default ModalProfile
