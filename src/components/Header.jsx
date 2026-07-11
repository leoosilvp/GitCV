import icon from '../assets/svg/icon.svg'
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Cafe, Home, IbmKnowledgeCatalogPremium, LogoGithub } from '@carbon/icons-react';
import { useUser } from '../hooks/useUser';

function Header({ path, subPath }) {

  const { user } = useUser()

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
          <Link to='/'>
            <img src={icon} />
          </Link>

          <div>
            <p>/</p>
            <h2>{path}</h2>

            {subPath &&
              <>
                <p>/</p>
                <h2>{subPath}</h2>
              </>}
          </div>
        </article>

        <div className='header-content-right'>
          <img src={user?.avatar} />
        </div>
      </section>

      <nav>
        <ul>
          <NavLink to='/home'><Home className='icon' size={17} /> Home</NavLink>
          <NavLink to='/contribute'><Cafe className='icon' size={17} /> Contribute</NavLink>
          <NavLink to={`https://github.com/${user?.username}`} target='_blank'><LogoGithub className='icon' size={17} /> GitHub</NavLink>
          <NavLink to='/resume'><IbmKnowledgeCatalogPremium className='icon' size={17} />My resume</NavLink>
        </ul>
      </nav>
    </header>
  )
}

export default Header;
