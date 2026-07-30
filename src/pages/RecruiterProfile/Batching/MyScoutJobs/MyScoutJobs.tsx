import React, { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { ColumnDef, DataTable } from '@/components/ui/DataTable'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  useDeleteScoutJobMutation,
  useGetScoutJobsQuery,
} from '@/redux/api/recruiter'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { Pagination } from '../../MyJobPosts/Pagination'

interface ScoutJobRow {
  id: string
  name: string
  role?: { name: string } | null
  createdAt: string
}

const ROWS_PER_PAGE = 10

const ActionsCell = ({
  row,
  onDelete,
}: {
  row: ScoutJobRow
  onDelete: (row: ScoutJobRow) => void
}) => {
  const navigate = useNavigate()

  const items: DropdownItem[] = [
    {
      label: 'View History',
      onClick: () => navigate(`/recruiterDashboard/scout/history/${row.id}`),
    },
    {
      label: 'Delete',
      onClick: () => onDelete(row),
    },
  ]

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <Button
        variant="primary"
        size="sm"
        onClick={() => navigate(`/recruiterDashboard/scout/${row.id}`)}>
        Scout
      </Button>
      <Dropdown trigger={<BsThreeDotsVertical />} items={items} />
    </div>
  )
}

export const MyScoutJobs = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [jobToDelete, setJobToDelete] = useState<ScoutJobRow | null>(null)
  const { data, isLoading, isError } = useGetScoutJobsQuery({
    limit: 100,
    offset: 0,
  })
  const [deleteScoutJob, { isLoading: isDeleting }] =
    useDeleteScoutJobMutation()

  const scoutJobs: ScoutJobRow[] = Array.isArray(data?.data?.scoutJobs)
    ? data.data.scoutJobs
    : []
  const startIndex = (page - 1) * ROWS_PER_PAGE
  const paginatedJobs = scoutJobs.slice(startIndex, startIndex + ROWS_PER_PAGE)

  const handleDelete = async () => {
    if (!jobToDelete) return
    try {
      await deleteScoutJob(jobToDelete.id).unwrap()
      notify('success', 'Scout campaign deleted')
      setJobToDelete(null)
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to delete scout campaign'))
    }
  }

  const columns: ColumnDef<ScoutJobRow>[] = [
    {
      key: 'name',
      header: 'Campaign Name',
      render: (row) => row.name,
      sortAccessor: (row) => row.name,
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => row.role?.name ?? '—',
    },
    {
      key: 'createdAt',
      header: 'Created',
      hideBelow: 640,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortAccessor: (row) => row.createdAt,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => <ActionsCell row={row} onDelete={setJobToDelete} />,
    },
  ]

  return (
    <div className="py-4 space-y-6">
      <div className="flex justify-between items-center">
        <PageHeaderTitle
          title="My Scout Jobs"
          description="Revisit past scouting campaigns or start a new one"
        />
        <Button
          variant="primary"
          onClick={() => navigate('/recruiterDashboard/scout/create-jd')}>
          Create New
        </Button>
      </div>

      {isError ? (
        <EmptyState
          title="Couldn't load your scout jobs"
          description="Something went wrong fetching your scouting history. Please try again."
        />
      ) : !isLoading && scoutJobs.length === 0 ? (
        <EmptyState
          title="No scout jobs yet"
          description="Create a scout job to start sourcing and scoring talent."
          action={
            <Button
              variant="primary"
              onClick={() => navigate('/recruiterDashboard/scout/create-jd')}>
              Create New
            </Button>
          }
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={paginatedJobs}
            isLoading={isLoading}
            getRowKey={(row) => row.id}
            allowOverflow
          />
          <Pagination
            totalItems={scoutJobs.length}
            itemsPerPage={ROWS_PER_PAGE}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(jobToDelete)}
        title="Delete this scout campaign?"
        message={`Deleting "${
          jobToDelete?.name ?? ''
        }" will permanently remove this campaign along with all uploaded CVs and scores. This cannot be undone.`}
        confirmLabel="Delete Campaign"
        variant="danger"
        isConfirming={isDeleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setJobToDelete(null)}
      />
    </div>
  )
}
