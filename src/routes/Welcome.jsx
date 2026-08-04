import { ArrowRight, ChevronDown } from '@carbon/icons-react'
import Header from '../components/welcome/Header'
import '../css/welcome.css'
import { Link } from 'react-router-dom'

const Welcome = () => {
    return (
        <main className='welcome-main'>
            <Header />
            <section className='welcome-presentation'>
                <div className='welcome-presentation-left'>
                    <h1>Turn your GitHub<br/>into a professional resume.</h1>
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
        </main>
    )
}

export default Welcome
