import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  ColumnDef,
  DataTable,
  sortByAccessor,
  TableToolbar,
} from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { FilterFieldConfig, FilterPanel } from '@/components/ui/FilterPanel'
import {
  fetchAdminFeedback,
  markFeedbackRead,
  markFeedbackUnread,
} from '@/features/admin/services/adminService'
import { AdminFeedback } from '@/features/admin/types'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { Pagination } from '../../RecruiterProfile/MyJobPosts/Pagination'
import styles from './Feedback.module.scss'

type SortDirection = 'asc' | 'desc'

interface FeedbackFilterValues {
  isRead: string
}

const defaultFeedbackFilters: FeedbackFilterValues = {
  isRead: '',
}

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Unread', value: 'false' },
  { label: 'Read', value: 'true' },
]

const ROWS_PER_PAGE = 10

const Feedback = () => {
  const [feedback, setFeedback] = useState<AdminFeedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<FeedbackFilterValues>(
    defaultFeedbackFilters,
  )
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [page, setPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchAdminFeedback({ limit: 200, skip: 0 })
      setFeedback(data.feedback)
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to load feedback'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filterFields: FilterFieldConfig<FeedbackFilterValues>[] = [
    {
      type: 'select',
      key: 'isRead',
      label: 'Status',
      offValue: '',
      options: STATUS_OPTIONS,
    },
  ]

  const handleToggleRead = async (row: AdminFeedback) => {
    setUpdatingId(row.id)
    try {
      if (row.isRead) {
        await markFeedbackUnread(row.id)
        notify('success', 'Marked as unread')
      } else {
        await markFeedbackRead(row.id)
        notify('success', 'Marked as read')
      }
      await load()
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to update feedback'))
    } finally {
      setUpdatingId(null)
    }
  }

  const columns: ColumnDef<AdminFeedback>[] = useMemo(
    () => [
      {
        key: 'submittedBy',
        header: 'Submitted by',
        sortLabel: 'Submitted by',
        render: (row) =>
          row.user ? `${row.user.firstName} ${row.user.lastName}` : '—',
        sortAccessor: (row) =>
          row.user ? `${row.user.firstName} ${row.user.lastName}` : '',
      },
      {
        key: 'email',
        header: 'Email',
        hideBelow: 900,
        render: (row) => row.user?.email ?? '—',
      },
      {
        key: 'message',
        header: 'Subject / Message',
        render: (row) => (
          <span className={styles.messagePreview}>
            {row.subject && (
              <span className={styles.subject}>{row.subject}: </span>
            )}
            {row.message}
          </span>
        ),
      },
      {
        key: 'createdAt',
        header: 'Submitted',
        sortLabel: 'Submitted',
        hideBelow: 720,
        render: (row) => new Date(row.createdAt).toLocaleString(),
        sortAccessor: (row) => row.createdAt,
      },
      {
        key: 'status',
        header: 'Status',
        sortLabel: 'Status',
        render: (row) =>
          row.isRead ? (
            <StatusBadge
              status="Read"
              backgroundColor="#edfeee"
              color="#2e9e4f"
            />
          ) : (
            <StatusBadge
              status="Unread"
              backgroundColor="#fff4e2"
              color="#fbb241"
            />
          ),
        sortAccessor: (row) => (row.isRead ? 1 : 0),
      },
      {
        key: 'actions',
        header: '',
        align: 'right',
        render: (row) => (
          <div className={styles.actions}>
            <Button
              variant="secondary"
              size="sm"
              disabled={updatingId === row.id}
              onClick={() => handleToggleRead(row)}>
              {row.isRead ? 'Mark unread' : 'Mark read'}
            </Button>
          </div>
        ),
      },
    ],
    [updatingId],
  )

  const filteredFeedback = useMemo(() => {
    if (filters.isRead === '') return feedback
    const isRead = filters.isRead === 'true'
    return feedback.filter((row) => row.isRead === isRead)
  }, [feedback, filters])

  const sortedFeedback = useMemo(() => {
    const column = columns.find((col) => col.key === sortKey)
    return column?.sortAccessor
      ? sortByAccessor(filteredFeedback, column.sortAccessor, sortDirection)
      : filteredFeedback
  }, [filteredFeedback, columns, sortKey, sortDirection])

  const pagedFeedback = sortedFeedback.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  )

  return (
    <div className={styles.page}>
      <PageHeaderTitle
        title="Feedback"
        description="Review feedback submitted by users from within the app."
      />

      <div className={styles.layout}>
        <FilterPanel
          fields={filterFields}
          filters={filters}
          defaultFilters={defaultFeedbackFilters}
          onApply={(next) => {
            setFilters(next)
            setPage(1)
          }}
          ariaLabel="Filter feedback"
        />
        <div className={styles.mainColumn}>
          {!isLoading && sortedFeedback.length === 0 ? (
            <EmptyState
              title="No feedback found"
              description="Try adjusting filters, or wait for users to submit feedback."
            />
          ) : (
            <>
              <TableToolbar
                columns={columns}
                resultsCount={sortedFeedback.length}
                visibleColumnKeys={columns.map((col) => col.key)}
                onToggleColumn={() => {}}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSortChange={(key, direction) => {
                  setSortKey(key)
                  setSortDirection(direction)
                }}
              />
              <DataTable
                columns={columns}
                data={pagedFeedback}
                isLoading={isLoading}
                getRowKey={(row) => row.id}
                showRowNumber
                rowNumberOffset={(page - 1) * ROWS_PER_PAGE}
                allowOverflow
                ariaLabel="Feedback table"
              />
              <Pagination
                totalItems={sortedFeedback.length}
                itemsPerPage={ROWS_PER_PAGE}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Feedback
