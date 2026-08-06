import 'react-responsive-modal/styles.css'

import React, { useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker'
import Modal from 'react-responsive-modal'
import { useLocation, useParams } from 'react-router-dom'

import { BackButton } from '@/components/ui/BackButton'
import { Button } from '@/components/ui/Button'
import { sortByAccessor, TableToolbar } from '@/components/ui/DataTable'
import { FilterFieldConfig, FilterPanel } from '@/components/ui/FilterPanel'
import { Spinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import { useBulkUpdateApplicationStatus } from '@/features/applications/hooks/useBulkUpdateApplicationStatus'
import { useJobApplications } from '@/features/applications/hooks/useJobApplications'
import { useBroadcastMessage } from '@/features/messaging/hooks/useBroadcastMessage'
import { notify } from '@/utils/toastNotifications'

import { calculateDaysFromCreation, SingleJobDetails } from '../../../utils'
import {
  exportRankingPdf,
  RankingExportMode,
  selectRankedApplicants,
} from './exportRankingPdf'
import { Pagination } from './Pagination'
import styles from './SingleJobPost.module.scss'
import { buildColumns, SingleJobTable } from './SingleJobTable'

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
  const { data, error, isLoading, mutate } = useJobApplications(jobId)
  const location = useLocation()
  const jobName = location.state?.jobName
  const postedAt = location.state?.postedAt
  const applications = data?.data?.applications ?? []

  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(new Set())
  const [loadingRowId, setLoadingRowId] = useState<string | null>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [messageContent, setMessageContent] = useState('')

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
  const [sortKey, setSortKey] = useState('dateApplied')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [rankingMode, setRankingMode] = useState<RankingExportMode>('top')
  const [rankingCount, setRankingCount] = useState('5')

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

  const handleRankingPdfExport = () => {
    const count = Number(rankingCount)
    if (!Number.isFinite(count) || count < 1) {
      notify('error', 'Enter how many candidates to include', {
        autoClose: 2000,
      })
      return
    }

    const selected = selectRankedApplicants(applications, rankingMode, count)
    if (selected.length === 0) {
      notify('error', 'No ranked candidates available for export', {
        autoClose: 2000,
      })
      return
    }

    try {
      exportRankingPdf({
        jobName: jobName || 'Job',
        mode: rankingMode,
        count,
        applicants: selected,
      })
    } catch (err) {
      notify(
        'error',
        err instanceof Error ? err.message : 'Failed to export ranking PDF',
        { autoClose: 3000 },
      )
    }
  }

  if (error) {
    return <div>Error loading job details</div>
  }

  if (isLoading) {
    return <Spinner fullPage />
  }

  return (
    <div className={styles.container}>
      <BackButton />
      <div className={styles.topContainer}>
        <div className={styles.title}>
          {jobName}
          <span className={styles.applicants}>
            {applications.length || 0}{' '}
            {applications.length > 1 ? 'applicants' : 'applicant'}
          </span>
        </div>
        <div>Posted {calculateDaysFromCreation(postedAt)} days ago</div>
      </div>

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
                  onClick={() => handleBulkStatus('shortlisted')}>
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
            <label className={styles.rankingLabel} htmlFor="ranking-mode">
              Ranking export
            </label>
            <select
              id="ranking-mode"
              className={styles.rankingSelect}
              value={rankingMode}
              onChange={(event) =>
                setRankingMode(event.target.value as RankingExportMode)
              }>
              <option value="top">Top ranked</option>
              <option value="lowest">Lowest ranked</option>
            </select>
            <input
              id="ranking-count"
              className={styles.rankingCount}
              type="number"
              min={1}
              value={rankingCount}
              onChange={(event) => setRankingCount(event.target.value)}
              aria-label="Number of candidates"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRankingPdfExport}>
              Download PDF
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
                : 'dateApplied'
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
            selectedRowKeys={selectedRowKeys}
            onToggleRow={handleToggleRow}
            onToggleAll={handleToggleAll}
            onShortlist={(id) => handleRowStatus(id, 'shortlisted')}
            onReject={(id) => handleRowStatus(id, 'rejected')}
            onMessage={handleRowMessage}
            loadingRowId={loadingRowId}
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
    </div>
  )
}
