import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
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
  deleteAdminRecruiter,
  fetchAdminRecruiters,
} from '@/features/admin/services/adminService'
import { AdminRecruiter } from '@/features/admin/types'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { Pagination } from '../../RecruiterProfile/MyJobPosts/Pagination'
import styles from './Recruiters.module.scss'

type SortDirection = 'asc' | 'desc'

interface RecruiterFilterValues {
  search: string
}

const defaultRecruiterFilters: RecruiterFilterValues = {
  search: '',
}

const ROWS_PER_PAGE = 10

const Recruiters = () => {
  const [recruiters, setRecruiters] = useState<AdminRecruiter[]>([])
  const [recruitersLoading, setRecruitersLoading] = useState(true)
  const [recruiterFilters, setRecruiterFilters] =
    useState<RecruiterFilterValues>(defaultRecruiterFilters)
  const [recruiterSortKey, setRecruiterSortKey] = useState('createdAt')
  const [recruiterSortDirection, setRecruiterSortDirection] =
    useState<SortDirection>('desc')
  const [recruiterPage, setRecruiterPage] = useState(1)
  const [recruiterVisibleKeys, setRecruiterVisibleKeys] = useState<string[]>([
    'name',
    'email',
    'phone',
    'createdAt',
  ])
  const [recruiterToDelete, setRecruiterToDelete] =
    useState<AdminRecruiter | null>(null)
  const [isDeletingRecruiter, setIsDeletingRecruiter] = useState(false)

  const loadRecruiters = useCallback(async () => {
    setRecruitersLoading(true)
    try {
      const data = await fetchAdminRecruiters({ limit: 200, offset: 0 })
      setRecruiters(data.users)
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to load recruiters'))
    } finally {
      setRecruitersLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRecruiters()
  }, [loadRecruiters])

  const recruiterFilterFields: FilterFieldConfig<RecruiterFilterValues>[] = [
    {
      type: 'search',
      key: 'search',
      label: 'Search',
      placeholder: 'Name or email',
    },
  ]

  const recruiterColumns: ColumnDef<AdminRecruiter>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        sortLabel: 'Name',
        toggleable: true,
        render: (row) => `${row.firstName} ${row.lastName}`,
        sortAccessor: (row) => `${row.firstName} ${row.lastName}`,
      },
      {
        key: 'email',
        header: 'Email',
        sortLabel: 'Email',
        toggleable: true,
        render: (row) => row.email,
        sortAccessor: (row) => row.email,
      },
      {
        key: 'phone',
        header: 'Phone',
        toggleable: true,
        hideBelow: 900,
        render: (row) => row.phone ?? '—',
      },
      {
        key: 'createdAt',
        header: 'Joined',
        sortLabel: 'Joined',
        toggleable: true,
        hideBelow: 720,
        render: (row) => new Date(row.createdAt).toLocaleDateString(),
        sortAccessor: (row) => row.createdAt,
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
              onClick={() => setRecruiterToDelete(row)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  const visibleRecruiterColumns = recruiterColumns.filter(
    (col) => !col.toggleable || recruiterVisibleKeys.includes(col.key),
  )

  const filteredRecruiters = useMemo(() => {
    const search = recruiterFilters.search.trim().toLowerCase()
    if (!search) return recruiters
    return recruiters.filter((row) => {
      const haystack =
        `${row.firstName} ${row.lastName} ${row.email}`.toLowerCase()
      return haystack.includes(search)
    })
  }, [recruiters, recruiterFilters])

  const sortedRecruiters = useMemo(() => {
    const column = recruiterColumns.find((col) => col.key === recruiterSortKey)
    return column?.sortAccessor
      ? sortByAccessor(
          filteredRecruiters,
          column.sortAccessor,
          recruiterSortDirection,
        )
      : filteredRecruiters
  }, [
    filteredRecruiters,
    recruiterColumns,
    recruiterSortKey,
    recruiterSortDirection,
  ])

  const pagedRecruiters = sortedRecruiters.slice(
    (recruiterPage - 1) * ROWS_PER_PAGE,
    recruiterPage * ROWS_PER_PAGE,
  )

  const handleDeleteRecruiter = async () => {
    if (!recruiterToDelete) return
    setIsDeletingRecruiter(true)
    try {
      await deleteAdminRecruiter(recruiterToDelete.id)
      notify('success', 'Recruiter permanently deleted')
      setRecruiterToDelete(null)
      await loadRecruiters()
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to delete recruiter'))
    } finally {
      setIsDeletingRecruiter(false)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeaderTitle
        title="Recruiters"
        description="Manage every registered recruiter on the platform. Deletions are permanent."
      />

      <p className={styles.sectionDescription}>
        Deleting a recruiter removes their account, posted jobs, applications,
        scout data, messages, and related AI configs.
      </p>

      <div className={styles.layout}>
        <FilterPanel
          fields={recruiterFilterFields}
          filters={recruiterFilters}
          defaultFilters={defaultRecruiterFilters}
          onApply={(next) => {
            setRecruiterFilters(next)
            setRecruiterPage(1)
          }}
          ariaLabel="Filter recruiters"
        />
        <div className={styles.mainColumn}>
          {!recruitersLoading && sortedRecruiters.length === 0 ? (
            <EmptyState
              title="No recruiters found"
              description="Try adjusting filters, or wait for recruiters to register."
            />
          ) : (
            <>
              <TableToolbar
                columns={recruiterColumns}
                resultsCount={sortedRecruiters.length}
                visibleColumnKeys={recruiterVisibleKeys}
                onToggleColumn={(key) =>
                  setRecruiterVisibleKeys((prev) =>
                    prev.includes(key)
                      ? prev.filter((item) => item !== key)
                      : [...prev, key],
                  )
                }
                sortKey={recruiterSortKey}
                sortDirection={recruiterSortDirection}
                onSortChange={(key, direction) => {
                  setRecruiterSortKey(key)
                  setRecruiterSortDirection(direction)
                }}
              />
              <DataTable
                columns={visibleRecruiterColumns}
                data={pagedRecruiters}
                isLoading={recruitersLoading}
                getRowKey={(row) => row.id}
                showRowNumber
                rowNumberOffset={(recruiterPage - 1) * ROWS_PER_PAGE}
                allowOverflow
                ariaLabel="Recruiters table"
              />
              <Pagination
                totalItems={sortedRecruiters.length}
                itemsPerPage={ROWS_PER_PAGE}
                currentPage={recruiterPage}
                onPageChange={setRecruiterPage}
              />
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(recruiterToDelete)}
        title="Permanently delete this recruiter?"
        message={`Deleting ${recruiterToDelete?.firstName ?? ''} ${
          recruiterToDelete?.lastName ?? ''
        } will remove their account, posted jobs, applications, scout data, messages, and all related data. This cannot be undone.`}
        confirmLabel="Delete recruiter"
        variant="danger"
        isConfirming={isDeletingRecruiter}
        onConfirm={() => void handleDeleteRecruiter()}
        onCancel={() => setRecruiterToDelete(null)}
      />
    </div>
  )
}

export default Recruiters
