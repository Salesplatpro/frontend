import React from 'react'
import { IoSwapVertical } from 'react-icons/io5'

import { Select } from '@/components/forms/Select'
import { exportRowsToCsv } from '@/utils/exportRowsToCsv'

import { Dropdown, DropdownItem } from '../Dropdown'
import { ColumnDef } from './DataTable'
import styles from './TableToolbar.module.scss'

type SortDirection = 'asc' | 'desc'

export interface ExportConfig<T> {
  rows: T[]
  headers: string[]
  /** Maps a row to one CSV row's cell values, in header order. */
  toCsvRow: (row: T) => string[]
  filename: string
}

interface TableToolbarProps<T> {
  columns: ColumnDef<T>[]
  resultsCount: number
  visibleColumnKeys: string[]
  onToggleColumn: (key: string) => void
  sortKey: string
  sortDirection: SortDirection
  onSortChange: (key: string, direction: SortDirection) => void
  exportConfig?: ExportConfig<T>
}

const labelOf = <T,>(col: ColumnDef<T>) =>
  col.sortLabel ?? (typeof col.header === 'string' ? col.header : col.key)

export function TableToolbar<T>({
  columns,
  resultsCount,
  visibleColumnKeys,
  onToggleColumn,
  sortKey,
  sortDirection,
  onSortChange,
  exportConfig,
}: TableToolbarProps<T>) {
  const toggleableColumns = columns.filter((col) => col.toggleable)
  const sortableColumns = columns.filter((col) => col.sortAccessor)

  const columnItems: DropdownItem[] = toggleableColumns.map((col) => ({
    key: col.key,
    label: (
      <span className={styles.columnItem}>
        <input
          type="checkbox"
          checked={visibleColumnKeys.includes(col.key)}
          readOnly
        />
        {labelOf(col)}
      </span>
    ),
    onClick: () => onToggleColumn(col.key),
  }))

  const sortOptions = sortableColumns.map((col) => ({
    label: labelOf(col),
    value: col.key,
  }))

  return (
    <div className={styles.toolbar}>
      <span className={styles.resultsCount}>
        {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
      </span>
      <div className={styles.controls}>
        {toggleableColumns.length > 0 && (
          <Dropdown
            trigger={<span>Columns</span>}
            items={columnItems}
            closeOnSelect={false}
          />
        )}
        {sortableColumns.length > 0 && (
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
        )}
        {exportConfig && (
          <Dropdown
            trigger={<span>Export ▾</span>}
            items={[
              {
                key: 'csv',
                label: 'Export as CSV',
                onClick: () =>
                  exportRowsToCsv(
                    exportConfig.headers,
                    exportConfig.rows.map(exportConfig.toCsvRow),
                    exportConfig.filename,
                  ),
              },
            ]}
          />
        )}
      </div>
    </div>
  )
}
