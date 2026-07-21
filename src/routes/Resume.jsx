import { Download, Location, LogoGithub, LogoInstagram, LogoLinkedin, Wikis } from '@carbon/icons-react'
import { useEffect, useRef } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import '../css/resume.css'
import { useUser } from '../hooks/useUser'
import { Link } from 'react-router-dom'
import ContributionPanel from '../components/ContributionPanel'
import Performance from '../components/resume/Performance'
import { useGithubContributions } from '../hooks/useGithubContributions'
import TopLanguages from '../components/resume/TopLanguages'
import TopProjects from '../components/resume/TopProjects'
import { useGithubStats } from '../hooks/useGithubStats'

const Resume = () => {

    const { user } = useUser()

    const username = user?.username || ''

    const resumeRef = useRef(null)

    function getFirstName() {
        return user?.name.trim().split(/\s+/)[0] || "";
    }

    const { contributions } = useGithubContributions(user?.username)

    const { profile } = useGithubStats(username)

    const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date());

    function handleDownloadPDF() {
        document.body.classList.add('printing-resume')
        window.print()
    }

    useEffect(() => {
        function handleAfterPrint() {
            document.body.classList.remove('printing-resume')
        }

        window.addEventListener('afterprint', handleAfterPrint)

        return () => {
            window.removeEventListener('afterprint', handleAfterPrint)
        }
    }, [])

    return (
        <main className='resume-main'>
            <Header path='Resume' />
            <section className='resume-content'>
                <header className='resume-content-header'>
                    <p>Download your resume as a PDF</p>
                    <button onClick={handleDownloadPDF}><Download size={16} />Download PDF</button>
                </header>
                <article className='resume-view' ref={resumeRef}>
                    <header className='resume-header'>
                        <div className='resume-header-info'>
                            <img src={profile?.avatarUrl} />
                            <div>
                                <h1>{profile?.name}</h1>
                                <h2>{profile?.company}</h2>
                                <p>{profile?.bio}</p>
                            </div>
                        </div>

                        <div className='resume-header-links'>
                            <Link to={`https://github.com/${user?.username}`}><LogoGithub size={17} />github/{getFirstName()}</Link>
                            {profile?.linkedinUrl &&
                                <>
                                    <p>|</p>
                                    <Link to={profile?.linkedinUrl}><LogoLinkedin size={17} />linkedin/{getFirstName()}</Link>
                                </>
                            }
                            {profile?.instagramUrl &&
                                <>
                                    <p>|</p>
                                    <Link to={profile?.instagramUrl}><LogoInstagram size={16} />instagram/{getFirstName()}</Link>
                                </>
                            }
                            {profile?.websiteUrl &&
                                <>
                                    <p>|</p>
                                    <Link to={profile?.websiteUrl}><Wikis size={16} />site/{getFirstName()}</Link>
                                </>
                            }
                            {profile?.location &&
                                <>
                                    <p>|</p>
                                    <Link><Location size={16} />{profile?.location}</Link>
                                </>
                            }
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

                    <section className='resume-toplanguages'>
                        <TopLanguages username={username} />
                    </section>

                    <div className='resume-divider'>
                        <h1>Top Projects</h1>
                        <hr />
                    </div>

                    <section className='resume-top-projects'>
                        <TopProjects username={username} />
                    </section>

                    <footer className='resume-footer'>
                        <p>{formattedDate}</p>
                        <p>Generated by <a href='https://gitcv-app.vercel.app/' target='_blank' >GitCV</a></p>
                    </footer>
                </article>
            </section>
            <Footer />
        </main>
    )
}

export default Resume