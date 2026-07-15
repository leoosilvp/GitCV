import { useRef, useState } from 'react'
import { ArrowRight, Download, Fire, HeatMap, PullRequest, Share, Star, Trophy, Checkmark } from '@carbon/icons-react'
import { toPng, toBlob } from 'html-to-image'
import logo from '../../assets/svg/icon.svg'
import { useUser } from '../../hooks/useUser'
import { useGithubContributions } from '../../hooks/useGithubContributions'
import { useGithubStats } from '../../hooks/useGithubStats'

let fontsReadyPromise = null

const ensureFontsReady = () => {
    if (!fontsReadyPromise) fontsReadyPromise = document.fonts?.ready ?? Promise.resolve()
    return fontsReadyPromise
}

const excludeFromCapture = (node) =>
    !(node.classList && node.classList.contains('snapshot-card-download'))

async function captureNode(node, { asBlob = false } = {}) {
    await ensureFontsReady()
    const rect = node.getBoundingClientRect()
    const width = Math.ceil(rect.width)
    const height = Math.ceil(rect.height)
    const options = {
        pixelRatio: 3,
        width,
        height,
        canvasWidth: width * 3,
        canvasHeight: height * 3,
        cacheBust: false,
        style: { margin: '0', transform: 'none' },
        filter: excludeFromCapture,
    }
    return asBlob ? toBlob(node, options) : toPng(node, options)
}

const fileName = 'GitHub - snapshot.png'

const SnapshotCard3 = () => {
    const { user } = useUser()

    const { contributions, totalCount } = useGithubContributions(user?.username)
    const { currentStreak, longestStreak, pullRequestCount, totalStars, isLoading } = useGithubStats(
        user?.username,
        contributions
    )

    const [actionStatus, setActionStatus] = useState({})
    const cardRef = useRef(null)

    const setStatus = (action, status) => {
        setActionStatus((prev) => ({ ...prev, [action]: status }))
        if (status !== 'pending') {
            setTimeout(() => setActionStatus((prev) => ({ ...prev, [action]: null })), 1800)
        }
    }

    const isBusy = Object.values(actionStatus).some((status) => status === 'pending')

    const handleDownload = () => {
        if (!cardRef.current || isBusy) return
        setStatus('download', 'pending')

        requestAnimationFrame(async () => {
            try {
                const dataUrl = await captureNode(cardRef.current)
                const link = document.createElement('a')
                link.href = dataUrl
                link.download = fileName
                link.click()
                setStatus('download', 'done')
            } catch (err) {
                console.error('[SnapshotCard3] Download failed:', err)
                setStatus('download', 'error')
            }
        })
    }

    const handleShare = () => {
        if (!cardRef.current || isBusy) return
        setStatus('share', 'pending')

        requestAnimationFrame(async () => {
            try {
                const blob = await captureNode(cardRef.current, { asBlob: true })
                if (!blob) throw new Error('Failed to generate image blob')
                const file = new File([blob], fileName, { type: blob.type })

                if (navigator.share && navigator.canShare?.({ files: [file] })) {
                    await navigator.share({ files: [file], title: 'GitHub Snapshot', text: fileName })
                    setStatus('share', 'done')
                    return
                }

                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = fileName
                link.click()
                URL.revokeObjectURL(link.href)
                setStatus('share', 'done')
            } catch (err) {
                if (err.name === 'AbortError') { setStatus('share', null); return }
                console.error('[SnapshotCard3] Share failed:', err)
                setStatus('share', 'error')
            }
        })
    }

    return (
        <article className='snapshot-card three' ref={cardRef}>
            <div className='snapshot-card-download'>
                <button onClick={handleShare} disabled={isBusy}>
                    {actionStatus.share === 'done' ? <Checkmark size={16} /> : <Share size={16} />}
                </button>
                <button onClick={handleDownload} disabled={isBusy}>
                    {actionStatus.download === 'done' ? <Checkmark size={16} /> : <Download size={16} />}
                </button>
            </div>
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