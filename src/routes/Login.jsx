import '../css/login.css'
import { Checkmark, LogoGithub } from '@carbon/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useUser } from '../hooks/useUser'
import logo from '../assets/svg/logo-dark.svg'
import gitcvGithub from '../assets/img/gitcv-github.png'

const Login = () => {

    const { user } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) navigate('/home', { replace: true })
    }, [user, navigate])

    return (
        <main className="login-main">
            <header className='login-header'>
                <img draggable={false} src={logo} />
            </header>
            <section className='login-wrapper'>
                <img draggable={false} src={gitcvGithub} />
                <h1>Build your developer resume</h1>
                <p>Transform your GitHub profile into a professional resume in minutes.</p>
                <div>
                    <p><Checkmark size={16} />Free to get started</p>
                    <p><Checkmark size={16} />Professional resume templates</p>
                    <p><Checkmark size={16} />ATS-friendly PDF export</p>
                    <p><Checkmark size={16} />Secure authentication</p>
                </div>
                <span>Powered by GitHub OAuth</span>
                <button onClick={() => window.location.href = 'https://api-gitcv-app.vercel.app/api/auth/github'}>
                    <LogoGithub size={21} />
                    Continue With GitHub
                </button>
                <hr />
                <footer>
                    <Link>Terms of Service</Link>
                    <Link>Privacy Policy</Link>
                    <Link>&copy; 2026 GitCV</Link>
                </footer>
            </section>
        </main>
    )
}

export default Login
