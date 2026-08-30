import 'react-responsive-modal/styles.css'

import React, { useState } from 'react'
import Modal from 'react-responsive-modal'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components'
import { Select } from '@/components/forms/Select'
import { TextInput } from '@/components/forms/TextInput'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { PageShell } from '@/components/layout/PageShell'
import {
  ColumnDef,
  DataTable,
  sortByAccessor,
  TableToolbar,
} from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  useAddScoutToPipelineMutation,
  useFetchRecruiterJobPostQuery,
  useGetCampaignNameQuery,
  useGetScoutJobScoutsQuery,
} from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { ScoutCandidatePanel } from './ScoutCandidatePanel'
import styles from './ScoutJobHistory.module.scss'

export interface ScoutReportRow {
  id: string
  batchId: string | null
  cvName: string | null
  cvScore: number | null
  insights: string | null
  coverLetterScore: number | null
  coverLetterInsights: string | null
  evaluationScore: number | null
  candidateName: string | null
  candidateEmail: string | null
  candidatePhone: string | null
  candidateAddress: string | null
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

  const jobOptions = jobs.map(
    (job: { id: string; jobBrief?: string; role?: { name?: string } }) => ({
      value: job.id,
      label: job.role?.name ?? job.jobBrief?.slice(0, 60) ?? job.id,
    }),
  )

  return (
    <div className={styles.modal}>
      <h2 className={styles.title}>
        Add {scout.cvName ?? 'this candidate'} to a job pipeline
      </h2>
      <p className={styles.lead}>
        This creates a real application for an existing talent account — it
        doesn&apos;t create a new account. Enter the email the candidate uses to
        sign in.
      </p>

      <div className={styles.field}>
        <Select
          label="Job"
          options={jobOptions}
          value={jobId}
          onChange={setJobId}
          placeholder="Select an active job"
          disabled={isLoadingJobs}
        />
      </div>

      <TextInput
        title="Talent's email"
        label="pipeline-email"
        name="talentEmail"
        autoComplete="email"
        placeholder="candidate@example.com"
        value={talentEmail}
        onChange={(event) => setTalentEmail(event.target.value)}
      />

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
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
  // Rank highest-scoring CVs first by default so recruiters can see at a
  // glance which uploaded file performed best.
  const [sortKey, setSortKey] = useState('evaluationScore')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [pipelineTarget, setPipelineTarget] = useState<ScoutReportRow | null>(
    null,
  )
  const [detailsTarget, setDetailsTarget] = useState<ScoutReportRow | null>(
    null,
  )

  const { data, isLoading } = useGetScoutJobScoutsQuery(
    { scoutJobId, limit: 100, offset: 0 },
    { skip: !scoutJobId },
  )
  // Same cache entry PageHeaderTitle already queries for the heading — RTK
  // Query dedupes this, it doesn't trigger a second network request.
  const { data: campaignData } = useGetCampaignNameQuery(
    { id: scoutJobId },
    { skip: !scoutJobId },
  )
  const jobBrief = campaignData?.data?.scoutJob?.jobBrief
  const recruiterGuide = campaignData?.data?.scoutJob?.recruiterGuide

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
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDetailsTarget(row)}>
            View details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPipelineTarget(row)}>
            Add to job pipeline
          </Button>
        </div>
      ),
    },
  ]

  const sortColumn = columns.find((col) => col.key === sortKey)
  const scoutReports = sortColumn?.sortAccessor
    ? sortByAccessor(scoutReportsRaw, sortColumn.sortAccessor, sortDirection)
    : scoutReportsRaw

  return (
    <PageShell wide>
      <PageHeaderTitle
        variant="hero"
        paramsId={{ id: scoutJobId }}
        description="Scouting history for this job"
        onBack={() => navigate(-1)}
      />

      {(jobBrief || recruiterGuide) && (
        <div className="border border-grey-200 rounded-lg p-4 space-y-3 bg-grey-50">
          {jobBrief && (
            <div>
              <h2 className="text-sm font-semibold text-grey-900 mb-1">
                Job Description
              </h2>
              <p className="text-sm text-grey-700 whitespace-pre-wrap">
                {jobBrief}
              </p>
            </div>
          )}
          {recruiterGuide && (
            <div>
              <h2 className="text-sm font-semibold text-grey-900 mb-1">
                Scoring Guide
              </h2>
              <p className="text-sm text-grey-700 whitespace-pre-wrap">
                {recruiterGuide}
              </p>
            </div>
          )}
        </div>
      )}

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
          <EmptyState
            title="No CVs scored yet"
            description="Upload CVs for this campaign and scores will appear in this table."
          />
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

      {detailsTarget && (
        <ScoutCandidatePanel
          scout={detailsTarget}
          onClose={() => setDetailsTarget(null)}
        />
      )}
    </PageShell>
  )
}
