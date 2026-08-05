import { useRef, useState } from 'react'
import { ArrowRight, Calendar, CalendarHeatMap, ChartAverage, Download, Share, Checkmark } from '@carbon/icons-react'
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
        canvasWidth: width * 2.5,
        canvasHeight: height * 2.5,
        cacheBust: false,
        style: { margin: '0', transform: 'none' },
        filter: excludeFromCapture,
    }
    return asBlob ? toBlob(node, options) : toPng(node, options)
}

const fileName = 'GitHub - snapshot.png'

const SnapshotCard1 = () => {
    const { user } = useUser()

    const { contributions } = useGithubContributions(user?.username)
    const { mostActiveWeekday, mostActiveMonth, averagePerWeek, isLoading } = useGithubStats(
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
                console.error('[SnapshotCard1] Download failed:', err)
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
                console.error('[SnapshotCard1] Share failed:', err)
                setStatus('share', 'error')
            }
        })
    }

    return (
        <article className='snapshot-card one' ref={cardRef}>
            <div className='snapshot-card-download'>
                <button onClick={handleShare} disabled={isBusy}>
                    {actionStatus.share === 'done' ? <Checkmark size={16} /> : <Share size={16} />}
                </button>
                <button onClick={handleDownload} disabled={isBusy}>
                    {actionStatus.download === 'done' ? <Checkmark size={16} /> : <Download size={16} />}
                </button>
            </div>
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
                <p>gitcv-app.vercel.app</p>
                <ArrowRight size={15} />
            </footer>
        </article>
    )
}

export default SnapshotCard1