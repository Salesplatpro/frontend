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
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'var(--color-grey-50)',
    color: 'var(--color-grey-900)',
    fontSize: '16px',
    fontFamily: 'Raleway, sans-serif',
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    color: 'var(--color-grey-900)',
    fontSize: '16px',
    fontFamily: 'Raleway, sans-serif',
    fontWeight: 500,
  },
}))

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
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
}: DataTableProps<T>) {
  const screenWidth = useScreenWidth()
  const visibleColumns = columns.filter(
    (col) => !col.hideBelow || screenWidth > col.hideBelow,
  )

  if (isLoading) return <Spinner fullPage />

  return (
    <TableContainer component={Paper}>
      <Table aria-label={ariaLabel}>
        <TableHead>
          <TableRow>
            {visibleColumns.map((col) => (
              <StyledTableCell key={col.key} align={col.align ?? 'center'}>
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
                  <StyledTableCell key={col.key} align={col.align ?? 'center'}>
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
