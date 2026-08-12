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
                    <nav>
                        <h1>Navigate</h1>
                        <ul>
                            <Link>Home</Link>
                            <Link>Login</Link>
                            <Link>Register</Link>
                            <Link>About</Link>
                            <Link>Features</Link>
                            <Link>Support</Link>
                        </ul>
                    </nav>

                    <nav>
                        <h1>Navigate</h1>
                        <ul>
                            <Link></Link>
                            <Link></Link>
                            <Link></Link>
                            <Link></Link>
                            <Link></Link>
                            <Link></Link>
                        </ul>
                    </nav>

                    <nav>
                        <h1>Navigate</h1>
                        <ul>
                            <Link></Link>
                            <Link></Link>
                            <Link></Link>
                            <Link></Link>
                            <Link></Link>
                            <Link></Link>
                        </ul>
                    </nav>
                </section>
            </div>
        </footer>
    )
}

export default Footer
