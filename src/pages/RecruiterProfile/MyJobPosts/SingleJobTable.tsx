import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import * as React from 'react'

import { Button, StatusBadge } from '../../../components'
import { useScreenWidth } from '../../../hooks'
import {
  calculateDaysFromCreation,
  ResponsiveTableRenderer,
  SingleJobDetails,
} from '../../../utils'

type SingleJobTableProps = {
  applications: SingleJobDetails[]
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#d0d5dd',
    color: '#101828',
    fontWeight: 400,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    fontWeight: 400,
  },
}))

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const getStatusBadgeProps = (status: string) => {
  switch (status) {
    case 'pending':
      return { backgroundColor: '#fff4e2', color: '#fbb241' }
    case 'not-proceeding':
      return { backgroundColor: '#fff0ef', color: '#ff6f6d' }
    case 'retake_assessment':
      return { backgroundColor: '#f1f6fe', color: '#5d93e3' }
    case 'shortlisted':
      return { backgroundColor: '#edfeee', color: '#7cc88f' }
    default:
      return { backgroundColor: '#edfeee', color: '#76c8bc' }
  }
}

export const SingleJobTable = ({ applications }: SingleJobTableProps) => {
  const align = 'left'
  const screenWidth = useScreenWidth()

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Application pipeline data">
        <TableHead>
          <TableRow>
            <StyledTableCell align={align}>Name</StyledTableCell>
            <ResponsiveTableRenderer screenWidth={screenWidth} breakpoint={768}>
              <StyledTableCell align={align}>Email</StyledTableCell>
              <StyledTableCell align={align}>Stage</StyledTableCell>
              <StyledTableCell align={align}>Applied</StyledTableCell>
              <StyledTableCell align={align}>Date</StyledTableCell>
            </ResponsiveTableRenderer>
            <StyledTableCell align={align}>Details</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications?.length > 0 &&
            applications?.map((item, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align={align}>
                  {item.talent.firstName} {item.talent.lastName}
                </StyledTableCell>
                <ResponsiveTableRenderer
                  screenWidth={screenWidth}
                  breakpoint={768}>
                  <StyledTableCell align={align}>
                    {item.talent.email}
                  </StyledTableCell>
                  <StyledTableCell align={align}>
                    <div style={{ width: '60%' }}>
                      <StatusBadge
                        status={item.status}
                        {...getStatusBadgeProps(item.status)}
                      />
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align={align}>
                    {item.applicationType}
                  </StyledTableCell>
                  <StyledTableCell align={align}>
                    {`${calculateDaysFromCreation(item.createdAt)} days ago`}
                  </StyledTableCell>
                </ResponsiveTableRenderer>
                <StyledTableCell align={align}>
                  <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
                    <Button title="View more" />
                    <Button title="View Profile" />
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
