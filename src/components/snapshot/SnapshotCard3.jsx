import { ArrowRight, Fire, HeatMap, PullRequest, Star, Trophy } from '@carbon/icons-react'
import logo from '../../assets/svg/icon.svg'

const SnapshotCard3 = () => {
    return (
        <article className='snapshot-card three left'>
            <header className='snapshot-card-header'>
                <img draggable={false} src={logo} />
                <p>over the past year</p>
            </header>
            <section className='snapshot-card-content'>
                <div className='snapshot-card-grid-column'>
                    <article>
                        <Fire size={33} />
                        <div>
                            <p>Current Streak</p>
                            <h1>18 <span>days</span></h1>
                        </div>
                    </article>

                    <article>
                        <Trophy size={33} />
                        <div>
                            <p>Longest Streak</p>
                            <h1>42 <span>days</span></h1>
                        </div>
                    </article>

                    <article>
                        <HeatMap size={33} />
                        <div>
                            <p>Commits</p>
                            <h1>1.412</h1>
                        </div>
                    </article>

                    <article>
                        <PullRequest size={33} />
                        <div>
                            <p>Pull Requests</p>
                            <h1>87</h1>
                        </div>
                    </article>

                    <article>
                        <Star size={33} />
                        <div>
                            <p>Stars Erned</p>
                            <h1>31</h1>
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

export default SnapshotCard3
