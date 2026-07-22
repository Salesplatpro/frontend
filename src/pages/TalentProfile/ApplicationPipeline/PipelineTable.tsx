import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, DataTable, StatusBadge } from '../../../components'
import { ColumnDef } from '../../../components'
import { useAllJobApplicationsQuery } from '../../../redux/api/talent'
import { calculateDaysFromCreation } from '../../../utils'
import { AllJobTypes } from '../../../utils/types'
import { getStatusBadge } from '../../RecruiterProfile/getJobStatus'

const SKELETON_ROWS = 5

const columns: ColumnDef<AllJobTypes>[] = [
  {
    key: 'jobTitle',
    header: 'Job Title',
    align: 'left',
    render: (app) => app.job?.role?.name ?? '—',
  },
  {
    key: 'company',
    header: 'Company Name',
    align: 'left',
    render: (app) => app.job?.postedBy?.firstName ?? '—',
  },
  {
    key: 'stage',
    header: 'Stage',
    align: 'left',
    hideBelow: 768,
    render: (app) => app.currentStage ?? '—',
  },
  {
    key: 'status',
    header: 'Job Status',
    align: 'left',
    hideBelow: 768,
    render: (app) => (
      <StatusBadge
        status={app.status ?? 'unknown'}
        {...getStatusBadge(app.status ?? 'unknown')}
      />
    ),
  },
  {
    key: 'dateApplied',
    header: 'Date Applied',
    align: 'left',
    hideBelow: 768,
    render: (app) => `${calculateDaysFromCreation(app.createdAt)} days ago`,
  },
  {
    key: 'details',
    header: 'Details',
    align: 'left',
    render: (app) => (
      <Link to={`/talentDashboard/applicationPipeline/${app.job?.id}`}>
        <Button>View More</Button>
      </Link>
    ),
  },
]

const PipelineTableSkeleton = () => (
  <TableContainer
    component={Paper}
    sx={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
    <Table aria-label="Application pipeline loading">
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col.key}>{col.header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
          <TableRow key={i}>
            {columns.map((col) => (
              <TableCell key={col.key}>
                <Skeleton variant="text" width="80%" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export const PipelineTable = () => {
  const { data, isLoading } = useAllJobApplicationsQuery({})
  const [allJobs, setAllJobs] = useState<AllJobTypes[]>([])

  useEffect(() => {
    if (data) {
      setAllJobs(data.data?.applications ?? [])
    }
  }, [data])

  return (
    <DataTable
      columns={columns}
      data={allJobs}
      isLoading={isLoading}
      loadingSkeleton={<PipelineTableSkeleton />}
      getRowKey={(app) => app.id ?? ''}
      ariaLabel="Application pipeline"
    />
  )
}
