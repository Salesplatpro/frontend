import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { Button } from '@/components/ui/Button'
import {
  ColumnDef,
  DataTable,
  sortByAccessor,
  TableToolbar,
} from '@/components/ui/DataTable'
import { FilterFieldConfig, FilterPanel } from '@/components/ui/FilterPanel'

import { useGetRecruiterShortlistQuery } from '../../../redux/api/recruiter'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'

interface ShortlistedApplication {
  id: string
  jobId: string
  status: string
  createdAt: string
  role?: { name: string } | null
  talent: { firstName: string; lastName: string }
}

type SortDirection = 'asc' | 'desc'

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
  const [filters, setFilters] = useState<ShortlistFilterValues>(
    defaultShortlistFilters,
  )
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

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
        <Link to={`/recruiterDashboard/singleJobPost/${row.jobId}/${row.id}`}>
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

  return (
    <div className="flex flex-col space-y-6">
      <PageHeaderTitle
        title="Shortlist"
        description="View shortlisted talents ready for the next stage"
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
            ariaLabel="Shortlisted applications"
            emptyState={
              <div className="p-4 text-gray-500 text-center">
                No shortlisted applications yet
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}
