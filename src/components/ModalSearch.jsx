import { useEffect, useRef } from "react"
import { Events, ProgressBarRound, Search, UserAvatar, Warning } from "@carbon/icons-react"
import { Link } from "react-router-dom"
import { useUsersSearch } from "../hooks/useUsersSearch"

const ModalSearch = ({ isOpen, onClose, triggerRef }) => {

    const { search, setSearch, usernames, isLoading, error, isQueryTooShort } = useUsersSearch({ perPage: 20 })

    const modalRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return

        const { overflow: previousOverflow } = document.body.style
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return

        const onClickOutside = (event) => {
            const clickedModal = modalRef.current?.contains(event.target)
            const clickedTrigger = triggerRef?.current?.contains(event.target)

            if (!clickedModal && !clickedTrigger) {
                onClose?.()
            }
        }

        document.addEventListener("mousedown", onClickOutside)
        return () => document.removeEventListener("mousedown", onClickOutside)
    }, [isOpen, onClose, triggerRef])

    if (!isOpen) return null

    const hasQuery = search.trim().length > 0
    const hasResults = usernames.length > 0

    return (
        <section className="modalSearch-main">
            <article className="modalSearch-modal" ref={modalRef}>
                <div className="modalSearch-search">
                    <Search className="icon" size={17} />
                    <input
                        type="text"
                        placeholder="Busque por username..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        autoFocus
                    />
                </div>
                <section className="modalSearch-content">
                    <p className="modalSearch-content-title">Results</p>
                    <section className="modalSearch-grid">
                        {!hasQuery && (
                            <p className="modalSearch-content-status">
                                <Events size={25} />
                                Enter a username to search for.
                            </p>
                        )}

                        {hasQuery && isQueryTooShort && (
                            <p className="modalSearch-content-status">
                                <Warning size={25} />
                                Enter at least 2 characters.
                            </p>
                        )}

                        {hasQuery && !isQueryTooShort && isLoading && (
                            <p className="modalSearch-content-status loading"><ProgressBarRound size={30} /></p>
                        )}

                        {hasQuery && !isQueryTooShort && !isLoading && error && (
                            <p className="modalSearch-content-status">{error}</p>
                        )}

                        {hasQuery && !isQueryTooShort && !isLoading && !error && !hasResults && (
                            <p className="modalSearch-content-status">
                                No user found.
                            </p>
                        )}

                        {hasQuery &&
                            !isQueryTooShort &&
                            !isLoading &&
                            !error &&
                            usernames.map((username) => (
                                <Link
                                    onClick={() => onClose?.()}
                                    key={username}
                                    to={`/user/${username}`}
                                    className="modalSearch-card"
                                >
                                    <div>
                                        <UserAvatar className="icon" size={18} />
                                        <h1>{username}</h1>
                                    </div>
                                    <p>Jump to</p>
                                </Link>
                            ))}
                    </section>
                </section>
            </article>
        </section>
    )
}

export default ModalSearch