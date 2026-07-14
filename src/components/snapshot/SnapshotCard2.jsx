import { ArrowRight, Calendar, CalendarHeatMap, ChartAverage } from '@carbon/icons-react'
import logo from '../../assets/svg/icon.svg'
import { useUser } from '../../hooks/useUser'
import { useGithubContributions } from '../../hooks/useGithubContributions'
import { useGithubStats } from '../../hooks/useGithubStats'

const SnapshotCard2 = () => {
    const { user } = useUser()

    const { contributions } = useGithubContributions(user?.username)
    const { mostActiveWeekday, mostActiveMonth, averagePerWeek, isLoading } = useGithubStats(
        user?.username,
        contributions
    )

    return (
        <article className='snapshot-card two right'>
            <header className='snapshot-card-header'>
                <img draggable={false} src={logo} />
                <p>over the past year</p>
            </header>
            <section className='snapshot-card-content'>
                <div className='snapshot-card-title'>
                    <h1>Highlights of <span>@{user?.username}'s</span> activity</h1>
                </div>
                <div className='snapshot-card-grid-column'>
                    <article>
                        <CalendarHeatMap size={33} />
                        <div>
                            <p>Most Active Day</p>
                            <h1>{isLoading ? '—' : mostActiveWeekday?.label ?? '—'}</h1>
                        </div>
                    </article>

                    <article>
                        <Calendar size={33} />
                        <div>
                            <p>Most Active Month</p>
                            <h1>{isLoading ? '—' : mostActiveMonth?.label ?? '—'}</h1>
                        </div>
                    </article>

                    <article>
                        <ChartAverage size={33} />
                        <div>
                            <p>Average / Week</p>
                            <h1>{isLoading ? '—' : `${averagePerWeek} Commits`}</h1>
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