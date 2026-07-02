import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, DataTable, StatusBadge } from '../../../components'
import { ColumnDef } from '../../../components'
import { useAllJobApplicationsQuery } from '../../../redux/api/talent'
import { calculateDaysFromCreation } from '../../../utils'
import { AllJobTypes } from '../../../utils/types'
import { getStatusBadge } from '../../RecruiterProfile/getJobStatus'

const columns: ColumnDef<AllJobTypes>[] = [
  {
    key: 'jobTitle',
    header: 'Job Title',
    align: 'left',
    render: (app) => app.role?.name ?? '—',
  },
  {
    key: 'company',
    header: 'Company Name',
    align: 'left',
    render: (app) => app.postedBy?.firstName ?? '—',
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
      <Link to={`/talentDashboard/applicationPipeline/${app.job?._id}`}>
        <Button>View More</Button>
      </Link>
    ),
  },
]

export const PipelineTable = () => {
  const { data, isLoading } = useAllJobApplicationsQuery({})
  const [allJobs, setAllJobs] = useState<AllJobTypes[]>([])

  useEffect(() => {
    if (data) {
      setAllJobs(data.data.applications)
    }
  }, [data])

  return (
    <DataTable
      columns={columns}
      data={allJobs}
      isLoading={isLoading}
      getRowKey={(app) => app._id ?? ''}
      ariaLabel="Application pipeline"
    />
  )
}
