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
import {
  calculateDaysFromCreation,
  recruiterJobPostsTypes,
} from '../../../utils'

type JobsTableType = {
  data: recruiterJobPostsTypes[]
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#d0d5dd',
    color: '#101828',
    fontWeight: 400,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: 400,
    padding: 12,
  },
}))

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export const JobsTable = ({ data }: JobsTableType) => {
  const align = 'center'

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
          {data?.map((job, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" align={align}>
                {job.role.name}
              </StyledTableCell>
              <StyledTableCell align={align}>
                {job.noOfApplicants}
              </StyledTableCell>
              <StyledTableCell align={align}>{`${calculateDaysFromCreation(
                job.createdAt,
              )} days ago`}</StyledTableCell>
              <StyledTableCell align={align}>
                <div style={{ width: '100%' }}>
                  <Link
                    to={`/recruiterDashboard/singleJobPost/${job._id}`}
                    state={{ jobName: job.role.name, postedAt: job.createdAt }}>
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
