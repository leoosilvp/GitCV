import { useMemo } from "react"
import { useUser } from "../../hooks/useUser"
import { useGithubContributions } from "../../hooks/useGithubContributions"

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const getIntensityLevel = (count) => {
    if (count === 0) return 0
    if (count <= 2) return 1
    if (count <= 5) return 2
    if (count <= 9) return 3
    return 4
}

const buildWeeksMatrix = (contributions) => {
    const map = new Map(contributions.map((c) => [c.date, c.count]))

    const today = new Date()
    const end = new Date(today)
    const start = new Date(today)
    start.setDate(start.getDate() - 371)

    const firstSunday = new Date(start)
    firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay())

    const weeks = []
    let cursor = new Date(firstSunday)

    while (cursor <= end) {
        const week = []
        for (let i = 0; i < 7; i++) {
            const iso = cursor.toISOString().slice(0, 10)
            week.push({
                date: iso,
                count: map.get(iso) ?? 0,
                isFuture: cursor > end,
            })
            cursor.setDate(cursor.getDate() + 1)
        }
        weeks.push(week)
    }

    return weeks
}

const buildMonthSpans = (weeks) => {
    const spans = []

    weeks.forEach((week, index) => {
        const month = new Date(week[3].date).getMonth()

        const last = spans[spans.length - 1]
        if (last && last.month === month) {
            last.span += 1
        } else {
            spans.push({ month, span: 1, startIndex: index })
        }
    })

    return spans
}

const formatDate = (iso) => {
    const date = new Date(iso)
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
}

const ContributionPanel = () => {
    const { user } = useUser()
    const username = user?.username

    const { contributions, isLoading, error } = useGithubContributions(username)

    const weeks = useMemo(() => buildWeeksMatrix(contributions), [contributions])
    const monthSpans = useMemo(() => buildMonthSpans(weeks), [weeks])

    return (
        <div className="contributionPanel-main">
            {error ? (
                <div className="contributionPanel-error">
                    Unable to load contribution data.
                </div>
            ) : (
                <div className="contributionPanel-scrollArea">
                    <div className="contributionPanel-grid" data-loading={isLoading}>
                        <div className="contributionPanel-monthRow">
                            {monthSpans.map(({ month, span, startIndex }) => (
                                <span
                                    key={startIndex}
                                    className="contributionPanel-monthLabel"
                                    style={{ gridColumn: `span ${span}` }}
                                >
                                    {MONTH_LABELS[month]}
                                </span>
                            ))}
                        </div>

                        <div className="contributionPanel-body">
                            <div className="contributionPanel-weekdayColumn">
                                {WEEKDAY_LABELS.map((label, index) => (
                                    <span key={index} className="contributionPanel-weekdayLabel">
                                        {label}
                                    </span>
                                ))}
                            </div>

                            <div className="contributionPanel-weeksColumn">
                                {weeks.map((week, weekIndex) => (
                                    <div key={weekIndex} className="contributionPanel-week">
                                        {week.map((day) => (
                                            <div
                                                key={day.date}
                                                className="contributionPanel-day"
                                                data-level={day.isFuture ? "future" : getIntensityLevel(day.count)}
                                            >
                                                {!day.isFuture && (
                                                    <div className="contributionPanel-tooltip">
                                                        <strong>{day.count} contributions</strong>
                                                        <span>{formatDate(day.date)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="contributionPanel-footer">
                <span className="contributionPanel-legendLabel">Less</span>
                <div className="contributionPanel-legend">
                    {[0, 1, 2, 3, 4].map((level) => (
                        <div key={level} className="contributionPanel-legendSwatch" data-level={level} />
                    ))}
                </div>
                <span className="contributionPanel-legendLabel">More</span>
            </div>
        </div>
    )
}

export default ContributionPanel