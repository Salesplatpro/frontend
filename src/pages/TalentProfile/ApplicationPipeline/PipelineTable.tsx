import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import * as React from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

import { Button, StatusBadge } from '../../../components'
import { useAllJobApplicationsQuery } from '../../../redux/api/talent'
import { applications } from './ApplicationData'

interface AllJobTypes {
  currentStage?: string
  status?: string
  applicationType?: string
  job?: {
    role?: string
    _id?: string
    location?: {
      country: string
    }
  }
  postedBy?: {
    firstName: string
  }
  role?: {
    name: string
  }
  _id?: string
}

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
  const { data, error, isLoading } = useAllJobApplicationsQuery()
  const [allJobs, setAllJobs] = React.useState<AllJobTypes[]>([])
  const align = 'left'

  React.useEffect(() => {
    if (data) {
      console.log(data)
      console.log('data')
      toast.success(data?.message)
      setAllJobs(data.data.applications)
    }
  }, [data])

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
          {allJobs.map((application, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" align={align}>
                {application.role?.name}
              </StyledTableCell>
              <StyledTableCell align={align}>
                {application.postedBy?.firstName}
              </StyledTableCell>
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
                {application.applicationType}
              </StyledTableCell>
              <StyledTableCell align={align}>
                <div style={{ width: '80%' }}>
                  {/* <Button title={getButtonText(application.stage)} /> */}
                  <Link
                    to={`/talentDashboard/applicationPipeline/${application.job?._id}`}>
                    <Button title="View More" />
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
