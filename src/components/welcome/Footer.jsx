import logo from '../../assets/svg/logo1-light.svg'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="welcome-footer">
            <div className='welcome-footer-content'>
                <section className="welcome-footer-left">
                    <img src={logo} />
                    <p>&copy;2026 - All rights reserved</p>
                </section>
                <section className='welcome-footer-right'>
                    <div>
                        <nav>
                            <h1>Navigate</h1>
                            <ul>
                                <Link to='/home'>Home</Link>
                                <Link to='/login'>Login</Link>
                                <Link to='#about'>About</Link>
                                <Link to='#support'>Support</Link>
                            </ul>
                        </nav>

                        <nav>
                            <h1>GitCV</h1>
                            <ul>
                                <Link>GitHub</Link>
                                <Link to='/contribute'>Contribute</Link>
                                <Link to='#about'>About</Link>
                            </ul>
                        </nav>

                        <nav />
                    </div>

                    <hr />

                    <div>
                        <nav>
                            <ul>
                                <Link to=''>Talk to GitCV</Link>
                                <Link to=''>Privacy</Link>
                            </ul>
                        </nav>

                        <nav>
                            <ul>
                                <Link to=''>Terms of Use</Link>
                                <Link to=''>Accessibility</Link>
                            </ul>
                        </nav>

                        <nav>
                            <ul>
                                <Link to=''>Cookie Preferences</Link>
                            </ul>
                        </nav>
                    </div>
                </section>
            </div>
        </footer>
    )
}

export default Footer
