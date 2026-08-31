import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmptyState } from '@/components/ui/EmptyState'
import { humanStage, humanStatus } from '@/pages/TalentProfile/Job/jobPipeline'

import { Button, DataTable, StatusBadge } from '../../../components'
import { ColumnDef } from '../../../components'
import { useAllJobApplicationsQuery } from '../../../redux/api/talent'
import { calculateDaysFromCreation } from '../../../utils'
import { AllJobTypes } from '../../../utils/types'
import { getStatusBadge } from '../../RecruiterProfile/getJobStatus'

export const PipelineTable = () => {
  const { data, isLoading } = useAllJobApplicationsQuery({})
  const [allJobs, setAllJobs] = useState<AllJobTypes[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (data) {
      setAllJobs(data.data?.applications ?? [])
    }
  }, [data])

  const columns: ColumnDef<AllJobTypes>[] = useMemo(
    () => [
      {
        key: 'jobTitle',
        header: 'Job',
        align: 'left',
        render: (app) => app.job?.role?.name ?? '—',
      },
      {
        key: 'company',
        header: 'Company',
        align: 'left',
        render: (app) => app.job?.organization?.name ?? '—',
      },
      {
        key: 'status',
        header: 'Status',
        align: 'left',
        hideBelow: 768,
        render: (app) => (
          <StatusBadge
            status={humanStatus(app.status)}
            {...getStatusBadge(app.status ?? 'unknown')}
          />
        ),
      },
      {
        key: 'stage',
        header: 'Stage',
        align: 'left',
        hideBelow: 768,
        render: (app) => humanStage(app.currentStage),
      },
      {
        key: 'dateApplied',
        header: 'Date Applied',
        align: 'left',
        hideBelow: 768,
        render: (app) => `${calculateDaysFromCreation(app.createdAt)} days ago`,
      },
      {
        key: 'openJob',
        header: '',
        align: 'right',
        render: (app) => {
          const jobId = app.job?.id
          if (!jobId) return null
          return (
            <Button
              size="sm"
              onClick={(event) => {
                event.stopPropagation()
                navigate(`/talentDashboard/job/${jobId}`)
              }}>
              View job
            </Button>
          )
        },
      },
    ],
    [navigate],
  )

  return (
    <DataTable
      columns={columns}
      data={allJobs}
      isLoading={isLoading}
      getRowKey={(app) => app.id ?? ''}
      ariaLabel="Application pipeline"
      onRowClick={(app) => {
        const jobId = app.job?.id
        if (jobId) navigate(`/talentDashboard/job/${jobId}`)
      }}
      emptyState={
        <EmptyState
          title="No applications yet"
          description="Apply to open roles and track every stage of your pipeline here."
          action={
            <Button onClick={() => navigate('/talentDashboard/job')}>
              Browse jobs
            </Button>
          }
        />
      }
    />
  )
}
