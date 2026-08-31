import React from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ColumnDef } from '@/components/ui/DataTable'

import { formatTimeAgo } from '../../../utils'

export interface ApplicationColumnRow {
  id?: string
  jobId?: string
  applicantName: string
  prescreeningScore?: number
  cvSimilarityScore?: number
  dateApplied: string
}

export const buildApplicationColumns =
  (): ColumnDef<ApplicationColumnRow>[] => [
    {
      key: 'name',
      header: 'Applicant name',
      align: 'left',
      sortLabel: 'Applicant name',
      render: (row) => row.applicantName,
      sortAccessor: (row) => row.applicantName,
    },
    {
      key: 'prescreening',
      header: 'Pre screening',
      align: 'center',
      sortLabel: 'Pre screening',
      render: (row) => `${row.prescreeningScore ?? 'nill'}%`,
      sortAccessor: (row) => row.prescreeningScore ?? -1,
    },
    {
      key: 'cvMatch',
      header: 'CV match',
      align: 'center',
      sortLabel: 'CV match',
      render: (row) => `${row.cvSimilarityScore ?? 'nill'}%`,
      sortAccessor: (row) => row.cvSimilarityScore ?? -1,
    },
    {
      key: 'dateApplied',
      header: 'Date Applied',
      align: 'center',
      sortLabel: 'Date Applied',
      render: (row) => formatTimeAgo(row.dateApplied),
      sortAccessor: (row) => new Date(row.dateApplied).getTime(),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) =>
        row.jobId ? (
          <div
            style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}
            onClick={(event) => event.stopPropagation()}>
            <Link to={`/recruiterDashboard/singleJobPost/${row.jobId}`}>
              <Button size="sm" variant="outline">
                View job
              </Button>
            </Link>
            {row.id ? (
              <Link
                to={`/recruiterDashboard/singleJobPost/${row.jobId}?applicationId=${row.id}`}>
                <Button size="sm">View Application</Button>
              </Link>
            ) : null}
          </div>
        ) : null,
    },
  ]
