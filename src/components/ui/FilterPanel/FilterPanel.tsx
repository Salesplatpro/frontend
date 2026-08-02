import React, { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { IoRefresh } from 'react-icons/io5'

import { Select } from '@/components/forms/Select'
import { Button } from '@/components/ui/Button'
import { DateRangePicker } from '@/components/ui/DateRangePicker'

import styles from './FilterPanel.module.scss'

export interface SearchFieldConfig<TFilters> {
  type: 'search'
  key: keyof TFilters
  label: string
  placeholder?: string
}

export interface SelectFieldConfig<TFilters> {
  type: 'select'
  key: keyof TFilters
  label: string
  options: { label: string; value: string }[]
  /** The value the select/pills revert to when cleared (e.g. 'all'). */
  offValue: string
  /** Extra toggle "pill" buttons rendered under the select — clicking an active pill reverts the field to `offValue`. */
  pills?: { label: string; value: string }[]
}

export interface DateRangeFieldConfig<TFilters> {
  type: 'dateRange'
  key: keyof TFilters
  label: string
  /** Quick-range pill buttons, each "days back from today" (0 = today). */
  quickRanges?: { label: string; days: number }[]
}

export type FilterFieldConfig<TFilters> =
  | SearchFieldConfig<TFilters>
  | SelectFieldConfig<TFilters>
  | DateRangeFieldConfig<TFilters>

export const hasActiveFilters = <TFilters extends object>(
  filters: TFilters,
  defaultFilters: TFilters,
): boolean =>
  Object.keys(defaultFilters).some((key) => {
    const current = filters[key as keyof TFilters]
    const fallback = defaultFilters[key as keyof TFilters]
    if (current instanceof Date || fallback instanceof Date) {
      return current?.valueOf() !== fallback?.valueOf()
    }
    if (typeof current === 'object' || typeof fallback === 'object') {
      return JSON.stringify(current) !== JSON.stringify(fallback)
    }
    return current !== fallback
  })

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

interface FilterPanelProps<TFilters extends object> {
  fields: FilterFieldConfig<TFilters>[]
  filters: TFilters
  defaultFilters: TFilters
  onApply: (filters: TFilters) => void
  ariaLabel?: string
}

export function FilterPanel<TFilters extends object>({
  fields,
  filters,
  defaultFilters,
  onApply,
  ariaLabel = 'Filters',
}: FilterPanelProps<TFilters>) {
  const [draft, setDraft] = useState(filters)

  const applyDraft = (next: TFilters) => {
    setDraft(next)
    onApply(next)
  }

  const resetAll = () => {
    setDraft(defaultFilters)
    onApply(defaultFilters)
  }

  const setField = (key: keyof TFilters, value: unknown) =>
    setDraft({ ...draft, [key]: value })

  const applyField = (key: keyof TFilters, value: unknown) =>
    applyDraft({ ...draft, [key]: value })

  const active = hasActiveFilters(draft, defaultFilters)

  return (
    <div className={styles.panel} aria-label={ariaLabel}>
      <div className={styles.header}>
        <span className={styles.title}>Filters</span>
        <button
          type="button"
          className={styles.resetAll}
          disabled={!active}
          onClick={resetAll}>
          <IoRefresh /> Reset all
        </button>
      </div>

      {fields.map((field) => {
        if (field.type === 'search') {
          const value = (draft[field.key] as string) ?? ''
          return (
            <div className={styles.field} key={String(field.key)}>
              <label
                className={styles.fieldLabel}
                htmlFor={`filter-${String(field.key)}`}>
                {field.label}
              </label>
              <input
                id={`filter-${String(field.key)}`}
                className={styles.searchInput}
                type="text"
                placeholder={field.placeholder}
                value={value}
                onChange={(event) => setField(field.key, event.target.value)}
              />
            </div>
          )
        }

        if (field.type === 'select') {
          const value = (draft[field.key] as string) ?? field.offValue
          return (
            <div className={styles.field} key={String(field.key)}>
              <span className={styles.fieldLabel}>{field.label}</span>
              <Select
                options={field.options}
                value={value}
                onChange={(next) => setField(field.key, next)}
              />
              {field.pills && (
                <div className={styles.pillRow}>
                  {field.pills.map((pill) => {
                    const isActive = value === pill.value
                    return (
                      <button
                        key={pill.value}
                        type="button"
                        className={isActive ? styles.pillActive : styles.pill}
                        onClick={() =>
                          applyField(
                            field.key,
                            isActive ? field.offValue : pill.value,
                          )
                        }>
                        {pill.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        }

        // field.type === 'dateRange'
        const value = draft[field.key] as DateRange | undefined
        const isQuickRangeActive = (days: number) =>
          value?.from?.getTime() === daysAgo(days).getTime()
        return (
          <div className={styles.field} key={String(field.key)}>
            <span className={styles.fieldLabel}>{field.label}</span>
            <DateRangePicker
              value={value}
              onChange={(next) => setField(field.key, next)}
            />
            {field.quickRanges && (
              <div className={styles.pillRow}>
                {field.quickRanges.map((range) => (
                  <button
                    key={range.label}
                    type="button"
                    className={
                      isQuickRangeActive(range.days)
                        ? styles.pillActive
                        : styles.pill
                    }
                    onClick={() => {
                      const from = daysAgo(range.days)
                      const isActive = isQuickRangeActive(range.days)
                      applyField(
                        field.key,
                        isActive ? undefined : { from, to: new Date() },
                      )
                    }}>
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.clearAll}
          disabled={!active}
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
