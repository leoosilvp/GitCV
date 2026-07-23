import icon from '../assets/svg/icon.svg'
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Cafe, Certificate, HeatMap_03, Home, IbmKnowledgeCatalogPremium, LogoGithub, Search } from '@carbon/icons-react';
import { useUser } from '../hooks/useUser';
import ModalProfile from './ModalProfile';
import ModalSearch from './ModalSearch';

function Header({ path, subPath }) {

  const { user } = useUser()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const profileBtnRef = useRef(null)
  const profileModalRef = useRef(null)
  const searchBtnRef = useRef(null)

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
          <div className='header-btn-search' ref={searchBtnRef} onClick={() => setIsSearchOpen(true)}>
            <Search className='icon' size={16} />
            <p>Type <span>/</span> to search</p>
          </div>
          <button ref={profileBtnRef} onClick={() => setIsProfileOpen(prev => !prev)}>
            <img src={user?.avatar} />
          </button>
        </div>
      </section>

      <nav>
        <ul>
          <NavLink to='/home'><Home className='icon' size={17} /> Home</NavLink>
          <NavLink to='/download/snapshot'><Certificate className='icon' size={17} /> Snapshot</NavLink>
          <NavLink to='/news'><Cafe className='icon' size={17} /> News</NavLink>
          <NavLink to='/download/contributions'><HeatMap_03 className='icon' size={17} />Contributions</NavLink>
          <NavLink to='/resume'><IbmKnowledgeCatalogPremium className='icon' size={17} />My resume</NavLink>
          <NavLink to={`https://github.com/${user?.username}`} target='_blank'><LogoGithub className='icon' size={17} /> GitHub</NavLink>
        </ul>
      </nav>

      {isProfileOpen &&
        <div className='modalProfile-main' ref={profileModalRef}>
          <ModalProfile onClose={() => setIsProfileOpen(false)} />
        </div>
      }
      <ModalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        triggerRef={searchBtnRef}
      />
    </header>
  )
}

export default Header;