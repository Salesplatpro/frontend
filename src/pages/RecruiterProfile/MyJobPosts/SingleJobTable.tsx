import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'

import {
  Avatar,
  Button,
  ColumnDef,
  DataTable,
  Dropdown,
  DropdownItem,
  EmptyState,
  MatchScoreRing,
  Spinner,
  StatusBadge,
} from '../../../components'
import { JobAiConfigThresholds } from '../../../features/applications/services/applicationService'
import { formatTimeAgo, SingleJobDetails } from '../../../utils'
import { getStatusBadge } from '../getJobStatus'

type SingleJobTableProps = {
  applications: SingleJobDetails[]
  jobAiConfig?: JobAiConfigThresholds | null
  selectedRowKeys?: Set<string>
  onToggleRow?: (key: string | number) => void
  onToggleAll?: (keys: (string | number)[]) => void
  onShortlist: (applicationId: string) => void
  onReject: (applicationId: string) => void
  onMessage: (applicationId: string) => void
  onOpenDossier?: (item: SingleJobDetails) => void
  /** Application id currently being updated (e.g. via a row-level shortlist/reject) — shows a spinner in that row's actions cell instead of a static disabled state. */
  loadingRowId?: string | null
  visibleColumnKeys?: string[]
  sortKey?: string | null
  sortDirection?: 'asc' | 'desc'
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void
}

const formatAbsoluteDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

// Single source of truth for column labels — TableToolbar derives its
// "Columns" picker / "Sort by" select straight from these column defs
// (via each column's `toggleable`/`sortAccessor`/`header`), so they can't drift.
const COLUMN_LABELS: Record<string, string> = {
  name: 'Name',
  status: 'Job Status',
  cvRanking: 'Completion order',
  aiMatch: 'AI Match',
  dateApplied: 'Date Applied',
  details: 'Details',
}

const MANDATORY_COLUMN_KEYS = ['name', 'details']

// high -> medium -> low -> no verdict (completed but failed/unavailable) ->
// still screening. Shared by the aiMatch column's own sortAccessor
// (single-key toolbar sort) and compareByAiMatch below (the default
// page-load sort, which adds averageScore/createdAt tie-breakers).
const VERDICT_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }
const verdictRank = (
  verdict: SingleJobDetails['matchVerdict'],
  currentStage?: SingleJobDetails['currentStage'],
) => {
  if (currentStage && currentStage !== 'completed') return 4
  return verdict ? VERDICT_ORDER[verdict] : 3
}

// Default sort for the applicant table: best AI match first. A single
// sortAccessor can't express three tie-break levels without fragile numeric
// encoding (a date difference could overflow/outweigh a small score
// difference), so this is a real multi-level comparator instead.
export const compareByAiMatch = (
  a: SingleJobDetails,
  b: SingleJobDetails,
): number => {
  const verdictDiff =
    verdictRank(a.matchVerdict, a.currentStage) -
    verdictRank(b.matchVerdict, b.currentStage)
  if (verdictDiff !== 0) return verdictDiff

  const scoreDiff = (b.averageScore ?? 0) - (a.averageScore ?? 0) // desc
  if (scoreDiff !== 0) return scoreDiff

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // desc
}

interface ApplicantActionsCellProps {
  item: SingleJobDetails
  onShortlist: (applicationId: string) => void
  onReject: (applicationId: string) => void
  onMessage: (applicationId: string) => void
  isLoading?: boolean
}

const ApplicantActionsCell = ({
  item,
  onShortlist,
  onReject,
  onMessage,
  isLoading,
}: ApplicantActionsCellProps) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Spinner size="sm" />
      </div>
    )
  }

  const items: DropdownItem[] = [
    { label: 'Shortlist', onClick: () => onShortlist(item.id) },
    { label: 'Reject', onClick: () => onReject(item.id) },
    { label: 'Message', onClick: () => onMessage(item.id) },
  ]

  return (
    <div
      style={{ display: 'flex', gap: 8, justifyContent: 'center' }}
      onClick={(event) => event.stopPropagation()}>
      <Dropdown trigger={<BsThreeDotsVertical />} items={items} />
    </div>
  )
}

const AiMatchCell = ({
  item,
  onOpen,
}: {
  item: SingleJobDetails
  onOpen: (item: SingleJobDetails) => void
}) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`View AI Match for ${item.talent.firstName} ${item.talent.lastName}`}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}>
      <MatchScoreRing
        verdict={item.matchVerdict ?? null}
        averageScore={item.averageScore ?? null}
        cvSimilarityScore={item.cvSimilarityScore ?? null}
        failed={item.matchVerdictStatus === 'failed'}
        currentStage={item.currentStage}
      />
    </button>
  </div>
)

export const buildColumns = ({
  onShortlist,
  onReject,
  onMessage,
  loadingRowId,
  onOpenAiMatch,
}: {
  onShortlist: (applicationId: string) => void
  onReject: (applicationId: string) => void
  onMessage: (applicationId: string) => void
  loadingRowId?: string | null
  onOpenAiMatch?: (item: SingleJobDetails) => void
}): ColumnDef<SingleJobDetails>[] => [
  {
    key: 'name',
    header: COLUMN_LABELS.name,
    render: (item) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar
          firstName={item.talent.firstName}
          lastName={item.talent.lastName}
        />
        <div style={{ textAlign: 'left' }}>
          <div>
            {item.talent.firstName} {item.talent.lastName}
          </div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
            }}>
            {item.talent.email}
          </div>
        </div>
      </div>
    ),
    sortAccessor: (item) => `${item.talent.firstName} ${item.talent.lastName}`,
  },
  {
    key: 'status',
    header: COLUMN_LABELS.status,
    align: 'center',
    hideBelow: 768,
    toggleable: true,
    render: (item) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <StatusBadge
          status={item.status}
          showDot
          {...getStatusBadge(item.status)}
        />
      </div>
    ),
    sortAccessor: (item) => item.status,
  },
  {
    key: 'cvRanking',
    header: COLUMN_LABELS.cvRanking,
    align: 'center',
    hideBelow: 900,
    toggleable: true,
    render: (item) => (item.rank ? `#${item.rank}` : '—'),
    sortAccessor: (item) => item.rank ?? Infinity,
  },
  {
    key: 'aiMatch',
    header: COLUMN_LABELS.aiMatch,
    align: 'center',
    hideBelow: 900,
    toggleable: true,
    render: (item) =>
      onOpenAiMatch ? (
        <AiMatchCell item={item} onOpen={onOpenAiMatch} />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MatchScoreRing
            verdict={item.matchVerdict ?? null}
            averageScore={item.averageScore ?? null}
            cvSimilarityScore={item.cvSimilarityScore ?? null}
            failed={item.matchVerdictStatus === 'failed'}
            currentStage={item.currentStage}
          />
        </div>
      ),
    sortAccessor: (item) => verdictRank(item.matchVerdict, item.currentStage),
  },
  {
    key: 'dateApplied',
    header: COLUMN_LABELS.dateApplied,
    align: 'center',
    hideBelow: 768,
    toggleable: true,
    render: (item) => (
      <div>
        <div>{formatTimeAgo(item.createdAt)}</div>
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
          }}>
          {formatAbsoluteDate(item.createdAt)}
        </div>
      </div>
    ),
    sortAccessor: (item) => new Date(item.createdAt).getTime(),
  },
  {
    key: 'details',
    header: COLUMN_LABELS.details,
    align: 'center',
    render: (item) => (
      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={(event) => event.stopPropagation()}>
        {onOpenAiMatch ? (
          <Button size="sm" onClick={() => onOpenAiMatch(item)}>
            View Application
          </Button>
        ) : null}
        <ApplicantActionsCell
          item={item}
          onShortlist={onShortlist}
          onReject={onReject}
          onMessage={onMessage}
          isLoading={item.id === loadingRowId}
        />
      </div>
    ),
  },
]

export const SingleJobTable = ({
  applications,
  jobAiConfig: _jobAiConfig,
  selectedRowKeys,
  onToggleRow,
  onToggleAll,
  onShortlist,
  onReject,
  onMessage,
  loadingRowId,
  visibleColumnKeys,
  sortKey,
  sortDirection,
  onSortChange,
  onOpenDossier,
}: SingleJobTableProps) => {
  const allColumns = buildColumns({
    onShortlist,
    onReject,
    onMessage,
    loadingRowId,
    onOpenAiMatch: onOpenDossier,
  })
  const columns = visibleColumnKeys
    ? allColumns.filter(
        (col) =>
          MANDATORY_COLUMN_KEYS.includes(col.key) ||
          visibleColumnKeys.includes(col.key),
      )
    : allColumns

  return (
    <DataTable
      columns={columns}
      data={applications}
      getRowKey={(item) => item.id}
      ariaLabel="Job applications table"
      selectedRowKeys={selectedRowKeys}
      onToggleRow={onToggleRow}
      onToggleAll={onToggleAll}
      onRowClick={onOpenDossier}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSortChange={onSortChange}
      emptyState={
        <EmptyState
          title="No applications yet"
          description="Applications for this job will appear here once candidates apply."
        />
      }
    />
  )
}
