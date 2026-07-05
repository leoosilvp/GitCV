import icon from '../assets/svg/icon.svg'
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='footer-main'>
            <section className="footer-nav">
                <img src={icon} />
                <nav>
                    <ul>
                        <Link to='/home'>Home</Link>
                        <Link to='/contribute'>Contribute</Link>
                        <Link to='https://github.com/leoosilvp/CVHub'>Github</Link>
                        <Link to='/resume'>My resume</Link>
                    </ul>
                </nav>
            </section>

            <section className='footer-credits'>
                <p>GitCV&copy; 2026 - All rights reserved. <a href="https://github.com/leoosilvp">"leoosilvp"</a></p>
            </section>
        </footer>
    )
}

export default Footer
