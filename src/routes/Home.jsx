import '../css/home.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser } from '../hooks/useUser';
import ContributionPanel from '../components/home/ContributionPanel';
import { useGithubContributions } from '../hooks/useGithubContributions';

const Home = () => {

    const { user } = useUser()

    const username = user?.username

    const FirstName = () => {
        return user?.name?.trim().split(/\s+/).filter(Boolean)[0] || ''
    }

    const { totalCount } = useGithubContributions(username)

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
                    <p>You made {totalCount.toLocaleString("en-US")} contributions over the past year.</p>
                    <ContributionPanel />
                </section>

            </div>
            <Footer />
        </main>
    )
}

export default Home
