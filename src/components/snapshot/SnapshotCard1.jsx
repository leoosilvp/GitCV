import { ArrowRight, Quotes } from '@carbon/icons-react'
import logo from '../../assets/svg/icon.svg'

const SnapshotCard1 = () => {
    return (
        <article className='snapshot-card one'>
            <header className='snapshot-card-header'>
                <p>GitCV</p>
                <img draggable={false} src={logo} />
            </header>
            <section className='snapshot-card-content'>
                <div className='snapshot-card-grid-column'>
                    <h1 className='quotes'><Quotes size={25} /></h1>
                    <p className='text'>Consistency is what <span>transforms</span> average into <span>excellence</span></p>
                    <h1 className='quotes right'><Quotes className='mirror' size={25} /></h1>
                </div>
            </section>
            <footer className='snapshot-card-footer'>
                <p>Keep Shipping!</p>
                <ArrowRight size={15} />
            </footer>
        </article>
    )
}

export default SnapshotCard1
