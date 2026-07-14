import '../css/snapshot.css'
import Footer from "../components/Footer"
import Header from "../components/Header"

const Snapshot = () => {
  return (
    <main className="snapshot-main">
      <Header path='Snapshot' />
      <section className="snapshot-content">
        <header className='snapshot-header'>
          <h1>Build. Share. Inspire.</h1>
          <p>Showcase your developer journey through beautifully designed, shareable cards.</p>
        </header>

        <section className='snashot-grid'>
          <div className='snashot-card' />
          <div className='snashot-card right' />
          <div className='snashot-card left' />
          <div className='snashot-card' />
          <div className='snashot-card left' />
        </section>
      </section>
      <Footer />
    </main>
  )
}

export default Snapshot
