import icon from '../assets/svg/icon.svg'
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Cafe, Home, IbmKnowledgeCatalogPremium, LogoGithub } from '@carbon/icons-react';

function Header({ path, user }) {

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 64)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header-main ${isScrolled ? 'header-main-scrolled' : ''}`}>
      <section className='header-content'>
        <article className='header-content-left'>
          <Link>
            <img src={icon} />
          </Link>

          <span>
            <p>/</p>
            <h2>{path}</h2>
          </span>
        </article>

        {user && (
          <Link to={`https://github.com/${user}`} className='header-content-right'>
            <h1>{user}</h1>
            <img src="https://avatars.githubusercontent.com/u/182553526?v=4" />
          </Link>
        )}
      </section>

      <nav>
        <ul>
          <NavLink to='/home'><Home size={16} /> Home</NavLink>
          <NavLink to='/contribute'><Cafe size={16} /> Contribute</NavLink>
          <NavLink to='https://github.com/leoosilvp/GitCV' target='_blank'><LogoGithub size={16} /> GitHub</NavLink>
          <NavLink to='/resume'><IbmKnowledgeCatalogPremium size={16} />My resume</NavLink>
        </ul>
      </nav>
    </header>
  )
}

export default Header;
