import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
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

const tableHeadStyle = {
  color: '#101828',
  backgroundColor: '#F8F8F8',
  fontSize: '18px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

const tableCellStyle = {
  color: '#101828',
  fontSize: '16px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

export const JobsTable = ({ data }: JobsTableType) => {
  const align = 'center'

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Application pipeline data">
        <TableHead>
          <TableRow>
            <TableCell align={align} sx={tableHeadStyle}>
              Job Title
            </TableCell>
            <TableCell align={align} sx={tableHeadStyle}>
              Applicants
            </TableCell>
            <TableCell align={align} sx={tableHeadStyle}>
              Date Creation
            </TableCell>
            <TableCell align={align} sx={tableHeadStyle}>
              Details
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((job, index) => (
            <TableRow key={index}>
              <TableCell
                component="th"
                align={align}
                sx={tableCellStyle}
                className="capitalize">
                {job.role.name}
              </TableCell>
              <TableCell align={align} sx={tableCellStyle}>
                {job.noOfApplicants}
              </TableCell>
              <TableCell
                align={align}
                sx={tableCellStyle}>{`${calculateDaysFromCreation(
                job.createdAt,
              )} days ago`}</TableCell>
              <TableCell align={align} sx={tableCellStyle}>
                <Link
                  to={`/recruiterDashboard/singleJobPost/${job._id}`}
                  state={{ jobName: job.role.name, postedAt: job.createdAt }}>
                  <Button title="View Application" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
