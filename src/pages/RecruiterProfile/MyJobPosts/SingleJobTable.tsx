import React from 'react'
import { Link } from 'react-router-dom'

import {
  Button,
  EmptyState,
  StatusBadge,
  VerdictBadge,
} from '../../../components'
import { ColumnDef, DataTable } from '../../../components'
import { calculateDaysFromCreation, SingleJobDetails } from '../../../utils'
import { getStatusBadge } from '../getJobStatus'

type SingleJobTableProps = {
  applications: SingleJobDetails[]
  selectedRowKeys?: Set<string>
  onToggleRow?: (key: string | number) => void
  onToggleAll?: (keys: (string | number)[]) => void
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
    sortAccessor: (item) => `${item.talent.firstName} ${item.talent.lastName}`,
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
    sortAccessor: (item) => item.status,
  },
  {
    key: 'cvRanking',
    header: 'CV Ranking',
    align: 'center',
    hideBelow: 900,
    render: (item) => (item.rank ? `#${item.rank}` : '—'),
    sortAccessor: (item) => item.rank ?? Infinity,
  },
  {
    key: 'aiMatch',
    header: 'AI Match',
    align: 'center',
    hideBelow: 900,
    render: (item) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <VerdictBadge verdict={item.matchVerdict ?? null} compact />
      </div>
    ),
    sortAccessor: (item) => {
      const order = { high: 0, medium: 1, low: 2 }
      return item.matchVerdict ? order[item.matchVerdict] : Infinity
    },
  },
  {
    key: 'dateApplied',
    header: 'Date Applied',
    align: 'center',
    hideBelow: 768,
    render: (item) => `${calculateDaysFromCreation(item.createdAt)} days ago`,
    sortAccessor: (item) => new Date(item.createdAt).getTime(),
  },
  {
    key: 'details',
    header: 'Details',
    align: 'center',
    render: (item) => (
      <Link to={`/recruiterDashboard/singleJobPost/${item.jobId}/${item.id}`}>
        <Button size="sm">View Application</Button>
      </Link>
    ),
  },
]

export const SingleJobTable = ({
  applications,
  selectedRowKeys,
  onToggleRow,
  onToggleAll,
}: SingleJobTableProps) => (
  <DataTable
    columns={columns}
    data={applications}
    getRowKey={(item) => item.id}
    ariaLabel="Job applications table"
    selectedRowKeys={selectedRowKeys}
    onToggleRow={onToggleRow}
    onToggleAll={onToggleAll}
    emptyState={
      <EmptyState
        title="No applications yet"
        description="Applications for this job will appear here once candidates apply."
      />
    }
  />
)
