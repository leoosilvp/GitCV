import '../css/home.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser } from '../hooks/useUser';
import ContributionPanel from '../components/ContributionPanel';
import { useGithubContributions } from '../hooks/useGithubContributions';
import GithubStats from '../components/home/GithubStats';
import News from '../components/home/News';
import iconMono from '../assets/svg/icon-mono.svg'
import TopLanguages from '../components/resume/TopLanguages';
import TrendingRepos from '../components/home/TrendingRepos';

const Home = () => {

    const { user } = useUser()

    const username = user?.username

    const { contributions } = useGithubContributions(username)

    const FirstName = () => {
        return user?.name?.trim().split(/\s+/).filter(Boolean)[0] || ''
    }

    const totalContributions = contributions?.reduce(
        (sum, entry) => sum + (entry.count ?? 0),
        0
    ) ?? 0

    function getTimeOfDay() {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return "Morning";
        }

        if (hour >= 12 && hour < 18) {
            return "Afternoon";
        }

        return "Evening";
    }

    return (
        <main className='home-main'>
            <Header path={'Home'} />
            <div className="home-content">
                <section className='home-welcome'>
                    <h1>Good {getTimeOfDay()}, {FirstName()}!</h1>
                    <p>You made {totalContributions} contributions over the past year.</p>
                    <ContributionPanel isDownload />
                </section>

                <div className='hr' />

                <GithubStats />

                <section className='home-topLanguages'>
                    <TopLanguages username={username} />
                </section>

                <div className='hr' />

                <TrendingRepos />

                <div className='hr' />

                <News />

                <footer className='home-footer'>
                    <img draggable={false} src={iconMono} />
                    <p>Every contribution tells a story.<br /> Keep building yours.</p>
                </footer>
            </div>
            <Footer />
        </main>
    )
}

export default Home
