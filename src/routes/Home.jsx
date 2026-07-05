import '../css/home.css'
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <main className='home-main'>
            <Header path={'Home'} />
            <div className="home-content">
                <section className='home-welcome'>
                    <h1>Welcome!!!</h1>
                </section>
            </div>
            <Footer />
        </main>
    )
}

export default Home
