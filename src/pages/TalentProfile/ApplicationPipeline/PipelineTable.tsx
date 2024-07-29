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
import { applications } from './ApplicationData'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const getButtonText = (stage: string) => {
  switch (stage) {
    case 'Stage 1':
      return 'View Application'
    case 'Stage 2':
      return 'View Assessment'
    case 'Stage 3':
      return 'View Interview'
    case 'Stage 4':
      return 'Retake Assessment'
    case 'Stage 5':
      return 'View Offer'
    default:
      return 'Details'
  }
}

const getStatusBadgeProps = (status: string) => {
  switch (status) {
    case 'retake-assessment':
      return { backgroundColor: '#fff4e2', color: '#fbb241' }
    case 'not-proceeding':
      return { backgroundColor: '#fff0ef', color: '#ff6f6d' }
    case 'personalized-assessment':
      return { backgroundColor: '#f1f6fe', color: '#5d93e3' }
    case 'shortlisted':
      return { backgroundColor: '#edfeee', color: '#7cc88f' }
    default:
      return { backgroundColor: '#edfeee', color: '#76c8bc' }
  }
}

export const PipelineTable = () => {
  const align = 'left'

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Application pipeline data">
        <TableHead>
          <TableRow>
            <StyledTableCell align={align}>Job Title</StyledTableCell>
            <StyledTableCell align={align}>Company Name</StyledTableCell>
            <StyledTableCell align={align}>Stage</StyledTableCell>
            <StyledTableCell align={align}>Job Status</StyledTableCell>
            <StyledTableCell align={align}>Date Applied</StyledTableCell>
            <StyledTableCell align={align}>Details</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((application, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" align={align}>
                {application.jobTitle}
              </StyledTableCell>
              <StyledTableCell align={align}>
                {application.companyName}
              </StyledTableCell>
              <StyledTableCell align={align}>
                {application.stage}
              </StyledTableCell>
              <StyledTableCell align={align}>
                <StatusBadge
                  status={application.status}
                  {...getStatusBadgeProps(application.status)}
                />
              </StyledTableCell>
              <StyledTableCell align={align}>
                {application.dateApplied}
              </StyledTableCell>
              <StyledTableCell align={align}>
                <div style={{ width: '80%' }}>
                  <Button title={getButtonText(application.stage)} />
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
