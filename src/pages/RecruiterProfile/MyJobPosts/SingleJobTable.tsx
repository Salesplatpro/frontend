import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { Link } from 'react-router-dom'

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
import { useRegenerateVerdict } from '../../../features/applications/hooks/useRegenerateVerdict'
import { calculateDaysFromCreation, SingleJobDetails } from '../../../utils'
import { getStatusBadge } from '../getJobStatus'
import { AiMatchPanel } from './AiMatchPanel'

type SingleJobTableProps = {
  applications: SingleJobDetails[]
  selectedRowKeys?: Set<string>
  onToggleRow?: (key: string | number) => void
  onToggleAll?: (keys: (string | number)[]) => void
  onShortlist: (applicationId: string) => void
  onReject: (applicationId: string) => void
  onMessage: (applicationId: string) => void
  /** Application id currently being updated (e.g. via a row-level shortlist/reject) — shows a spinner in that row's actions cell instead of a static disabled state. */
  loadingRowId?: string | null
  visibleColumnKeys?: string[]
  sortKey?: string | null
  sortDirection?: 'asc' | 'desc'
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void
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
  stage: 'Stage',
  status: 'Job Status',
  cvRanking: 'CV Ranking',
  aiMatch: 'AI Match',
  dateApplied: 'Date Applied',
  details: 'Details',
}

const MANDATORY_COLUMN_KEYS = ['name', 'details']

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
  const { regenerateVerdict, isRegenerating } = useRegenerateVerdict(item.id)

  if (isLoading || isRegenerating) {
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
    ...(item.talent.cvUrl
      ? [
          {
            label: 'View CV',
            onClick: () => window.open(item.talent.cvUrl!, '_blank'),
          },
        ]
      : []),
    ...(!item.matchVerdict
      ? [
          {
            label: 'Regenerate AI Match',
            onClick: () => regenerateVerdict(),
          },
        ]
      : []),
  ]

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      <Link to={`/recruiterDashboard/singleJobPost/${item.jobId}/${item.id}`}>
        <Button size="sm">View Application</Button>
      </Link>
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
    key: 'stage',
    header: COLUMN_LABELS.stage,
    align: 'center',
    toggleable: true,
    render: (item) => getStatusStage(item.status),
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
          />
        </div>
      ),
    sortAccessor: (item) => {
      const order = { high: 0, medium: 1, low: 2 }
      return item.matchVerdict ? order[item.matchVerdict] : Infinity
    },
  },
  {
    key: 'dateApplied',
    header: COLUMN_LABELS.dateApplied,
    align: 'center',
    hideBelow: 768,
    toggleable: true,
    render: (item) => (
      <div>
        <div>{calculateDaysFromCreation(item.createdAt)} days ago</div>
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
      <ApplicantActionsCell
        item={item}
        onShortlist={onShortlist}
        onReject={onReject}
        onMessage={onMessage}
        isLoading={item.id === loadingRowId}
      />
    ),
  },
]

export const SingleJobTable = ({
  applications,
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
}: SingleJobTableProps) => {
  const [aiMatchApplicant, setAiMatchApplicant] =
    React.useState<SingleJobDetails | null>(null)

  const allColumns = buildColumns({
    onShortlist,
    onReject,
    onMessage,
    loadingRowId,
    onOpenAiMatch: setAiMatchApplicant,
  })
  const columns = visibleColumnKeys
    ? allColumns.filter(
        (col) =>
          MANDATORY_COLUMN_KEYS.includes(col.key) ||
          visibleColumnKeys.includes(col.key),
      )
    : allColumns

  return (
    <>
      <DataTable
        columns={columns}
        data={applications}
        getRowKey={(item) => item.id}
        ariaLabel="Job applications table"
        selectedRowKeys={selectedRowKeys}
        onToggleRow={onToggleRow}
        onToggleAll={onToggleAll}
        allowOverflow
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
      {aiMatchApplicant && (
        <AiMatchPanel
          application={aiMatchApplicant}
          onClose={() => setAiMatchApplicant(null)}
        />
      )}
    </>
  )
}
