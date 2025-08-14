import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { Button, StatusBadge } from '../../../components'
import Loading from '../../../components/Loading/Loading'
import { useScreenWidth } from '../../../hooks'
import { useAllJobApplicationsQuery } from '../../../redux/api/talent'
import {
  calculateDaysFromCreation,
  ResponsiveTableRenderer,
} from '../../../utils'
import { notify } from '../../../utils/toastNotifications'
import { AllJobTypes } from '../../../utils/types'
// import { applications } from './ApplicationData'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

// const getButtonText = (stage: string) => {
//   switch (stage) {
//     case 'Stage 1':
//       return 'View Application'
//     case 'Stage 2':
//       return 'View Assessment'
//     case 'Stage 3':
//       return 'View Interview'
//     case 'Stage 4':
//       return 'Retake Assessment'
//     case 'Stage 5':
//       return 'View Offer'
//     default:
//       return 'Details'
//   }
// }

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

export const PipelineTable = () => {
  const { data, isLoading } = useAllJobApplicationsQuery({})
  const [allJobs, setAllJobs] = React.useState<AllJobTypes[]>([])
  const align = 'left'
  const screenWidth = useScreenWidth()

  React.useEffect(() => {
    if (data) {
      console.log(data)
      console.log('data')

      notify('success', data?.message, {
        autoClose: 5000,
      })
      setAllJobs(data.data.applications)
    }
  }, [data])

  if (isLoading) return <Loading />

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Application pipeline data">
        <TableHead>
          <TableRow>
            <StyledTableCell align={align}>Job Title</StyledTableCell>
            <StyledTableCell align={align}>Company Name</StyledTableCell>
            <ResponsiveTableRenderer screenWidth={screenWidth} breakpoint={768}>
              <StyledTableCell align={align}>Stage</StyledTableCell>
              <StyledTableCell align={align}>Job Status</StyledTableCell>
              <StyledTableCell align={align}>Date Applied</StyledTableCell>
            </ResponsiveTableRenderer>
            <StyledTableCell align={align}>Details</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allJobs.map((application, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" align={align}>
                {application.role?.name}
              </StyledTableCell>
              <StyledTableCell align={align}>
                {application.postedBy?.firstName}
              </StyledTableCell>
              <ResponsiveTableRenderer
                screenWidth={screenWidth}
                breakpoint={768}>
                <StyledTableCell align={align}>
                  {application.currentStage}
                </StyledTableCell>
                <StyledTableCell align={align}>
                  <StatusBadge
                    status={application.status || 'unknown'}
                    {...getStatusBadgeProps(application?.status || 'unknown')}
                  />
                </StyledTableCell>
                <StyledTableCell align={align}>
                  {calculateDaysFromCreation(application.createdAt)} days ago
                </StyledTableCell>
              </ResponsiveTableRenderer>
              <StyledTableCell align={align}>
                <Link
                  to={`/talentDashboard/applicationPipeline/${application.job?._id}`}>
                  <Button title="View More" />
                </Link>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
