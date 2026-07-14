import { ArrowRight, Fire, HeatMap, PullRequest, Star, Trophy } from '@carbon/icons-react'
import logo from '../../assets/svg/icon.svg'
import { useUser } from '../../hooks/useUser'
import { useGithubContributions } from '../../hooks/useGithubContributions'
import { useGithubStats } from '../../hooks/useGithubStats'

const SnapshotCard3 = () => {
    const { user } = useUser()

    const { contributions, totalCount } = useGithubContributions(user?.username)
    const { currentStreak, longestStreak, pullRequestCount, totalStars, isLoading } = useGithubStats(
        user?.username,
        contributions
    )

    return (
        <article className='snapshot-card three'>
            <header className='snapshot-card-header'>
                <p>over the past year</p>
                <img draggable={false} src={logo} />
            </header>
            <section className='snapshot-card-content'>
                <div className='snapshot-card-grid-column'>
                    <article>
                        <Fire size={33} />
                        <div>
                            <p>Current Streak</p>
                            <h1>{isLoading ? '—' : currentStreak} <span>days</span></h1>
                        </div>
                    </article>

                    <article>
                        <Trophy size={33} />
                        <div>
                            <p>Longest Streak</p>
                            <h1>{isLoading ? '—' : longestStreak} <span>days</span></h1>
                        </div>
                    </article>

                    <article>
                        <HeatMap size={33} />
                        <div>
                            <p>Commits</p>
                            <h1>{isLoading ? '—' : totalCount.toLocaleString('en-US')}</h1>
                        </div>
                    </article>

                    <article>
                        <PullRequest size={33} />
                        <div>
                            <p>Pull Requests</p>
                            <h1>{isLoading ? '—' : pullRequestCount}</h1>
                        </div>
                    </article>

                    <article>
                        <Star size={33} />
                        <div>
                            <p>Stars Earned</p>
                            <h1>{isLoading ? '—' : totalStars}</h1>
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