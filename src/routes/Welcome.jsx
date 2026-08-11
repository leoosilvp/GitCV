import '../css/welcome.css'
import { ArrowRight, Certificate, ChevronDown, Launch } from '@carbon/icons-react'
import Header from '../components/welcome/Header'
import { Link } from 'react-router-dom'

const Welcome = () => {
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

                <section className='welcome-features'>
                    <div>
                        <h1>More than a resume. It's your<br />developer identity.</h1>
                        <p>Your career doesn't live inside a <span>PDF</span>. It lives in what you <span>build</span>, the problems you <span>solve</span>, and the technologies you <span>master</span>. GitCV brings it all together into a <span>dynamic professional identity</span> powered by your GitHub, transforming your activity into a profile that <span>tells your story</span>, showcases your <span>impact</span>, and evolves with you.</p>
                    </div>
                    <section className='welcome-features-grid'>
                        <Link className='welcome-features-card'>
                            <h1>Snapshots</h1>
                            <h2>Download snapshots from your GitHub, share them on social media, and compare your progress with your friends.</h2>

                            <footer>
                                <Certificate size={40} />
                                <Launch size={20} />
                            </footer>
                        </Link>
                    </section>
                </section>

            </section>
        </main>
    )
}

export default Welcome
