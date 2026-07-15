import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'

import { useScreenWidth } from '../../../hooks'
import { EmptyState } from '../EmptyState'
import { Spinner } from '../Spinner'

export interface ColumnDef<T> {
  key: string
  header: string
  align?: 'left' | 'center' | 'right'
  /** Hide this column when the screen width is at or below this pixel value */
  hideBelow?: number
  render: (row: T, index: number) => React.ReactNode
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  isLoading?: boolean
  emptyState?: React.ReactNode
  getRowKey?: (row: T, index: number) => string | number
  getRowClassName?: (row: T, index: number) => string
  ariaLabel?: string
  /** Prepends an auto-numbered "S/N" column (1, 2, 3, ...) — no data field needed. */
  showRowNumber?: boolean
  /** Starting offset for row numbers, e.g. the current page's offset when paginated. */
  rowNumberOffset?: number
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'var(--color-grey-50)',
    color: 'var(--color-grey-900)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    borderBottom: '2px solid var(--color-border-strong)',
  },
  [`&.${tableCellClasses.body}`]: {
    color: 'var(--color-grey-900)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    borderBottom: '1px solid var(--color-border)',
  },
}))

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: 'var(--color-bg-subtle)',
  },
}))

export function DataTable<T>({
  columns,
  data = [],
  isLoading,
  emptyState,
  getRowKey,
  getRowClassName,
  ariaLabel = 'data table',
  showRowNumber,
  rowNumberOffset = 0,
}: DataTableProps<T>) {
  const screenWidth = useScreenWidth()
  const rowNumberColumn: ColumnDef<T> = {
    key: '__rowNumber',
    header: 'S/N',
    align: 'center',
    render: (_row, index) => rowNumberOffset + index + 1,
  }
  const allColumns = showRowNumber ? [rowNumberColumn, ...columns] : columns
  const visibleColumns = allColumns.filter(
    (col) => !col.hideBelow || screenWidth > col.hideBelow,
  )

  if (isLoading) return <Spinner fullPage />

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
      <Table aria-label={ariaLabel}>
        <TableHead>
          <TableRow>
            {visibleColumns.map((col) => (
              <StyledTableCell key={col.key} align={col.align ?? 'left'}>
                {col.header}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <StyledTableCell colSpan={visibleColumns.length}>
                {emptyState ?? (
                  <EmptyState
                    title="No data"
                    description="Nothing to show here yet."
                  />
                )}
              </StyledTableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <StyledTableRow
                key={getRowKey ? getRowKey(row, index) : index}
                className={
                  getRowClassName ? getRowClassName(row, index) : undefined
                }>
                {visibleColumns.map((col) => (
                  <StyledTableCell key={col.key} align={col.align ?? 'left'}>
                    {col.render(row, index)}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
