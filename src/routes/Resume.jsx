import { Location, LogoGithub, LogoLinkedin } from '@carbon/icons-react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import '../css/resume.css'
import { useUser } from '../hooks/useUser'
import { Link } from 'react-router-dom'
import ContributionPanel from '../components/ContributionPanel'
import Performance from '../components/resume/Performance'
import { useGithubContributions } from '../hooks/useGithubContributions'

const Resume = () => {

    const { user } = useUser()

    const username = user?.username || ''

    const { contributions } = useGithubContributions(user?.username)

    return (
        <main className='resume-main'>
            <Header path='Resume' />
            <section className='resume-content'>
                <article className='resume-view'>
                    <header className='resume-header'>
                        <div className='resume-header-info'>
                            <img src={user?.avatar} />
                            <div>
                                <h1>{user?.name}</h1>
                                <h2>Software Engieneer</h2>
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perferendis aperiam in nemo facere, blanditiis reprehenderit fugiat distinctio odit error corporis sunt aliquid earum corrupti. Dolor obcaecati totam eaque labore velit.</p>
                            </div>
                        </div>

                        <div className='resume-header-links'>
                            <Link to={`https://github.com/${user?.username}`}><LogoGithub size={17} />{`github.com/${user?.username}`}</Link>
                            <p>|</p>
                            <Link><LogoLinkedin size={17} />{`linkedin.com/in/leonardo-silva`}</Link>
                            <p>|</p>
                            <Link><Location size={16} />leonardo.dev</Link>
                            <p>|</p>
                            <Link><Location size={16} />São Paulo, SP, Brasil</Link>
                        </div>
                    </header>

                    <div className='resume-divider'>
                        <h1>Contribution Activity (Last 12 months)</h1>
                        <hr />
                    </div>

                    <section className='resume-contributionPanel'>
                        <ContributionPanel isDownload />
                    </section>

                    <div className='resume-divider'>
                        <h1>GitHub Performance (Last 12 months)</h1>
                        <hr />
                    </div>

                    <section className='resume-performance'>
                        <Performance username={username} contributions={contributions} />
                    </section>

                    <div className='resume-divider'>
                        <h1>Top Languages</h1>
                        <hr />
                    </div>
                </article>
            </section>
            <Footer />
        </main>
    )
}

export default Resume
