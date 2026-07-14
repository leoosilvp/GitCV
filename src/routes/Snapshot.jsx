import '../css/snapshot.css'
import Footer from "../components/Footer"
import Header from "../components/Header"
import SnapshotCard1 from '../components/snapshot/SnapshotCard1'
import SnapshotCard2 from '../components/snapshot/SnapshotCard2'

const Snapshot = () => {
  return (
    <main className="snapshot-main">
      <Header path='Snapshot' />
      <section className="snapshot-content">
        <header className='snapshot-header'>
          <h1>Build. Share. Inspire.</h1>
          <p>Showcase your developer journey through beautifully designed, shareable cards.</p>
        </header>

        <section className='snapshot-grid'>
          <SnapshotCard1 />
          <SnapshotCard2 />
          <div className='snapshot-card three left' />
          <div className='snapshot-card four' />
          <div className='snapshot-card left' />
        </section>
      </section>
      <Footer />
    </main>
  )
}

export default Snapshot
