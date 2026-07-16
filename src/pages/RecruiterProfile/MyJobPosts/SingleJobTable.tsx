import React from 'react'
import { Link } from 'react-router-dom'

import { Button, EmptyState, StatusBadge } from '../../../components'
import { ColumnDef, DataTable } from '../../../components'
import { calculateDaysFromCreation, SingleJobDetails } from '../../../utils'
import { getStatusBadge } from '../getJobStatus'

type SingleJobTableProps = {
  applications: SingleJobDetails[]
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

const columns: ColumnDef<SingleJobDetails>[] = [
  {
    key: 'name',
    header: 'Name',
    align: 'center',
    render: (item) => `${item.talent.firstName} ${item.talent.lastName}`,
  },
  {
    key: 'stage',
    header: 'Stage',
    align: 'center',
    render: (item) => getStatusStage(item.status),
  },
  {
    key: 'status',
    header: 'Job Status',
    align: 'center',
    hideBelow: 768,
    render: (item) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <StatusBadge status={item.status} {...getStatusBadge(item.status)} />
      </div>
    ),
  },
  {
    key: 'dateApplied',
    header: 'Date Applied',
    align: 'center',
    hideBelow: 768,
    render: (item) => `${calculateDaysFromCreation(item.createdAt)} days ago`,
  },
  {
    key: 'details',
    header: 'Details',
    align: 'center',
    render: (item) => (
      <Link to={`/recruiterDashboard/singleJobPost/${item.job}/${item.id}`}>
        <Button size="sm">View Application</Button>
      </Link>
    ),
  },
]

export const SingleJobTable = ({ applications }: SingleJobTableProps) => (
  <DataTable
    columns={columns}
    data={applications}
    getRowKey={(item) => item.id}
    ariaLabel="Job applications table"
    emptyState={
      <EmptyState
        title="No applications yet"
        description="Applications for this job will appear here once candidates apply."
      />
    }
  />
)
