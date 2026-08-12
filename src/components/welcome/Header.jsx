import { ChevronDown, Launch, User } from '@carbon/icons-react'
import logo from '../../assets/svg/logo-text.svg'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className="welcome-header">
            <div className='welcome-header-content'>
                <section>
                    <Link to=''>
                        <img src={logo} />
                    </Link>
                    <div />
                    <nav>
                        <Link to=''>Home</Link>
                        <a href='#about'>About</a>
                        <a href='#features'>Features <ChevronDown size={20} /></a>
                        <a href='#support'>Support</a>
                        <Link to='https://github.com/' target='_blank' >GitHub <Launch size={20} /></Link>
                    </nav>
                </section>

                <div>
                    <Link to='/login#register'>Register</Link>
                    <Link to='/login' className='active'><User size={20} /></Link>
                </div>
            </div>
        </header>
    )
}

export default Header
