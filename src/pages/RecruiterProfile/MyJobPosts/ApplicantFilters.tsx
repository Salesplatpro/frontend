import React, { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { IoRefresh } from 'react-icons/io5'

import { Select } from '@/components/forms/Select'
import { Button } from '@/components/ui/Button'
import { DateRangePicker } from '@/components/ui/DateRangePicker'

import styles from './ApplicantFilters.module.scss'

export type CvRankingTier = 'all' | 'top3' | 'top5' | 'top10' | 'unranked'
export type AiMatchLevel =
  | 'all'
  | 'any'
  | 'high'
  | 'medium'
  | 'low'
  | 'unavailable'

export interface ApplicantFiltersValues {
  search: string
  cvRankingTier: CvRankingTier
  aiMatchLevel: AiMatchLevel
  dateRange?: DateRange
}

export const defaultApplicantFilters: ApplicantFiltersValues = {
  search: '',
  cvRankingTier: 'all',
  aiMatchLevel: 'all',
  dateRange: undefined,
}

export const hasActiveApplicantFilter = (filters: ApplicantFiltersValues) =>
  !!(
    filters.search ||
    filters.cvRankingTier !== 'all' ||
    filters.aiMatchLevel !== 'all' ||
    filters.dateRange?.from
  )

const CV_RANKING_OPTIONS = [
  { label: 'All Rankings', value: 'all' },
  { label: 'Top 3', value: 'top3' },
  { label: 'Top 5', value: 'top5' },
  { label: 'Top 10', value: 'top10' },
  { label: 'Not Yet Ranked', value: 'unranked' },
]

const AI_MATCH_OPTIONS = [
  { label: 'All Match Levels', value: 'all' },
  { label: 'Strong', value: 'high' },
  { label: 'Good', value: 'medium' },
  { label: 'Weak', value: 'low' },
  { label: 'Not Available', value: 'unavailable' },
]

const startOfDay = (date: Date) => {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

const daysAgo = (days: number) => {
  const date = startOfDay(new Date())
  date.setDate(date.getDate() - days)
  return date
}

interface ApplicantFiltersProps {
  filters: ApplicantFiltersValues
  onApply: (filters: ApplicantFiltersValues) => void
}

export const ApplicantFilters = ({
  filters,
  onApply,
}: ApplicantFiltersProps) => {
  const [draft, setDraft] = useState(filters)

  const applyDraft = (next: ApplicantFiltersValues) => {
    setDraft(next)
    onApply(next)
  }

  const resetAll = () => {
    setDraft(defaultApplicantFilters)
    onApply(defaultApplicantFilters)
  }

  const toggleAiMatchPill = (value: 'any' | 'unavailable') => {
    applyDraft({
      ...draft,
      aiMatchLevel: draft.aiMatchLevel === value ? 'all' : value,
    })
  }

  const toggleDateRangePill = (days: number) => {
    const from = daysAgo(days)
    const isActive = draft.dateRange?.from?.getTime() === from.getTime()
    applyDraft({
      ...draft,
      dateRange: isActive ? undefined : { from, to: new Date() },
    })
  }

  const isDateRangePillActive = (days: number) =>
    draft.dateRange?.from?.getTime() === daysAgo(days).getTime()

  return (
    <div className={styles.panel} aria-label="Filter applicants">
      <div className={styles.header}>
        <span className={styles.title}>Filters</span>
        <button
          type="button"
          className={styles.resetAll}
          disabled={!hasActiveApplicantFilter(draft)}
          onClick={resetAll}>
          <IoRefresh /> Reset all
        </button>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="applicant-search">
          Search
        </label>
        <input
          id="applicant-search"
          className={styles.searchInput}
          type="text"
          placeholder="Search by name or email"
          value={draft.search}
          onChange={(event) =>
            setDraft({ ...draft, search: event.target.value })
          }
        />
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>CV Ranking</span>
        <Select
          options={CV_RANKING_OPTIONS}
          value={draft.cvRankingTier}
          onChange={(value) =>
            setDraft({ ...draft, cvRankingTier: value as CvRankingTier })
          }
        />
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>AI Match</span>
        <Select
          options={AI_MATCH_OPTIONS}
          value={draft.aiMatchLevel === 'any' ? 'all' : draft.aiMatchLevel}
          onChange={(value) =>
            setDraft({ ...draft, aiMatchLevel: value as AiMatchLevel })
          }
        />
        <div className={styles.pillRow}>
          <button
            type="button"
            className={
              draft.aiMatchLevel === 'any' ? styles.pillActive : styles.pill
            }
            onClick={() => toggleAiMatchPill('any')}>
            With AI Match
          </button>
          <button
            type="button"
            className={
              draft.aiMatchLevel === 'unavailable'
                ? styles.pillActive
                : styles.pill
            }
            onClick={() => toggleAiMatchPill('unavailable')}>
            No AI Match
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Date Applied</span>
        <DateRangePicker
          value={draft.dateRange}
          onChange={(dateRange) => setDraft({ ...draft, dateRange })}
        />
        <div className={styles.pillRow}>
          <button
            type="button"
            className={
              isDateRangePillActive(0) ? styles.pillActive : styles.pill
            }
            onClick={() => toggleDateRangePill(0)}>
            Today
          </button>
          <button
            type="button"
            className={
              isDateRangePillActive(7) ? styles.pillActive : styles.pill
            }
            onClick={() => toggleDateRangePill(7)}>
            This Week
          </button>
          <button
            type="button"
            className={
              isDateRangePillActive(30) ? styles.pillActive : styles.pill
            }
            onClick={() => toggleDateRangePill(30)}>
            This Month
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.clearAll}
          disabled={!hasActiveApplicantFilter(draft)}
          onClick={resetAll}>
          Clear all
        </button>
        <Button type="button" onClick={() => onApply(draft)}>
          Apply filters
        </Button>
      </div>
    </div>
  )
}
