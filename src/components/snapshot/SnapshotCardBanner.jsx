import { Checkmark, Download, Share } from "@carbon/icons-react"
import { useUser } from "../../hooks/useUser"
import { useRef, useState } from "react"
import { toPng, toBlob } from 'html-to-image'

let fontsReadyPromise = null

const ensureFontsReady = () => {
    if (!fontsReadyPromise) fontsReadyPromise = document.fonts?.ready ?? Promise.resolve()
    return fontsReadyPromise
}

const excludeFromCapture = (node) =>
    !(node.classList && node.classList.contains('snapshot-card-banner-download'))

async function captureNode(node, { asBlob = false } = {}) {
    await ensureFontsReady()
    const rect = node.getBoundingClientRect()
    const width = Math.ceil(rect.width)
    const height = Math.ceil(rect.height)
    const options = {
        pixelRatio: 3,
        width,
        height,
        canvasWidth: width * 1.5,
        canvasHeight: height * 1.5,
        cacheBust: false,
        style: { margin: '0', transform: 'none' },
        filter: excludeFromCapture,
    }
    return asBlob ? toBlob(node, options) : toPng(node, options)
}

const fileName = 'GitHub - snapshot.png'


const SnapshotCardBanner = () => {

    const { user } = useUser()

    function getFirstName() {
        return user?.name.trim().split(/\s+/)[0] || "";
    }

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
                console.error('[SnapshotCardBanner] Download failed:', err)
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
                console.error('[SnapshotCardBanner] Share failed:', err)
                setStatus('share', 'error')
            }
        })
    }

    return (
        <article className="snapshot-card-banner" ref={cardRef}>
            <div className='snapshot-card-banner-download'>
                <button onClick={handleShare} disabled={isBusy}>
                    {actionStatus.share === 'done' ? <Checkmark size={16} /> : <Share size={16} />}
                </button>
                <button onClick={handleDownload} disabled={isBusy}>
                    {actionStatus.download === 'done' ? <Checkmark size={16} /> : <Download size={16} />}
                </button>
            </div>
            <section>
                <h1>Olá, me chamo {getFirstName()}.<br />Muito prazer.</h1>
            </section>
        </article>
    )
}

export default SnapshotCardBanner
