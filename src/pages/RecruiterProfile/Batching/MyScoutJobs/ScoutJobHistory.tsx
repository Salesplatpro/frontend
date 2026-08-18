import 'react-responsive-modal/styles.css'

import React, { useState } from 'react'
import Modal from 'react-responsive-modal'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import {
  ColumnDef,
  DataTable,
  sortByAccessor,
  TableToolbar,
} from '@/components/ui/DataTable'
import { Tabs } from '@/components/ui/Tabs'
import {
  useAddScoutToPipelineMutation,
  useFetchRecruiterJobPostQuery,
  useGetScoutJobScoutsQuery,
} from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

interface ScoutReportRow {
  id: string
  batchId: string | null
  cvName: string | null
  evaluationScore: number | null
  createdAt: string
}

interface AddToPipelineModalProps {
  scout: ScoutReportRow
  onClose: () => void
}

// Phase 1, manual link: the recruiter picks the job and confirms the talent
// account by email themselves — Scout has no extracted candidate identity
// (cvName is just a filename) and no automatic account creation happens.
const AddToPipelineModal = ({ scout, onClose }: AddToPipelineModalProps) => {
  const { data: jobsData, isLoading: isLoadingJobs } =
    useFetchRecruiterJobPostQuery({ limit: 100, status: 'active' })
  const [addToPipeline, { isLoading: isSubmitting }] =
    useAddScoutToPipelineMutation()
  const [jobId, setJobId] = useState('')
  const [talentEmail, setTalentEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const jobs = Array.isArray(jobsData?.data?.jobs) ? jobsData.data.jobs : []

  const handleSubmit = async () => {
    if (!jobId || !talentEmail) return
    setError(null)
    try {
      await addToPipeline({ scoutId: scout.id, jobId, talentEmail }).unwrap()
      notify('success', 'Added to the job pipeline', { autoClose: 2000 })
      onClose()
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'No talent account found with that email — ask them to create a profile first.',
        ),
      )
    }
  }

  return (
    <div className="w-[320px] sm:w-[420px] space-y-4">
      <h2 className="text-lg font-semibold text-grey-900">
        Add {scout.cvName ?? 'this candidate'} to a job pipeline
      </h2>
      <p className="text-sm text-grey-500">
        This creates a real application for an existing talent account — it
        doesn&apos;t create a new account. Enter the email the candidate uses to
        sign in.
      </p>

      <div className="space-y-1">
        <label
          htmlFor="pipeline-job"
          className="text-sm font-medium text-grey-700">
          Job
        </label>
        <select
          id="pipeline-job"
          className="w-full border border-grey-300 rounded-lg p-2"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          disabled={isLoadingJobs}>
          <option value="">Select an active job</option>
          {jobs.map(
            (job: {
              id: string
              jobBrief?: string
              role?: { name?: string }
            }) => (
              <option key={job.id} value={job.id}>
                {job.role?.name ?? job.jobBrief?.slice(0, 60) ?? job.id}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="pipeline-email"
          className="text-sm font-medium text-grey-700">
          Talent&apos;s email
        </label>
        <input
          id="pipeline-email"
          type="email"
          className="w-full border border-grey-300 rounded-lg p-2"
          placeholder="candidate@example.com"
          value={talentEmail}
          onChange={(e) => setTalentEmail(e.target.value)}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          loading={isSubmitting}
          disabled={!jobId || !talentEmail || isSubmitting}
          onClick={handleSubmit}>
          Add to pipeline
        </Button>
      </div>
    </div>
  )
}

type SortDirection = 'asc' | 'desc'

export const ScoutJobHistory = () => {
  const params = useParams()
  const navigate = useNavigate()
  const scoutJobId = params.scoutJobId ?? ''
  const [activeTab, setActiveTab] = useState('batches')
  // Rank highest-scoring CVs first by default so recruiters can see at a
  // glance which uploaded file performed best.
  const [sortKey, setSortKey] = useState('evaluationScore')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [pipelineTarget, setPipelineTarget] = useState<ScoutReportRow | null>(
    null,
  )

  const { data, isLoading } = useGetScoutJobScoutsQuery(
    { scoutJobId, limit: 100, offset: 0 },
    { skip: !scoutJobId },
  )

  const scoutReportsRaw: ScoutReportRow[] = Array.isArray(
    data?.data?.scoutReports,
  )
    ? data.data.scoutReports
    : []

  const handleSortChange = (key: string, direction: SortDirection) => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const columns: ColumnDef<ScoutReportRow>[] = [
    {
      key: 'rank',
      header: 'Rank',
      align: 'center',
      render: (_row, index) => `#${index + 1}`,
    },
    {
      key: 'cvName',
      header: 'File Name',
      sortLabel: 'File Name',
      render: (row) => row.cvName ?? '—',
      sortAccessor: (row) => row.cvName,
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
      sortLabel: 'Score',
      render: (row) =>
        row.evaluationScore != null ? `${row.evaluationScore}%` : '—',
      sortAccessor: (row) => row.evaluationScore,
    },
    {
      key: 'createdAt',
      header: 'Scored On',
      sortLabel: 'Scored On',
      hideBelow: 640,
      render: (row) => new Date(row.createdAt).toLocaleString(),
      sortAccessor: (row) => row.createdAt,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPipelineTarget(row)}>
          Add to job pipeline
        </Button>
      ),
    },
  ]

  const sortColumn = columns.find((col) => col.key === sortKey)
  const scoutReports = sortColumn?.sortAccessor
    ? sortByAccessor(scoutReportsRaw, sortColumn.sortAccessor, sortDirection)
    : scoutReportsRaw

  return (
    <div className="py-4 space-y-4">
      <PageHeaderTitle
        paramsId={{ id: scoutJobId }}
        description="Scouting history for this job"
        onBack={() => navigate(-1)}
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
            navigate('/recruiterDashboard/talent-search')
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

      <TableToolbar
        columns={columns}
        resultsCount={scoutReports.length}
        visibleColumnKeys={[]}
        onToggleColumn={() => {}}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

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

      <Modal
        open={pipelineTarget !== null}
        onClose={() => setPipelineTarget(null)}
        center>
        {pipelineTarget && (
          <AddToPipelineModal
            scout={pipelineTarget}
            onClose={() => setPipelineTarget(null)}
          />
        )}
      </Modal>
    </div>
  )
}
