import icon from '../assets/svg/icon.svg'
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Cafe, Certificate, Home, IbmKnowledgeCatalogPremium, LogoGithub } from '@carbon/icons-react';
import { useUser } from '../hooks/useUser';
import ModalProfile from './ModalProfile';

function Header({ path, subPath }) {

  const { user } = useUser()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const profileBtnRef = useRef(null)
  const profileModalRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 64)
      setIsProfileOpen(false)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isProfileOpen) return

    const onClickOutside = (event) => {
      const clickedButton = profileBtnRef.current?.contains(event.target)
      const clickedModal = profileModalRef.current?.contains(event.target)

      if (!clickedButton && !clickedModal) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isProfileOpen])

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
          <button ref={profileBtnRef} onClick={() => setIsProfileOpen(prev => !prev)}>
            <img src={user?.avatar} />
          </button>
        </div>
      </section>

      <nav>
        <ul>
          <NavLink to='/home'><Home className='icon' size={17} /> Home</NavLink>
          <NavLink to='/snapshot'><Certificate className='icon' size={17} /> Snapshot</NavLink>
          <NavLink to='/news'><Cafe className='icon' size={17} /> News</NavLink>
          <NavLink to={`https://github.com/${user?.username}`} target='_blank'><LogoGithub className='icon' size={17} /> GitHub</NavLink>
          <NavLink to='/resume'><IbmKnowledgeCatalogPremium className='icon' size={17} />My resume</NavLink>
        </ul>
      </nav>

      {isProfileOpen &&
        <div className='modalProfile-main' ref={profileModalRef}>
          <ModalProfile onClose={() => setIsProfileOpen(false)} />
        </div>}
    </header>
  )
}

export default Header;