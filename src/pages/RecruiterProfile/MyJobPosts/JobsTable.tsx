import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../../../components'
import { myJobPostsData } from './myJobPostsData'

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

export const JobsTable = () => {
  const align = 'left'

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Application pipeline data">
        <TableHead>
          <TableRow>
            <StyledTableCell align={align}>Job Title</StyledTableCell>
            <StyledTableCell align={align}>Applicants</StyledTableCell>
            <StyledTableCell align={align}>Date Creation</StyledTableCell>
            <StyledTableCell align={align}>Details</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {myJobPostsData.map((job, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" align={align}>
                {job.jobTitle}
              </StyledTableCell>
              <StyledTableCell align={align}>{job.applicants}</StyledTableCell>
              <StyledTableCell
                align={align}>{`${job.created} ago`}</StyledTableCell>
              <StyledTableCell align={align}>
                <div style={{ width: '50%' }}>
                  <Link to={`/recruiterDashboard/singleJobPost`}>
                    <Button title="View Application" />
                  </Link>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
