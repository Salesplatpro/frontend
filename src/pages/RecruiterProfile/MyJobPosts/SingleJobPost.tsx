import 'react-responsive-modal/styles.css'

import React, { useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import Modal from 'react-responsive-modal'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import { HeroGhost, PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { BackButton } from '@/components/ui/BackButton'
import { Button } from '@/components/ui/Button'
import { sortByAccessor, TableToolbar } from '@/components/ui/DataTable'
import { FilterFieldConfig, FilterPanel } from '@/components/ui/FilterPanel'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import { useBulkUpdateApplicationStatus } from '@/features/applications/hooks/useBulkUpdateApplicationStatus'
import { useJobApplications } from '@/features/applications/hooks/useJobApplications'
import {
  regenerateVerdict,
  retryMissingVerdicts,
} from '@/features/applications/services/applicationService'
import { useBroadcastMessage } from '@/features/messaging/hooks/useBroadcastMessage'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { calculateDaysFromCreation, SingleJobDetails } from '../../../utils'
import { CandidateDossierPanel } from './CandidateDossierPanel'
import { exportBoardReport } from './exportRankingPdf'
import { Pagination } from './Pagination'
import styles from './SingleJobPost.module.scss'
import {
  buildColumns,
  compareByAiMatch,
  SingleJobTable,
} from './SingleJobTable'

export type CvRankingTier = 'all' | 'top3' | 'top5' | 'top10' | 'unranked'
export type AiMatchLevel =
  | 'all'
  | 'any'
  | 'high'
  | 'medium'
  | 'low'
  | 'unavailable'

export interface ApplicantFiltersValues {
  search: string
  cvRankingTier: CvRankingTier
  aiMatchLevel: AiMatchLevel
  dateRange?: DateRange
}

const defaultApplicantFilters: ApplicantFiltersValues = {
  search: '',
  cvRankingTier: 'all',
  aiMatchLevel: 'all',
  dateRange: undefined,
}

const APPLICANT_FILTER_FIELDS: FilterFieldConfig<ApplicantFiltersValues>[] = [
  {
    type: 'search',
    key: 'search',
    label: 'Search',
    placeholder: 'Search by name or email',
  },
  {
    type: 'select',
    key: 'cvRankingTier',
    label: 'CV Ranking',
    offValue: 'all',
    options: [
      { label: 'All Rankings', value: 'all' },
      { label: 'Top 3', value: 'top3' },
      { label: 'Top 5', value: 'top5' },
      { label: 'Top 10', value: 'top10' },
      { label: 'Not Yet Ranked', value: 'unranked' },
    ],
  },
  {
    type: 'select',
    key: 'aiMatchLevel',
    label: 'AI Match',
    offValue: 'all',
    options: [
      { label: 'All Match Levels', value: 'all' },
      { label: 'Strong', value: 'high' },
      { label: 'Good', value: 'medium' },
      { label: 'Weak', value: 'low' },
      { label: 'Not Available', value: 'unavailable' },
    ],
    pills: [
      { label: 'With AI Match', value: 'any' },
      { label: 'No AI Match', value: 'unavailable' },
    ],
  },
  {
    type: 'dateRange',
    key: 'dateRange',
    label: 'Date Applied',
    quickRanges: [
      { label: 'Today', days: 0 },
      { label: 'This Week', days: 7 },
      { label: 'This Month', days: 30 },
    ],
  },
]

type StatusTab = 'all' | 'shortlisted' | 'pending' | 'rejected'

const matchesStatusTab = (item: SingleJobDetails, tab: StatusTab) => {
  if (tab === 'all') return true
  if (tab === 'shortlisted') return item.status === 'shortlisted'
  if (tab === 'rejected') return item.status === 'rejected'
  return item.status !== 'shortlisted' && item.status !== 'rejected'
}

const CV_RANK_TIER_LIMIT = { top3: 3, top5: 5, top10: 10 } as const

const matchesFilters = (
  item: SingleJobDetails,
  filters: ApplicantFiltersValues,
) => {
  if (filters.search) {
    const haystack =
      `${item.talent.firstName} ${item.talent.lastName} ${item.talent.email}`.toLowerCase()
    if (!haystack.includes(filters.search.trim().toLowerCase())) return false
  }

  if (filters.cvRankingTier === 'unranked' && item.rank != null) return false
  if (filters.cvRankingTier in CV_RANK_TIER_LIMIT) {
    const limit =
      CV_RANK_TIER_LIMIT[
        filters.cvRankingTier as keyof typeof CV_RANK_TIER_LIMIT
      ]
    if (!item.rank || item.rank > limit) return false
  }

  if (filters.aiMatchLevel === 'any' && !item.matchVerdict) return false
  if (filters.aiMatchLevel === 'unavailable' && item.matchVerdict) return false
  if (
    filters.aiMatchLevel !== 'all' &&
    filters.aiMatchLevel !== 'any' &&
    filters.aiMatchLevel !== 'unavailable' &&
    item.matchVerdict !== filters.aiMatchLevel
  ) {
    return false
  }

  if (filters.dateRange?.from) {
    const appliedAt = new Date(item.createdAt).getTime()
    if (appliedAt < filters.dateRange.from.getTime()) return false
    if (filters.dateRange.to && appliedAt > filters.dateRange.to.getTime()) {
      return false
    }
  }

  return true
}

const PAGE_SIZE_OPTIONS = [10, 25, 50]

export const SingleJobPost = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { profile } = useProfile()
  const { data, error, isLoading, mutate } = useJobApplications(jobId)
  const location = useLocation()
  const jobName = location.state?.jobName
  const postedAt = location.state?.postedAt
  const applications = data?.data?.applications ?? []
  const jobAiConfig = data?.data?.aiConfig ?? null

  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(new Set())
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [messageContent, setMessageContent] = useState('')
  const [isMissingVerdictModalOpen, setIsMissingVerdictModalOpen] =
    useState(false)
  const [isRetryingVerdicts, setIsRetryingVerdicts] = useState(false)
  const [isRetryingAllVerdicts, setIsRetryingAllVerdicts] = useState(false)

  // Column defs with no-op action callbacks — only used here to derive
  // toolbar metadata (toggleable/sortable keys, labels) from the same
  // source of truth SingleJobTable renders from, so they can't drift.
  const toolbarColumns = useMemo(
    () =>
      buildColumns({
        onShortlist: () => {},
        onReject: () => {},
        onMessage: () => {},
      }),
    [],
  )

  const [statusTab, setStatusTab] = useState<StatusTab>('all')
  const [filters, setFilters] = useState<ApplicantFiltersValues>(
    defaultApplicantFilters,
  )
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(() =>
    toolbarColumns.filter((col) => col.toggleable).map((col) => col.key),
  )
  const [sortKey, setSortKey] = useState('aiMatch')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])

  const { bulkUpdateStatus, isBulkUpdating } = useBulkUpdateApplicationStatus()
  const { sendBroadcast, isBroadcasting } = useBroadcastMessage()

  const clearSelection = () => setSelectedRowKeys(new Set())

  const handleToggleRow = (key: string | number) => {
    setSelectedRowKeys((prev) => {
      const next = new Set(prev)
      if (next.has(String(key))) {
        next.delete(String(key))
      } else {
        next.add(String(key))
      }
      return next
    })
  }

  const handleToggleAll = (keys: (string | number)[]) => {
    setSelectedRowKeys(new Set(keys.map(String)))
  }

  const handleBulkStatus = async (status: 'shortlisted' | 'rejected') => {
    try {
      const result = await bulkUpdateStatus({
        applicationIds: Array.from(selectedRowKeys),
        status,
      })
      notify('success', `${result.data.updated} talent(s) ${status}`, {
        autoClose: 2000,
      })
      clearSelection()
      await mutate()
    } catch {
      notify('error', `Failed to update talent statuses`, { autoClose: 2000 })
    }
  }

  const getMissingVerdictIds = (keys: Set<string>) =>
    applications
      .filter(
        (item) =>
          keys.has(item.id) &&
          item.currentStage === 'completed' &&
          !item.matchVerdict,
      )
      .map((item) => item.id)

  const handleShortlistClick = () => {
    if (getMissingVerdictIds(selectedRowKeys).length > 0) {
      setIsMissingVerdictModalOpen(true)
      return
    }
    void handleBulkStatus('shortlisted')
  }

  // Retries a fixed set of application ids with a small concurrency limit —
  // used for both the bulk-selection confirm modal and the toolbar's
  // "retry all missing" button, so the AI provider isn't hit with an
  // unbounded burst of requests.
  const retryVerdictsForIds = async (ids: string[]) => {
    const CONCURRENCY = 3
    for (let i = 0; i < ids.length; i += CONCURRENCY) {
      const batch = ids.slice(i, i + CONCURRENCY)
      await Promise.all(batch.map((id) => regenerateVerdict(id)))
    }
  }

  const handleRetryMissingForSelection = async () => {
    const ids = getMissingVerdictIds(selectedRowKeys)
    setIsRetryingVerdicts(true)
    try {
      await retryVerdictsForIds(ids)
      notify('success', 'AI matches retried for selected talents', {
        autoClose: 2000,
      })
      await mutate()
    } catch {
      notify('error', 'Failed to retry some AI matches', { autoClose: 2000 })
    } finally {
      setIsRetryingVerdicts(false)
      setIsMissingVerdictModalOpen(false)
    }
  }

  const handleRetryAllMissingVerdicts = async () => {
    if (!jobId) return
    setIsRetryingAllVerdicts(true)
    try {
      const result = await retryMissingVerdicts(jobId)
      notify(
        'success',
        `Retried ${result.attempted} — ${result.succeeded} succeeded, ${result.failed} failed`,
        { autoClose: 3000 },
      )
      await mutate()
    } catch (err) {
      notify(
        'error',
        getErrorMessage(err, 'Failed to retry missing AI matches'),
        { autoClose: 2000 },
      )
    } finally {
      setIsRetryingAllVerdicts(false)
    }
  }

  const handleRowStatus = async (
    applicationId: string,
    status: 'shortlisted' | 'rejected',
  ) => {
    setLoadingRowId(applicationId)
    try {
      await bulkUpdateStatus({ applicationIds: [applicationId], status })
      notify('success', `Talent is ${status}`, { autoClose: 2000 })
      await mutate()
    } catch {
      notify('error', 'Failed to update talent status', { autoClose: 2000 })
    } finally {
      setLoadingRowId(null)
    }
  }

  const handleRowMessage = (applicationId: string) => {
    setSelectedRowKeys(new Set([applicationId]))
    setIsMessageModalOpen(true)
  }

  const handleSendBulkMessage = async () => {
    if (!messageContent.trim()) {
      notify('error', 'Message cannot be empty', { autoClose: 2000 })
      return
    }
    const [firstApplicationId] = Array.from(selectedRowKeys)
    if (!firstApplicationId) return

    try {
      await sendBroadcast({
        application: firstApplicationId,
        content: messageContent,
        talentIds: applications
          .filter((application) => selectedRowKeys.has(application.id))
          .map((application) => application.talent.id),
      })
      notify('success', 'Message sent to selected talents', { autoClose: 2000 })
      setMessageContent('')
      setIsMessageModalOpen(false)
      clearSelection()
    } catch {
      notify('error', 'Failed to send message', { autoClose: 2000 })
    }
  }

  const handleMessageShortlisted = () => {
    const shortlisted = applications.filter(
      (item) => item.status === 'shortlisted',
    )
    if (shortlisted.length === 0) {
      notify('error', 'No shortlisted applicants on this job', {
        autoClose: 2000,
      })
      return
    }
    setSelectedRowKeys(new Set(shortlisted.map((item) => item.id)))
    setIsMessageModalOpen(true)
  }

  const openDossier = (item: SingleJobDetails) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('applicationId', item.id)
      return next
    })
  }

  const closeDossier = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('applicationId')
      return next
    })
  }

  const dossierApplication = applications.find(
    (item) => item.id === searchParams.get('applicationId'),
  )

  const handleBoardPdf = (scope: 'selected' | 'all') => {
    const rows =
      scope === 'selected'
        ? sortedApplications.filter((item) => selectedRowKeys.has(item.id))
        : sortedApplications
    if (rows.length === 0) {
      notify('error', 'No applicants to include in this report', {
        autoClose: 2000,
      })
      return
    }
    try {
      exportBoardReport({
        recruiterName: `${profile?.firstName ?? ''} ${
          profile?.lastName ?? ''
        }`.trim(),
        jobTitle: jobName || 'Job',
        companyName: profile?.activeOrganization?.name ?? '',
        companyLogoUrl: profile?.activeOrganization?.logoUrl,
        applicants: rows,
        totalApplicants: applications.length,
        scopeLabel:
          scope === 'selected' ? 'Selected candidates' : 'Filtered applicants',
      })
    } catch (err) {
      notify(
        'error',
        err instanceof Error ? err.message : 'Failed to export report',
        { autoClose: 3000 },
      )
    }
  }

  const missingVerdictCount = useMemo(
    () =>
      applications.filter(
        (item) => item.currentStage === 'completed' && !item.matchVerdict,
      ).length,
    [applications],
  )

  const tabCounts = useMemo(
    () => ({
      all: applications.length,
      shortlisted: applications.filter((item) => item.status === 'shortlisted')
        .length,
      pending: applications.filter(
        (item) => item.status !== 'shortlisted' && item.status !== 'rejected',
      ).length,
      rejected: applications.filter((item) => item.status === 'rejected')
        .length,
    }),
    [applications],
  )

  const filteredApplications = useMemo(
    () =>
      applications
        .filter((item) => matchesStatusTab(item, statusTab))
        .filter((item) => matchesFilters(item, filters)),
    [applications, statusTab, filters],
  )

  const sortedApplications = useMemo(() => {
    if (sortKey === 'aiMatch') {
      // Best AI match first, tie-broken by average score then recency — a
      // single-key sortAccessor can't express that, so this bypasses it.
      const sorted = [...filteredApplications].sort(compareByAiMatch)
      return sortDirection === 'asc' ? sorted : sorted.reverse()
    }
    const column = toolbarColumns.find((col) => col.key === sortKey)
    if (!column?.sortAccessor) return filteredApplications
    return sortByAccessor(
      filteredApplications,
      column.sortAccessor,
      sortDirection,
    )
  }, [filteredApplications, sortKey, sortDirection, toolbarColumns])

  const paginatedApplications = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedApplications.slice(start, start + pageSize)
  }, [sortedApplications, page, pageSize])

  const handleFiltersApply = (next: ApplicantFiltersValues) => {
    setFilters(next)
    setPage(1)
  }

  const handleStatusTabChange = (tab: string) => {
    setStatusTab(tab as StatusTab)
    setPage(1)
  }

  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const handleToggleColumn = (key: string) => {
    setVisibleColumnKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  if (error) {
    return <div>Error loading job details</div>
  }

  if (isLoading) {
    return <Spinner fullPage />
  }

  return (
    <PageShell wide>
      <BackButton />
      <PageHero
        compact
        title={jobName}
        lead={`${applications.length || 0} ${
          applications.length > 1 ? 'applicants' : 'applicant'
        } · Posted ${calculateDaysFromCreation(postedAt)} days ago`}
        actions={
          <>
            {missingVerdictCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                loading={isRetryingAllVerdicts}
                onClick={handleRetryAllMissingVerdicts}>
                Retry all missing AI matches ({missingVerdictCount})
              </Button>
            )}
            <HeroGhost onClick={handleMessageShortlisted}>
              Message all shortlisted
            </HeroGhost>
            <HeroGhost
              onClick={() =>
                navigate(
                  `/recruiterDashboard/talent-search/results?jobId=${jobId}`,
                )
              }>
              Find matching talent
            </HeroGhost>
          </>
        }
      />

      <div className={styles.layout}>
        <FilterPanel
          fields={APPLICANT_FILTER_FIELDS}
          filters={filters}
          defaultFilters={defaultApplicantFilters}
          onApply={handleFiltersApply}
          ariaLabel="Filter applicants"
        />

        <div className={styles.mainColumn}>
          <Tabs
            tabs={[
              { key: 'all', label: 'All', count: tabCounts.all },
              {
                key: 'shortlisted',
                label: 'Shortlisted',
                count: tabCounts.shortlisted,
              },
              { key: 'pending', label: 'Pending', count: tabCounts.pending },
              {
                key: 'rejected',
                label: 'Rejected',
                count: tabCounts.rejected,
              },
            ]}
            activeKey={statusTab}
            onChange={handleStatusTabChange}
          />

          {selectedRowKeys.size > 0 && (
            <div className={styles.bulkBar}>
              <div className={styles.bulkBarCount}>
                {selectedRowKeys.size} selected
              </div>
              <div className={styles.bulkBarActions}>
                <Button
                  variant="outline"
                  size="sm"
                  loading={isBulkUpdating}
                  onClick={() => handleBulkStatus('rejected')}>
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={isBulkUpdating}
                  onClick={handleShortlistClick}>
                  Shortlist
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMessageModalOpen(true)}>
                  Message
                </Button>
              </div>
            </div>
          )}

          <div className={styles.rankingExport}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBoardPdf('selected')}>
              Download report (selected)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBoardPdf('all')}>
              Download report (all)
            </Button>
          </div>

          <TableToolbar
            columns={toolbarColumns}
            resultsCount={sortedApplications.length}
            visibleColumnKeys={visibleColumnKeys}
            onToggleColumn={handleToggleColumn}
            sortKey={
              toolbarColumns.some(
                (col) => col.key === sortKey && col.sortAccessor,
              )
                ? sortKey
                : 'aiMatch'
            }
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            exportConfig={{
              rows: sortedApplications,
              headers: [
                'Name',
                'Email',
                'Job Status',
                'CV Ranking',
                'AI Match',
                'Date Applied',
              ],
              toCsvRow: (item) => [
                `${item.talent.firstName} ${item.talent.lastName}`,
                item.talent.email,
                item.status,
                item.rank ? `#${item.rank}` : '',
                item.matchVerdict ?? '',
                new Date(item.createdAt).toISOString(),
              ],
              filename: 'applicants.csv',
            }}
          />

          <SingleJobTable
            applications={paginatedApplications}
            jobAiConfig={jobAiConfig}
            selectedRowKeys={selectedRowKeys}
            onToggleRow={handleToggleRow}
            onToggleAll={handleToggleAll}
            onShortlist={(id) => handleRowStatus(id, 'shortlisted')}
            onReject={(id) => handleRowStatus(id, 'rejected')}
            onMessage={handleRowMessage}
            onOpenDossier={openDossier}
            loadingRowId={loadingRowId}
            onVerdictRegenerated={async () => {
              await mutate()
            }}
            visibleColumnKeys={visibleColumnKeys}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />

          <Pagination
            totalItems={sortedApplications.length}
            itemsPerPage={pageSize}
            currentPage={page}
            onPageChange={setPage}
            itemsPerPageOptions={PAGE_SIZE_OPTIONS}
            onItemsPerPageChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </div>
      </div>

      <Modal
        open={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        center>
        <div>
          <h2 className={styles.modalTitle}>
            Message {selectedRowKeys.size} talent
            {selectedRowKeys.size > 1 ? 's' : ''}
          </h2>
          <textarea
            className={styles.modalTextarea}
            placeholder="Type your message..."
            value={messageContent}
            onChange={(event) => setMessageContent(event.target.value)}
          />
          <div className={styles.modalActions}>
            <Button
              variant="outline"
              onClick={() => setIsMessageModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={isBroadcasting}
              onClick={handleSendBulkMessage}>
              Send
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isMissingVerdictModalOpen}
        onClose={() => setIsMissingVerdictModalOpen(false)}
        center>
        <div>
          <h2 className={styles.modalTitle}>
            {getMissingVerdictIds(selectedRowKeys).length} selected have no AI
            match. Shortlist anyway?
          </h2>
          <div className={styles.modalActions}>
            <Button
              variant="outline"
              loading={isRetryingVerdicts}
              onClick={handleRetryMissingForSelection}>
              Retry matches first
            </Button>
            <Button
              variant="primary"
              loading={isBulkUpdating}
              onClick={() => {
                setIsMissingVerdictModalOpen(false)
                void handleBulkStatus('shortlisted')
              }}>
              Shortlist anyway
            </Button>
          </div>
        </div>
      </Modal>
      {dossierApplication && (
        <CandidateDossierPanel
          application={dossierApplication}
          jobAiConfig={jobAiConfig}
          onClose={closeDossier}
          onChanged={async () => {
            await mutate()
          }}
        />
      )}
    </PageShell>
  )
}
