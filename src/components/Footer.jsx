import icon from '../assets/svg/icon.svg'
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const Footer = () => {

    const { user } = useUser()

    return (
        <footer className='footer-main'>
            <section className="footer-nav">
                <Link to='/'>
                    <img src={icon} />
                </Link>
                <nav>
                    <ul>
                        <Link to='/home'>Home</Link>
                        <Link to='/snapshot'>Snapshot</Link>
                        <Link to='/contribute'>Contribute</Link>
                        <Link to={`https://github.com/${user?.username}`} target='_blank'>Github</Link>
                        <Link to='/resume'>My resume</Link>
                    </ul>
                </nav>
            </section>

            <section className='footer-credits'>
                <p>GitCV&copy; 2026 - All rights reserved. <Link to="https://github.com/leoosilvp">"leoosilvp"</Link></p>
            </section>
        </footer>
    )
}

export default Footer
