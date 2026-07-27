import 'react-day-picker/style.css'

import React, { useEffect, useRef, useState } from 'react'
import { DateRange, DayPicker } from 'react-day-picker'

import styles from './DateRangePicker.module.scss'

interface DateRangePickerProps {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  placeholder?: string
}

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const formatRange = (range?: DateRange) => {
  if (!range?.from) return undefined
  if (!range.to) return formatDate(range.from)
  return `${formatDate(range.from)} – ${formatDate(range.to)}`
}

// Button trigger + popover calendar wrapping react-day-picker's range mode.
export const DateRangePicker = ({
  value,
  onChange,
  placeholder = 'Select date range',
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}>
        {formatRange(value) ?? placeholder}
      </button>
      {isOpen && (
        <div className={styles.popover}>
          <DayPicker
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
          />
        </div>
      )}
    </div>
  )
}
