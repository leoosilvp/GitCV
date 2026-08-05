import SnapshotCard1 from '../snapshot/SnapshotCard1'
import SnapshotCard2 from '../snapshot/SnapshotCard2'
import SnapshotCard3 from '../snapshot/SnapshotCard3'
import SnapshotCard4 from '../snapshot/SnapshotCard4'

const Snapshot = () => {
  return (
    <main className="snapshot-main">
      <header className='snapshot-header'>
        <h1>Build. Share. Inspire.</h1>
        <p>Transform your GitHub activity into snapshots that tell your story.</p>
      </header>

      <section className='snapshot-grid-main'>
        <div className='snapshot-grid'>
          <SnapshotCard1 />
          <SnapshotCard2 />
          <SnapshotCard3 />
        </div>
        <SnapshotCard4 />
      </section>
    </main>
  )
}

export default Snapshot
