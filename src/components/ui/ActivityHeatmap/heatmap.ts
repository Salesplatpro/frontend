export type HeatmapDatum = {
  date: string
  count: number
}

const WEEKS = 12
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const toDateKey = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const bucketDates = (
  values: Array<string | Date | undefined | null>,
) => {
  const counts = new Map<string, number>()
  for (const value of values) {
    if (!value) continue
    const key = toDateKey(value)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()].map(([date, count]) => ({ date, count }))
}

const startOfLocalDay = (date: Date) => {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export const buildHeatmapWeeks = (data: HeatmapDatum[], now = new Date()) => {
  const counts = new Map(data.map((item) => [item.date, item.count]))
  const today = startOfLocalDay(now)
  const mondayOffset = (today.getDay() + 6) % 7
  const start = new Date(today)
  start.setDate(start.getDate() - mondayOffset - (WEEKS - 1) * 7)

  const weeks: Array<Array<{ date: string; count: number; inRange: boolean }>> =
    []
  const cursor = new Date(start)

  for (let week = 0; week < WEEKS; week += 1) {
    const days = []
    for (let day = 0; day < 7; day += 1) {
      const key = toDateKey(cursor)
      days.push({
        date: key,
        count: counts.get(key) ?? 0,
        inRange: cursor.getTime() <= today.getTime(),
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(days)
  }

  return weeks
}

export const heatmapLevel = (count: number, max: number) => {
  if (count <= 0 || max <= 0) return 0
  if (max === 1) return count > 0 ? 3 : 0
  const ratio = count / max
  if (ratio > 0.75) return 4
  if (ratio > 0.5) return 3
  if (ratio > 0.25) return 2
  return 1
}

export const WEEKDAY_SHORT_LABELS = WEEKDAY_LABELS
