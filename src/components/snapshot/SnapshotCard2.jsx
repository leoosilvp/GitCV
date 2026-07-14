import { ArrowRight, Calendar, CalendarHeatMap, ChartAverage } from '@carbon/icons-react'
import logo from '../../assets/svg/icon.svg'

const SnapshotCard2 = () => {
    return (
        <article className='snapshot-card two right'>
            <header className='snapshot-card-header'>
                <img draggable={false} src={logo} />
                <p>over the past year</p>
            </header>
            <section className='snapshot-card-content'>
                <div className='snapshot-card-title'>
                    <h1>Highlights of <span>@Leoosilvp's</span> activity</h1>
                </div>
                <div className='snapshot-card-grid-column'>
                    <article>
                        <CalendarHeatMap size={33} />
                        <div>
                            <p>Most Active Day</p>
                            <h1>Wednesday</h1>
                        </div>
                    </article>

                    <article>
                        <Calendar size={33} />
                        <div>
                            <p>Most Active Month</p>
                            <h1>June</h1>
                        </div>
                    </article>

                    <article>
                        <ChartAverage size={33} />
                        <div>
                            <p>Average / Week</p>
                            <h1>31 Commits</h1>
                        </div>
                    </article>
                </div>
            </section>
            <footer className='snapshot-card-footer'>
                <p>gitcv.app/snapshot</p>
                <ArrowRight size={15} />
            </footer>
        </article>
    )
}

export default SnapshotCard2
