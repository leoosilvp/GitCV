import '../css/welcome.css'
import { ArrowRight, Certificate, ChevronDown, HeatMap_03, IbmKnowledgeCatalogPremium, Launch } from '@carbon/icons-react'
import Header from '../components/welcome/Header'
import { Link } from 'react-router-dom'
import ContributionPanel from '../components/ContributionPanel'
import { useGithubContributions } from '../hooks/useGithubContributions'
import Footer from '../components/welcome/Footer'

const Welcome = () => {

    const { contributions } = useGithubContributions('leoosilvp')

    const totalContributions = contributions?.reduce(
        (sum, entry) => sum + (entry.count ?? 0),
        0
    ) ?? 0

    return (
        <main className='welcome-main'>
            <Header />
            <section className='welcome-content'>
                <section className='welcome-presentation'>
                    <div className='welcome-presentation-left'>
                        <h1>Turn your GitHub<br />into a professional resume.</h1>
                        <p>Connect your GitHub account and turn your activity into a polished, professional showcase. Generate modern resumes, explore other developers' profiles, download your contribution dashboard, and share social-media-ready snapshots featuring highlights like contribution streaks, top languages, statistics, and much more.</p>
                        <section>
                            <Link to='/login' className='active'>Connect my GitHub<ArrowRight size={18} /></Link>
                            <Link>Explore the platform<ChevronDown size={18} /></Link>
                        </section>
                    </div>
                    <div className='welcome-presentation-right'>
                        <img draggable={false} src="https://user-images.githubusercontent.com/74038190/212257468-1e9a91f1-b626-4baa-b15d-5c385dfa7ed2.gif" />
                    </div>
                </section>

                <section className='welcome-contributionPanel'>
                    <article className='download-contribution-card'>
                        <header className="download-contribution-card-header">
                            <div>
                                <h1>@torvalds on GitHub</h1>
                                <p>Total Contributions: {totalContributions}</p>
                            </div>
                            <h2>over the past year</h2>
                        </header>
                        <ContributionPanel username='torvalds' isWelcome />
                    </article>
                </section>

                <section id='features' className='welcome-features'>
                    <div>
                        <h1>More than a resume. It's your<br />developer identity.</h1>
                        <p>Your career doesn't live inside a <span>PDF</span>. It lives in what you <span>build</span>, the problems you <span>solve</span>, and the technologies you <span>master</span>. GitCV brings it all together into a <span>dynamic professional identity</span> powered by your GitHub, transforming your activity into a profile that <span>tells your story</span>, showcases your <span>impact</span>, and evolves with you.</p>
                    </div>
                    <section className='welcome-features-grid'>
                        <Link to='/download/snapshots' className='welcome-features-card'>
                            <h1>Git Snapshots</h1>
                            <h2>Download snapshots from your GitHub, share them on social media, and compare your progress with your friends.</h2>

                            <footer>
                                <Certificate className='icon' size={40} />
                                <Launch className='icon' color='#57bf4f' size={20} />
                            </footer>
                        </Link>

                        <Link to='/download/contributions' className='welcome-features-card'>
                            <h1>Git Contributions</h1>
                            <h2>Download your contribution graph, customize the theme, and share your progress.</h2>

                            <footer>
                                <HeatMap_03 className='icon' size={40} />
                                <Launch className='icon' color='#57bf4f' size={20} />
                            </footer>
                        </Link>

                        <Link to='/resume' className='welcome-features-card'>
                            <h1>Git Résumé</h1>
                            <h2>Download your PDF résumé featuring your key metrics, most used languages, top 3 projects, and GitHub highlights.</h2>

                            <footer>
                                <IbmKnowledgeCatalogPremium className='icon' size={40} />
                                <Launch className='icon' color='#57bf4f' size={20} />
                            </footer>
                        </Link>
                    </section>
                </section>

                <section className='welcome-recruiters'>
                    <div>
                        <h1>Built for developers. Useful for recruiters.</h1>
                    </div>

                    <section className='welcome-recruiters-grid'>
                        <article className='welcome-recruiters-card'>
                            <h1>Technical profile</h1>
                            <p>Check out technologies, languages, and projects.</p>
                        </article>

                        <article className='welcome-recruiters-card'>
                            <h1>Real activity</h1>
                            <p>Understand the developer's consistency and evolution.</p>
                        </article>

                        <article className='welcome-recruiters-card'>
                            <h1>Projects</h1>
                            <p>Explore what was actually built.</p>
                        </article>

                        <article className='welcome-recruiters-card'>
                            <h1>Résumé</h1>
                            <p>Access structured professional information.</p>
                        </article>
                    </section>
                </section>

            </section>
            <Footer />
        </main>
    )
}

export default Welcome
