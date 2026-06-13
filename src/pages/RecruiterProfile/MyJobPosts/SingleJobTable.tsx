import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { Button, EmptyState, StatusBadge } from '../../../components'
import { useScreenWidth } from '../../../hooks'
import {
  calculateDaysFromCreation,
  ResponsiveTableRenderer,
  SingleJobDetails,
} from '../../../utils'
import { getStatusBadge } from '../getJobStatus'

type SingleJobTableProps = {
  applications: SingleJobDetails[]
}

const tableHeadStyle = {
  color: 'var(--color-grey-900)',
  backgroundColor: 'var(--color-grey-50)',
  fontSize: '18px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

const tableCellStyle = {
  color: 'var(--color-grey-900)',
  fontSize: '16px',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 600,
}

const getStatusStage = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Stage 1'
    case 'not-proceeding':
      return 'Stage 2'
    case 'retake_assessment':
      return 'Stage 3'
    case 'shortlisted':
      return 'Stage 4'
    default:
      return ''
  }
}

export const SingleJobTable = ({ applications }: SingleJobTableProps) => {
  const align = 'center'
  const alignHeader = 'center'
  const screenWidth = useScreenWidth()

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Application pipeline data">
        <TableHead>
          <TableRow>
            <TableCell align={alignHeader} sx={tableHeadStyle}>
              Name
            </TableCell>
            <TableCell align={alignHeader} sx={tableHeadStyle}>
              Stage
            </TableCell>
            <ResponsiveTableRenderer screenWidth={screenWidth} breakpoint={768}>
              <TableCell align={alignHeader} sx={tableHeadStyle}>
                Job Status
              </TableCell>
              <TableCell align={alignHeader} sx={tableHeadStyle}>
                Date Applied
              </TableCell>
            </ResponsiveTableRenderer>
            <TableCell align={alignHeader} sx={tableHeadStyle}>
              Details
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications?.length > 0 ? (
            applications.map((item, index) => (
              <TableRow key={index}>
                <TableCell align={align} sx={tableCellStyle}>
                  {item.talent.firstName} {item.talent.lastName}
                </TableCell>
                <TableCell align={align} sx={tableCellStyle}>
                  {getStatusStage(item.status)}
                </TableCell>
                <ResponsiveTableRenderer
                  screenWidth={screenWidth}
                  breakpoint={768}
                >
                  <TableCell align={align} sx={tableCellStyle}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <StatusBadge
                        status={item.status}
                        {...getStatusBadge(item.status)}
                      />
                    </div>
                  </TableCell>
                  <TableCell align={align} sx={tableCellStyle}>
                    {`${calculateDaysFromCreation(item.createdAt)} days ago`}
                  </TableCell>
                </ResponsiveTableRenderer>
                <TableCell align={align} sx={tableCellStyle}>
                  <Link
                    to={`/recruiterDashboard/singleJobPost/${item.job}/${item._id}`}
                  >
                    <Button size="sm">View Applicantion</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={screenWidth > 768 ? 5 : 3}>
                <EmptyState
                  title="No applications yet"
                  description="Applications for this job will appear here once candidates apply."
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
