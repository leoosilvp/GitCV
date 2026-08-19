import { Fork, Launch, License, LogoGithub, Star } from '@carbon/icons-react'
import { Link } from 'react-router-dom'
import { useGithubTrending } from '../../hooks/useGithubTrending'
import { languageColors } from '../../utils/languageColors'

const FALLBACK_LANGUAGE_COLOR = '#8a8a8a'

function formatCount(value) {
    if (typeof value !== 'number') return '0'
    return new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

const TrendingRepos = () => {
    const { repositories, isLoading, error, refresh } = useGithubTrending()

    return (
        <section className="home-trendingRepos">
            <header className='home-trendingRepos-header'>
                <div>
                    <h1>Trending Repository</h1>
                    <p>Projects gaining traction.</p>
                </div>
                <Link to='https://github.com' target='_blank'><LogoGithub size={20} /></Link>
            </header>

            {error && (
                <div className='home-trendingRepos-error'>
                    <p>Unable to load trending repositories.</p>
                    <button type='button' onClick={refresh}>Try again</button>
                </div>
            )}

            {isLoading && !error && (
                <div className='home-trendingRepos-loading'>
                    <p>Loading trending repositories...</p>
                </div>
            )}

            {!isLoading && !error && (
                <section className='home-trendingRepos-grid'>
                    {repositories.map((repo, index) => (
                        <>
                            <article className='home-trendingRepos-card' key={repo.id}>
                                <div>
                                    <header>
                                        <img src={repo.owner.avatarUrl} alt={repo.owner.login} />
                                        <Link to={repo.url} target='_blank'>{repo.fullName}</Link>
                                    </header>
                                    <p>{repo.description}</p>
                                    <footer>
                                        {repo.language && (
                                            <section>
                                                <div style={{ backgroundColor: languageColors[repo.language] ?? FALLBACK_LANGUAGE_COLOR }} />
                                                <span>{repo.language}</span>
                                            </section>
                                        )}
                                        <section>
                                            <Star size={16} /><span>{formatCount(repo.stars)}</span>
                                        </section>
                                        <section>
                                            <Fork size={16} /><span>{formatCount(repo.forks)}</span>
                                        </section>
                                        {repo.license && (
                                            <section>
                                                <License size={16} /><span>{repo.license}</span>
                                            </section>
                                        )}
                                    </footer>
                                </div>
                                <Link className='btn-right' to={repo.url} target='_blank'>Visit Repo <Launch size={16} /></Link>
                            </article>
                            {index < repositories.length - 1 && <hr key={`divider-${repo.id}`} />}
                        </>
                    ))}
                </section>
            )}
        </section>
    )
}

export default TrendingRepos
