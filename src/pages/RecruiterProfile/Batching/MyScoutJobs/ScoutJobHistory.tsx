import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { ColumnDef, DataTable } from '@/components/ui/DataTable'
import { Tabs } from '@/components/ui/Tabs'
import { useGetScoutJobScoutsQuery } from '@/redux/api/recruiter'

interface ScoutReportRow {
  id: string
  batchId: string | null
  cvName: string | null
  evaluationScore: number | null
  createdAt: string
}

export const ScoutJobHistory = () => {
  const params = useParams()
  const navigate = useNavigate()
  const scoutJobId = params.scoutJobId ?? ''
  const [activeTab, setActiveTab] = useState('batches')

  const { data, isLoading } = useGetScoutJobScoutsQuery(
    { scoutJobId, limit: 100, offset: 0 },
    { skip: !scoutJobId },
  )

  const scoutReports: ScoutReportRow[] = Array.isArray(data?.data?.scoutReports)
    ? data.data.scoutReports
    : []

  const columns: ColumnDef<ScoutReportRow>[] = [
    {
      key: 'cvName',
      header: 'CV',
      render: (row) => row.cvName ?? '—',
    },
    {
      key: 'batchId',
      header: 'Batch',
      hideBelow: 768,
      render: (row) => (row.batchId ? row.batchId.slice(0, 8) : '—'),
    },
    {
      key: 'evaluationScore',
      header: 'Score',
      render: (row) =>
        row.evaluationScore != null ? `${row.evaluationScore}%` : '—',
      sortAccessor: (row) => row.evaluationScore,
    },
    {
      key: 'createdAt',
      header: 'Scored On',
      hideBelow: 640,
      render: (row) => new Date(row.createdAt).toLocaleString(),
      sortAccessor: (row) => row.createdAt,
    },
  ]

  return (
    <div className="py-4 space-y-4">
      <PageHeaderTitle
        paramsId={{ id: scoutJobId }}
        description="Scouting history for this job"
      />

      <Tabs
        tabs={[
          {
            key: 'batches',
            label: 'Uploaded Batches',
            count: scoutReports.length,
          },
          { key: 'search', label: 'Search Talent' },
        ]}
        activeKey={activeTab}
        onChange={(key) => {
          if (key === 'search') {
            navigate(`/recruiterDashboard/scout/search-talent/${scoutJobId}`)
            return
          }
          setActiveTab(key)
        }}
      />

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            navigate(`/recruiterDashboard/scout/upload-cv/${scoutJobId}`)
          }>
          Upload More CVs
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={scoutReports}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        emptyState={
          <div className="py-8 text-center text-grey-500">
            No CVs have been scored for this job yet.
          </div>
        }
      />
    </div>
  )
}
