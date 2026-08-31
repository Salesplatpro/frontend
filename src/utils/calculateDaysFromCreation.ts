const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS
const WEEK_MS = 7 * DAY_MS
const MONTH_MS = 30 * DAY_MS
const YEAR_MS = 365 * DAY_MS

const plural = (count: number, singular: string, pluralForm: string) =>
  count === 1 ? `1 ${singular} ago` : `${count} ${pluralForm} ago`

/**
 * Relative time for any created/updated timestamp in the app.
 * Examples: just now, 1 min ago, 5 mins ago, 1 hour ago, 3 days ago.
 */
export const formatTimeAgo = (
  createdAt: string | Date | null | undefined,
): string => {
  if (!createdAt) return ''
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt)
  if (Number.isNaN(date.getTime())) return ''

  const diffMs = Math.max(0, Date.now() - date.getTime())

  if (diffMs < MINUTE_MS) return 'just now'
  if (diffMs < HOUR_MS) {
    const mins = Math.floor(diffMs / MINUTE_MS)
    return plural(mins, 'min', 'mins')
  }
  if (diffMs < DAY_MS) {
    const hours = Math.floor(diffMs / HOUR_MS)
    return plural(hours, 'hour', 'hours')
  }
  if (diffMs < WEEK_MS) {
    const days = Math.floor(diffMs / DAY_MS)
    return plural(days, 'day', 'days')
  }
  if (diffMs < MONTH_MS) {
    const weeks = Math.floor(diffMs / WEEK_MS)
    return plural(weeks, 'week', 'weeks')
  }
  if (diffMs < YEAR_MS) {
    const months = Math.floor(diffMs / MONTH_MS)
    return plural(months, 'month', 'months')
  }
  const years = Math.floor(diffMs / YEAR_MS)
  return plural(years, 'year', 'years')
}

export const calculateDaysFromCreation = (createdAt: string): number => {
  const creationDate = new Date(createdAt)
  const today = new Date()
  const timeDifference = today.getTime() - creationDate.getTime()
  return Math.floor(timeDifference / (1000 * 3600 * 24))
}
