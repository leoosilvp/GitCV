import { useRef, useState } from "react"
import { Copy, Download, Share, Checkmark } from "@carbon/icons-react"
import { toPng, toBlob } from "html-to-image"
import { useGithubContributions } from "../../hooks/useGithubContributions"
import { useUser } from "../../hooks/useUser"
import ContributionPanel from "../home/ContributionPanel"
import { CONTRIBUTION_THEMES, CONTRIBUTION_THEME_ORDER, DEFAULT_CONTRIBUTION_THEME } from "../../utils/contributionThemes"

let fontsReadyPromise = null

const ensureFontsReady = () => {
    if (!fontsReadyPromise) fontsReadyPromise = document.fonts?.ready ?? Promise.resolve()
    return fontsReadyPromise
}

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
        style: { margin: "0", transform: "none" },
    }
    return asBlob ? toBlob(node, options) : toPng(node, options)
}

const ACTION_LABELS = {
    download: { idle: "Download", pending: "Downloading…", done: "Downloaded", error: "Erro" },
    copy: { idle: "Copy", pending: "Copying…", done: "Copied", error: "Erro" },
    share: { idle: "Share", pending: "Sharing…", done: "Shared", error: "Erro" },
}

const Contribution = () => {
    const { user } = useUser()
    const { totalCount } = useGithubContributions(user?.username)

    const [selectedTheme, setSelectedTheme] = useState(DEFAULT_CONTRIBUTION_THEME)
    const [actionStatus, setActionStatus] = useState({})

    const cardRef = useRef(null)

    const fileName = 'GitHub - contributions.png'

    const setStatus = (action, status) => {
        setActionStatus((prev) => ({ ...prev, [action]: status }))
        if (status !== "pending") {
            setTimeout(() => setActionStatus((prev) => ({ ...prev, [action]: null })), 1800)
        }
    }

    const isBusy = Object.values(actionStatus).some((status) => status === "pending")

    const handleDownload = () => {
        if (!cardRef.current || isBusy) return
        setStatus("download", "pending")

        requestAnimationFrame(async () => {
            try {
                const dataUrl = await captureNode(cardRef.current)
                const link = document.createElement("a")
                link.href = dataUrl
                link.download = fileName
                link.click()
                setStatus("download", "done")
            } catch (err) {
                console.error("[Contribution] Download failed:", err)
                setStatus("download", "error")
            }
        })
    }

    const handleCopy = () => {
        if (!cardRef.current || isBusy) return
        if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
            setStatus("copy", "error")
            return
        }
        setStatus("copy", "pending")

        requestAnimationFrame(async () => {
            try {
                const blob = await captureNode(cardRef.current, { asBlob: true })
                if (!blob) throw new Error("Failed to generate image blob")
                await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
                setStatus("copy", "done")
            } catch (err) {
                console.error("[Contribution] Copy failed:", err)
                setStatus("copy", "error")
            }
        })
    }

    const handleShare = () => {
        if (!cardRef.current || isBusy) return
        setStatus("share", "pending")

        requestAnimationFrame(async () => {
            try {
                const blob = await captureNode(cardRef.current, { asBlob: true })
                if (!blob) throw new Error("Failed to generate image blob")
                const file = new File([blob], fileName, { type: blob.type })

                if (navigator.share && navigator.canShare?.({ files: [file] })) {
                    await navigator.share({ files: [file], title: "GitHub Contributions", text: `@${user?.username}'s contribution chart` })
                    setStatus("share", "done")
                    return
                }

                const link = document.createElement("a")
                link.href = URL.createObjectURL(blob)
                link.download = fileName
                link.click()
                URL.revokeObjectURL(link.href)
                setStatus("share", "done")
            } catch (err) {
                if (err.name === "AbortError") { setStatus("share", null); return }
                console.error("[Contribution] Share failed:", err)
                setStatus("share", "error")
            }
        })
    }

    const labelFor = (action) => ACTION_LABELS[action][actionStatus[action] ?? "idle"]

    return (
        <main className="download-contribution-main">
            <header className="download-contribution-main-header">
                <div>
                    <button onClick={handleCopy} disabled={isBusy}>
                        {actionStatus.copy === "done" ? <Checkmark size={16} /> : <Copy size={16} />}
                        {labelFor("copy")}
                    </button>
                    <button onClick={handleShare} disabled={isBusy}>
                        {actionStatus.share === "done" ? <Checkmark size={16} /> : <Share size={16} />}
                        {labelFor("share")}
                    </button>
                </div>
                <button className="active" onClick={handleDownload} disabled={isBusy}>
                    {actionStatus.download === "done" ? <Checkmark size={16} /> : <Download size={16} />}
                    {labelFor("download")}
                </button>
            </header>

            <article className="download-contribution-card" ref={cardRef}>
                <header className="download-contribution-card-header">
                    <div>
                        <h1>@{user?.username} on GitHub</h1>
                        <p>Total Contributions: {totalCount}</p>
                    </div>
                    <h2>over the past year</h2>
                </header>
                <ContributionPanel isDownload theme={selectedTheme} />
            </article>

            <section className="download-contribution-themes">
                <h1>Themes</h1>
                <div className="download-contribution-themes-grid">
                    {CONTRIBUTION_THEME_ORDER.map((themeKey) => {
                        const { label, colors } = CONTRIBUTION_THEMES[themeKey]

                        return (
                            <button key={themeKey} className={themeKey === selectedTheme ? "active" : ""} onClick={() => setSelectedTheme(themeKey)}>
                                <div>
                                    {colors.slice(1).map((color, index) => (
                                        <span key={index} style={{ background: color }} />
                                    ))}
                                </div>
                                {label}
                            </button>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}

export default Contribution