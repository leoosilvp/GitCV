import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Filter, Search, Link as LinkIcon, ChevronLeft, ChevronRight } from '@carbon/icons-react'
import { Link } from "react-router-dom"
import Footer from '../components/Footer'
import Header from '../components/Header'
import { useTechNews } from '../hooks/useNews'
import { getCompanyLogo } from '../utils/companyLogos'
import '../css/news.css'

function formatRelativeTime(isoDate) {
    if (!isoDate) return ""

    const diffMs = Date.now() - new Date(isoDate).getTime()
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return "just now"
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.round(diffHours / 24)
    return `${diffDays}d ago`
}

function buildPageList(page, totalPages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
}

const News = () => {
    const { articles, page, totalPages, isLoading, error, goToPage, nextPage, previousPage } = useTechNews()

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSource, setSelectedSource] = useState(null)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const filterRef = useRef(null)

    useEffect(() => {
        if (!isFilterOpen) return undefined

        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isFilterOpen])

    const availableSources = useMemo(() => {
        const sources = new Set(articles.map((article) => article.source).filter(Boolean))
        return Array.from(sources).sort()
    }, [articles])

    const filteredArticles = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()

        return articles.filter((article) => {
            const matchesSource = !selectedSource || article.source === selectedSource
            if (!matchesSource) return false

            if (!normalizedSearch) return true

            const haystack = `${article.title ?? ''} ${article.description ?? ''}`.toLowerCase()
            return haystack.includes(normalizedSearch)
        })
    }, [articles, searchTerm, selectedSource])

    const handleSelectSource = (source) => {
        setSelectedSource((current) => (current === source ? null : source))
        setIsFilterOpen(false)
    }

    const pageList = buildPageList(page, totalPages)

    return (
        <main className='news-main'>
            <Header path="News" />
            <section className='news-content'>
                <header className='news-header'>
                    <div className='news-filter' ref={filterRef}>
                        <button onClick={() => setIsFilterOpen((open) => !open)} className={selectedSource ? 'active' : ''}>
                            <Filter className='icon' size={16} />
                            {selectedSource ?? 'Filter'}
                        </button>

                        {isFilterOpen && (
                            <div className='news-filter-dropdown'>
                                {availableSources.length === 0 ? (
                                    <p>No sources available</p>
                                ) : (
                                    availableSources.map((source) => (
                                        <button
                                            key={source}
                                            className={source === selectedSource ? 'active' : ''}
                                            onClick={() => handleSelectSource(source)}
                                        >
                                            {source}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className='news-header-right'>
                        <div className='news-search'>
                            <Search className='icon' size={17} />
                            <input
                                type="text"
                                placeholder='Pesquisar...'
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>

                        <section>
                            <button onClick={previousPage} disabled={page <= 1 || isLoading}><ChevronLeft size={16} /></button>
                            <button onClick={nextPage} disabled={page >= totalPages || isLoading}><ChevronRight size={16} /></button>
                        </section>
                    </div>
                </header>

                {error ? (
                    <p className="news-error">Failed to load news: {error}</p>
                ) : (
                    <>
                        <section className='news-grid'>
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
                                : filteredArticles.map((article) => {
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

                        {!isLoading && filteredArticles.length === 0 && (
                            <p className="news-empty">No articles match your search or filter.</p>
                        )}

                        {totalPages > 1 && (
                            <footer className='news-pagination'>
                                <button onClick={previousPage} disabled={page <= 1 || isLoading}>
                                    <ChevronLeft size={16} />
                                </button>

                                {pageList.map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        className={pageNumber === page ? 'active' : ''}
                                        onClick={() => goToPage(pageNumber)}
                                        disabled={isLoading}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}

                                <button onClick={nextPage} disabled={page >= totalPages || isLoading}>
                                    <ChevronRight size={16} />
                                </button>
                            </footer>
                        )}
                    </>
                )}
                <div className='news-btn-next-page'>
                    <button onClick={previousPage} disabled={page <= 1 || isLoading}><ChevronLeft size={16} /></button>
                    <p>{page}</p>
                    <button onClick={nextPage} disabled={page >= totalPages || isLoading}><ChevronRight size={16} /></button>
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default News