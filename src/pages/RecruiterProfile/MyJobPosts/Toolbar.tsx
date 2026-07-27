import React from 'react'
import { IoSwapVertical } from 'react-icons/io5'

import { Select } from '@/components/forms/Select'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { exportApplicantsCsv, SingleJobDetails } from '@/utils'

import {
  COLUMN_LABELS,
  SORTABLE_COLUMN_KEYS,
  TOGGLEABLE_COLUMN_KEYS,
} from './SingleJobTable'
import styles from './Toolbar.module.scss'

type SortDirection = 'asc' | 'desc'

interface ToolbarProps {
  resultsCount: number
  visibleColumnKeys: string[]
  onToggleColumn: (key: string) => void
  sortKey: string
  sortDirection: SortDirection
  onSortChange: (key: string, direction: SortDirection) => void
  exportRows: SingleJobDetails[]
}

export const Toolbar = ({
  resultsCount,
  visibleColumnKeys,
  onToggleColumn,
  sortKey,
  sortDirection,
  onSortChange,
  exportRows,
}: ToolbarProps) => {
  const columnItems: DropdownItem[] = TOGGLEABLE_COLUMN_KEYS.map((key) => ({
    key,
    label: (
      <span className={styles.columnItem}>
        <input
          type="checkbox"
          checked={visibleColumnKeys.includes(key)}
          readOnly
        />
        {COLUMN_LABELS[key]}
      </span>
    ),
    onClick: () => onToggleColumn(key),
  }))

  const exportItems: DropdownItem[] = [
    {
      key: 'csv',
      label: 'Export as CSV',
      onClick: () => exportApplicantsCsv(exportRows),
    },
  ]

  const sortOptions = SORTABLE_COLUMN_KEYS.map((key) => ({
    label: COLUMN_LABELS[key],
    value: key,
  }))

  return (
    <div className={styles.toolbar}>
      <span className={styles.resultsCount}>
        {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
      </span>
      <div className={styles.controls}>
        <Dropdown
          trigger={<span>Columns</span>}
          items={columnItems}
          closeOnSelect={false}
        />
        <div className={styles.sortControl}>
          <Select
            options={sortOptions}
            value={sortKey}
            onChange={(value) => onSortChange(value, sortDirection)}
            placeholder="Sort by"
          />
          <button
            type="button"
            className={styles.sortDirectionButton}
            aria-label={
              sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'
            }
            onClick={() =>
              onSortChange(sortKey, sortDirection === 'asc' ? 'desc' : 'asc')
            }>
            <IoSwapVertical />
          </button>
        </div>
        <Dropdown trigger={<span>Export ▾</span>} items={exportItems} />
      </div>
    </div>
  )
}
