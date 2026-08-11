import { useMemo } from "react"
import { useUser } from "../hooks/useUser"
import { useGithubContributions } from "../hooks/useGithubContributions"
import { Link } from 'react-router-dom';
import { Download, Launch } from "@carbon/icons-react";
import { DEFAULT_CONTRIBUTION_THEME, buildContributionThemeStyle } from "../utils/contributionThemes"

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const getIntensityLevel = (count) => {
    if (count === 0) return 0
    if (count <= 3) return 1
    if (count <= 7) return 2
    if (count <= 15) return 3
    return 4
}

const toLocalDateKey = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

const startOfDay = (date) => {
    const copy = new Date(date)
    copy.setHours(0, 0, 0, 0)
    return copy
}

const buildWeeksMatrix = (contributions) => {
    const map = new Map(contributions.map((c) => [c.date, c.count]))

    const end = startOfDay(new Date())
    const start = startOfDay(new Date())
    start.setDate(start.getDate() - 365)

    const firstSunday = new Date(start)
    firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay())

    const weeks = []
    let cursor = new Date(firstSunday)

    while (cursor <= end) {
        const week = []
        for (let i = 0; i < 7; i++) {
            const dateKey = toLocalDateKey(cursor)
            week.push({
                date: dateKey,
                count: map.get(dateKey) ?? 0,
                isFuture: cursor > end,
            })
            cursor.setDate(cursor.getDate() + 1)
        }
        weeks.push(week)
    }

    return weeks.length > 53 ? weeks.slice(weeks.length - 53) : weeks
}

const buildMonthSpans = (weeks) => {
    const spans = []

    weeks.forEach((week, index) => {

        const monthStartDay = week.find((day) => Number(day.date.slice(8, 10)) === 1)

        if (monthStartDay) {
            const month = Number(monthStartDay.date.slice(5, 7)) - 1
            spans.push({ month, span: 1, startIndex: index })
            return
        }

        const last = spans[spans.length - 1]
        if (last) {
            last.span += 1
        } else {
            const month = Number(week[0].date.slice(5, 7)) - 1
            spans.push({ month, span: 1, startIndex: index })
        }
    })

    return spans
}

const dropEdgeMonths = (spans) => {
    if (spans.length === 0) return spans

    const withoutTrailing = spans.slice(0, -1)
    const [first, ...rest] = withoutTrailing

    if (first && first.startIndex === 0 && first.span < 2) {
        return rest
    }

    return withoutTrailing
}

const formatDate = (dateKey) => {
    const [year, month, day] = dateKey.split("-").map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
}

const ContributionPanel = ({ isDownload, isWelcome, username: usernameProp, theme = DEFAULT_CONTRIBUTION_THEME }) => {
    const { user } = useUser()
    const username = usernameProp ?? user?.username

    const { contributions, isLoading, error } = useGithubContributions(username)

    const weeks = useMemo(() => buildWeeksMatrix(contributions), [contributions])
    const monthSpans = useMemo(() => dropEdgeMonths(buildMonthSpans(weeks)), [weeks])
    const themeStyle = useMemo(() => buildContributionThemeStyle(theme), [theme])

    return (
        <div className="contributionPanel-main" data-theme={theme} style={themeStyle}>
            {error ? (
                <div className="contributionPanel-error">
                    Unable to load contribution data.
                </div>
            ) : (
                <div className="contributionPanel-scrollArea">
                    <div className="contributionPanel-grid" data-loading={isLoading}>
                        <div className="contributionPanel-monthRow">
                            {monthSpans.map(({ month, span, startIndex }) => (
                                <span key={startIndex} className="contributionPanel-monthLabel" style={{ gridColumn: `span ${span}` }}>
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
                                            <div key={day.date} className="contributionPanel-day" data-level={day.isFuture ? "future" : getIntensityLevel(day.count)}>
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
                {isDownload ?
                    <Link to='/download/contributions'><Download size={14} /> Download my Chart</Link>
                    :
                    isWelcome ? <Link to='/download/contributions'>Generate my chart <Launch size={14} /></Link> : <p>Made by GitCV - gitcv-app.vercel.app</p>
                }
                <div className="contributionPanel-content">
                    <span className="contributionPanel-legendLabel">Less</span>
                    <div className="contributionPanel-legend">
                        {[0, 1, 2, 3, 4].map((level) => (
                            <div key={level} className="contributionPanel-legendSwatch" data-level={level} />
                        ))}
                    </div>
                    <span className="contributionPanel-legendLabel">More</span>
                </div>
            </div>
        </div>
    )
}

export default ContributionPanel