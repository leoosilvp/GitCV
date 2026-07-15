import { ArrowRight, ArrowUpRight, Link as LinkIcon } from "@carbon/icons-react"
import { Link } from "react-router-dom"
import { useTechNews } from "../../hooks/useNews"
import { getCompanyLogo } from "../../utils/companyLogos.js"

const MAX_VISIBLE_ARTICLES = 20

function formatRelativeTime(isoDate) {
    if (!isoDate) return ""

    const diffMs = Date.now() - new Date(isoDate).getTime()
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return "just now"
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.round(diffHours / 24)
    return `${diffDays}d ago`
}

const News = () => {
    const { articles, isLoading, error } = useTechNews()

    const visibleArticles = articles.slice(0, MAX_VISIBLE_ARTICLES)

    return (
        <section className='news-main'>
            <header className="news-header">
                <div>
                    <h1>Tech News</h1>
                    <p>What's new in the world?</p>
                </div>
                <Link to='/news'>View All News <ArrowRight size={16} /></Link>
            </header>

            {error ? (
                <p className="news-error">Failed to load news: {error}</p>
            ) : (
                <section className="news-grid">
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, index) => (
                            <article className="news-card" key={index}>
                                <header className="news-card-header">
                                    <h1 style={{ color: '#080808' }}>.</h1>
                                    <p style={{ color: '#080808' }}>.</p>
                                </header>

                                <section className="news-card-content">
                                    <h1 style={{ color: '#080808' }}>.</h1>
                                    <p style={{ color: '#080808' }}>.</p>
                                </section>

                                <hr style={{ border: 'none' }} />

                                <footer className="news-card-footer">
                                    <div>
                                        <h1 style={{ color: '#080808' }}>.</h1>
                                    </div>
                                </footer>
                            </article>
                        ))
                        : visibleArticles.map((article) => {
                            const logoUrl = getCompanyLogo(article.source)

                            return (
                                <article className="news-card" key={article.url}>
                                    <header className="news-card-header">
                                        <h1>{article.source ?? "Tech"}</h1>
                                        <p>{formatRelativeTime(article.publishedAt)}</p>
                                    </header>

                                    <section className="news-card-content">
                                        <h1>{article.title}</h1>
                                        <p>{article.description}</p>
                                    </section>

                                    <hr />

                                    <footer className="news-card-footer">
                                        <div>
                                            {logoUrl ? (
                                                <img draggable={false} src={logoUrl} />
                                            ) : (
                                                <LinkIcon size={16} />
                                            )}
                                            <h1>{article.source ?? "Unknown"}</h1>
                                        </div>

                                        <Link to={article.url} target="_blank" rel="noopener noreferrer">
                                            Read Article <ArrowUpRight size={15} />
                                        </Link>
                                    </footer>
                                </article>
                            )
                        })}
                </section>
            )}
        </section>
    )
}

export default News