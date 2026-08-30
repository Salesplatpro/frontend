import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import {
  ColumnDef,
  DataTable,
  sortByAccessor,
  TableToolbar,
} from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { FilterFieldConfig, FilterPanel } from '@/components/ui/FilterPanel'
import { VerdictBadge } from '@/components/ui/VerdictBadge'
import { useBroadcastMessage } from '@/features/messaging/hooks/useBroadcastMessage'
import { notify } from '@/utils/toastNotifications'

import { useGetRecruiterShortlistQuery } from '../../../redux/api/recruiter'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'

interface ShortlistedApplication {
  id: string
  jobId: string
  status: string
  createdAt: string
  role?: { name: string } | null
  talent: { id: string; firstName: string; lastName: string }
  matchVerdict?: 'high' | 'medium' | 'low' | null
  averageScore?: number | null
}

type SortDirection = 'asc' | 'desc'

// high -> medium -> low -> no verdict, mirroring SingleJobTable's ordering.
const VERDICT_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }
const verdictRank = (verdict: ShortlistedApplication['matchVerdict']) =>
  verdict ? VERDICT_ORDER[verdict] : 3
// Single numeric key encoding "verdict order, then averageScore desc" so a
// single-key sortByAccessor can express both levels at once.
const verdictSortValue = (row: ShortlistedApplication) =>
  verdictRank(row.matchVerdict) * 1000 + (100 - (row.averageScore ?? 0))

interface ShortlistFilterValues {
  search: string
}

const defaultShortlistFilters: ShortlistFilterValues = { search: '' }

const SHORTLIST_FILTER_FIELDS: FilterFieldConfig<ShortlistFilterValues>[] = [
  {
    type: 'search',
    key: 'search',
    label: 'Search',
    placeholder: 'Search by talent name',
  },
]

export const Shortlist = () => {
  const { data, isLoading } = useGetRecruiterShortlistQuery({})
  const { sendBroadcast, isBroadcasting } = useBroadcastMessage()
  const [filters, setFilters] = useState<ShortlistFilterValues>(
    defaultShortlistFilters,
  )
  const [sortKey, setSortKey] = useState('verdict')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(new Set())
  const [messageOpen, setMessageOpen] = useState(false)
  const [messageContent, setMessageContent] = useState('')

  const handleSortChange = (key: string, direction: SortDirection) => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const applicationsRaw: ShortlistedApplication[] = Array.isArray(
    data?.data?.applications,
  )
    ? data.data.applications
    : []

  const query = filters.search.trim().toLowerCase()
  const filteredApplications = query
    ? applicationsRaw.filter((row) =>
        `${row.talent.firstName} ${row.talent.lastName}`
          .toLowerCase()
          .includes(query),
      )
    : applicationsRaw

  const columns: ColumnDef<ShortlistedApplication>[] = [
    {
      key: 'role',
      header: 'Role',
      sortLabel: 'Role',
      render: (row) => capitalizeEachWord(row.role?.name ?? 'Unknown role'),
      sortAccessor: (row) => row.role?.name,
    },
    {
      key: 'talent',
      header: 'Talent Name',
      sortLabel: 'Talent Name',
      render: (row) => `${row.talent.firstName} ${row.talent.lastName}`,
      sortAccessor: (row) => `${row.talent.firstName} ${row.talent.lastName}`,
    },
    {
      key: 'verdict',
      header: 'AI Match',
      sortLabel: 'AI Match',
      align: 'center',
      render: (row) => (
        <VerdictBadge verdict={row.matchVerdict ?? null} compact />
      ),
      sortAccessor: verdictSortValue,
    },
    {
      key: 'status',
      header: 'Status',
      hideBelow: 768,
      render: (row) => capitalizeEachWord(row.status.replace(/_/g, ' ')),
    },
    {
      key: 'createdAt',
      header: 'Shortlisted On',
      sortLabel: 'Shortlisted On',
      hideBelow: 640,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortAccessor: (row) => row.createdAt,
    },
    {
      key: 'actions',
      header: '',
      align: 'center',
      render: (row) => (
        <Link
          to={`/recruiterDashboard/singleJobPost/${row.jobId}?applicationId=${row.id}`}>
          <Button size="sm">Details</Button>
        </Link>
      ),
    },
  ]

  const sortColumn = columns.find((col) => col.key === sortKey)
  const applications = sortColumn?.sortAccessor
    ? sortByAccessor(
        filteredApplications,
        sortColumn.sortAccessor,
        sortDirection,
      )
    : filteredApplications

  const handleMessageSelected = async () => {
    if (!messageContent.trim()) {
      notify('error', 'Message cannot be empty', { autoClose: 2000 })
      return
    }
    const selected = applications.filter((row) => selectedRowKeys.has(row.id))
    if (selected.length === 0) return
    const byJob = new Map<string, ShortlistedApplication[]>()
    for (const row of selected) {
      const list = byJob.get(row.jobId) ?? []
      list.push(row)
      byJob.set(row.jobId, list)
    }
    try {
      for (const rows of byJob.values()) {
        const first = rows[0]
        if (!first) continue
        await sendBroadcast({
          application: first.id,
          content: messageContent,
          talentIds: rows.map((row) => row.talent.id),
        })
      }
      notify('success', 'Message sent to selected talents', { autoClose: 2000 })
      setMessageContent('')
      setMessageOpen(false)
      setSelectedRowKeys(new Set())
    } catch {
      notify('error', 'Failed to send message', { autoClose: 2000 })
    }
  }

  return (
    <PageShell wide>
      <PageHero
        compact
        title="Shortlist"
        lead="View shortlisted talents ready for the next stage"
      />
      <div className="flex flex-col md:flex-row gap-5 items-start">
        <FilterPanel
          fields={SHORTLIST_FILTER_FIELDS}
          filters={filters}
          defaultFilters={defaultShortlistFilters}
          onApply={setFilters}
          ariaLabel="Filter shortlist"
        />
        <div className="flex flex-col gap-3 min-w-0 flex-1">
          <TableToolbar
            columns={columns}
            resultsCount={applications.length}
            visibleColumnKeys={[]}
            onToggleColumn={() => {}}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
          <DataTable
            columns={columns}
            data={applications}
            isLoading={isLoading}
            getRowKey={(row) => row.id}
            selectedRowKeys={selectedRowKeys}
            onToggleRow={(key) => {
              setSelectedRowKeys((prev) => {
                const next = new Set(prev)
                const id = String(key)
                if (next.has(id)) next.delete(id)
                else next.add(id)
                return next
              })
            }}
            onToggleAll={(keys) =>
              setSelectedRowKeys(new Set(keys.map(String)))
            }
            ariaLabel="Shortlisted applications"
            emptyState={
              <EmptyState
                title="No shortlisted applications yet"
                description="Shortlist strong applicants from a job post and they will land here, ready for the next conversation."
              />
            }
          />
          {selectedRowKeys.size > 0 && (
            <div className="flex justify-end">
              <Button
                size="sm"
                loading={isBroadcasting}
                onClick={() => setMessageOpen(true)}>
                Message selected
              </Button>
            </div>
          )}
          {messageOpen && (
            <div className="flex flex-col gap-3">
              <textarea
                className="w-full min-h-[120px] border rounded-lg p-3"
                placeholder="Type your message..."
                value={messageContent}
                onChange={(event) => setMessageContent(event.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setMessageOpen(false)}>
                  Cancel
                </Button>
                <Button
                  loading={isBroadcasting}
                  onClick={handleMessageSelected}>
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
