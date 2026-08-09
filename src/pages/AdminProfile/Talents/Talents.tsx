import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { EXPERIENCE_LEVEL_OPTIONS } from '@/components/forms/Select'
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
  deleteAdminJob,
  deleteAdminTalent,
  fetchAdminJobs,
  fetchAdminTalents,
} from '@/features/admin/services/adminService'
import { useRolesStore } from '@/features/admin/store/useRolesStore'
import { AdminJob, AdminTalent } from '@/features/admin/types'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notify } from '@/utils/toastNotifications'

import { Pagination } from '../../RecruiterProfile/MyJobPosts/Pagination'
import styles from './Talents.module.scss'

type SortDirection = 'asc' | 'desc'

interface TalentFilterValues {
  search: string
  experience: string
  roleId: string
}

interface JobFilterValues {
  search: string
  status: string
  roleId: string
}

const defaultTalentFilters: TalentFilterValues = {
  search: '',
  experience: '',
  roleId: '',
}

const defaultJobFilters: JobFilterValues = {
  search: '',
  status: '',
  roleId: '',
}

const ROWS_PER_PAGE = 10

const JOB_STATUS_OPTIONS = [
  { value: '', label: 'Any status' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'closed', label: 'Closed' },
]

const truncate = (value: string, max = 72) =>
  value.length > max ? `${value.slice(0, max).trimEnd()}…` : value

const Talents = () => {
  const { roles, fetchRoles } = useRolesStore()

  const [talents, setTalents] = useState<AdminTalent[]>([])
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [talentsLoading, setTalentsLoading] = useState(true)
  const [jobsLoading, setJobsLoading] = useState(true)

  const [talentFilters, setTalentFilters] =
    useState<TalentFilterValues>(defaultTalentFilters)
  const [jobFilters, setJobFilters] =
    useState<JobFilterValues>(defaultJobFilters)

  const [talentSortKey, setTalentSortKey] = useState('createdAt')
  const [talentSortDirection, setTalentSortDirection] =
    useState<SortDirection>('desc')
  const [jobSortKey, setJobSortKey] = useState('createdAt')
  const [jobSortDirection, setJobSortDirection] =
    useState<SortDirection>('desc')

  const [talentPage, setTalentPage] = useState(1)
  const [jobPage, setJobPage] = useState(1)

  const [talentVisibleKeys, setTalentVisibleKeys] = useState<string[]>([
    'name',
    'email',
    'roles',
    'experience',
    'score',
    'cv',
    'createdAt',
  ])
  const [jobVisibleKeys, setJobVisibleKeys] = useState<string[]>([
    'role',
    'brief',
    'status',
    'recruiter',
    'location',
    'createdAt',
  ])

  const [talentToDelete, setTalentToDelete] = useState<AdminTalent | null>(null)
  const [jobToDelete, setJobToDelete] = useState<AdminJob | null>(null)
  const [isDeletingTalent, setIsDeletingTalent] = useState(false)
  const [isDeletingJob, setIsDeletingJob] = useState(false)

  useEffect(() => {
    void fetchRoles()
  }, [fetchRoles])

  const loadTalents = useCallback(async () => {
    setTalentsLoading(true)
    try {
      const data = await fetchAdminTalents({ limit: 200, offset: 0 })
      setTalents(data.users)
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to load talents'))
    } finally {
      setTalentsLoading(false)
    }
  }, [])

  const loadJobs = useCallback(async () => {
    setJobsLoading(true)
    try {
      const data = await fetchAdminJobs({ limit: 200, offset: 0 })
      setJobs(data.jobs)
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to load jobs'))
    } finally {
      setJobsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTalents()
    void loadJobs()
  }, [loadTalents, loadJobs])

  const roleOptions = useMemo(
    () => [
      { value: '', label: 'Any role' },
      ...roles.map((role) => ({ value: role.id, label: role.name })),
    ],
    [roles],
  )

  const experienceOptions = useMemo(
    () => [{ value: '', label: 'Any experience' }, ...EXPERIENCE_LEVEL_OPTIONS],
    [],
  )

  const talentFilterFields: FilterFieldConfig<TalentFilterValues>[] = [
    {
      type: 'search',
      key: 'search',
      label: 'Search',
      placeholder: 'Name or email',
    },
    {
      type: 'select',
      key: 'experience',
      label: 'Experience',
      offValue: '',
      options: experienceOptions,
    },
    {
      type: 'select',
      key: 'roleId',
      label: 'Role',
      offValue: '',
      options: roleOptions,
    },
  ]

  const jobFilterFields: FilterFieldConfig<JobFilterValues>[] = [
    {
      type: 'search',
      key: 'search',
      label: 'Search',
      placeholder: 'Role, brief, or recruiter',
    },
    {
      type: 'select',
      key: 'status',
      label: 'Status',
      offValue: '',
      options: JOB_STATUS_OPTIONS,
    },
    {
      type: 'select',
      key: 'roleId',
      label: 'Role',
      offValue: '',
      options: roleOptions,
    },
  ]

  const talentColumns: ColumnDef<AdminTalent>[] = useMemo(
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
        key: 'roles',
        header: 'Role(s)',
        toggleable: true,
        render: (row) =>
          row.userRoles?.map((role) => role.name).join(', ') || '—',
      },
      {
        key: 'experience',
        header: 'Experience',
        sortLabel: 'Experience',
        toggleable: true,
        render: (row) => row.experience ?? '—',
        sortAccessor: (row) => row.experience ?? '',
      },
      {
        key: 'score',
        header: 'Score',
        sortLabel: 'Score',
        toggleable: true,
        render: (row) => row.prescreeningScore ?? '—',
        sortAccessor: (row) => row.prescreeningScore ?? -1,
      },
      {
        key: 'cv',
        header: 'CV',
        toggleable: true,
        hideBelow: 900,
        render: (row) =>
          row.cvFileName ?? (row.cvUploadedAt ? 'Uploaded' : '—'),
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
              onClick={() => setTalentToDelete(row)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  const jobColumns: ColumnDef<AdminJob>[] = useMemo(
    () => [
      {
        key: 'role',
        header: 'Role',
        sortLabel: 'Role',
        toggleable: true,
        render: (row) => row.role?.name ?? '—',
        sortAccessor: (row) => row.role?.name ?? '',
      },
      {
        key: 'brief',
        header: 'Job brief',
        toggleable: true,
        render: (row) => truncate(row.jobBrief || '—'),
      },
      {
        key: 'status',
        header: 'Status',
        sortLabel: 'Status',
        toggleable: true,
        render: (row) => row.status,
        sortAccessor: (row) => row.status,
      },
      {
        key: 'recruiter',
        header: 'Posted by',
        toggleable: true,
        hideBelow: 900,
        render: (row) =>
          row.postedBy
            ? `${row.postedBy.firstName} ${row.postedBy.lastName}`
            : '—',
        sortAccessor: (row) =>
          row.postedBy
            ? `${row.postedBy.firstName} ${row.postedBy.lastName}`
            : '',
      },
      {
        key: 'location',
        header: 'Location',
        toggleable: true,
        hideBelow: 720,
        render: (row) => row.locationCountry || '—',
      },
      {
        key: 'createdAt',
        header: 'Created',
        sortLabel: 'Created',
        toggleable: true,
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
              onClick={() => setJobToDelete(row)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  const visibleTalentColumns = talentColumns.filter(
    (col) => !col.toggleable || talentVisibleKeys.includes(col.key),
  )
  const visibleJobColumns = jobColumns.filter(
    (col) => !col.toggleable || jobVisibleKeys.includes(col.key),
  )

  const filteredTalents = useMemo(() => {
    const search = talentFilters.search.trim().toLowerCase()
    return talents.filter((row) => {
      if (
        talentFilters.experience &&
        row.experience !== talentFilters.experience
      ) {
        return false
      }
      if (
        talentFilters.roleId &&
        !row.userRoles?.some((role) => role.id === talentFilters.roleId)
      ) {
        return false
      }
      if (!search) return true
      const haystack =
        `${row.firstName} ${row.lastName} ${row.email}`.toLowerCase()
      return haystack.includes(search)
    })
  }, [talents, talentFilters])

  const filteredJobs = useMemo(() => {
    const search = jobFilters.search.trim().toLowerCase()
    return jobs.filter((row) => {
      if (jobFilters.status && row.status !== jobFilters.status) return false
      if (jobFilters.roleId && row.role?.id !== jobFilters.roleId) return false
      if (!search) return true
      const haystack = [
        row.jobBrief,
        row.role?.name,
        row.postedBy?.firstName,
        row.postedBy?.lastName,
        row.postedBy?.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(search)
    })
  }, [jobs, jobFilters])

  const sortedTalents = useMemo(() => {
    const column = talentColumns.find((col) => col.key === talentSortKey)
    return column?.sortAccessor
      ? sortByAccessor(
          filteredTalents,
          column.sortAccessor,
          talentSortDirection,
        )
      : filteredTalents
  }, [filteredTalents, talentColumns, talentSortKey, talentSortDirection])

  const sortedJobs = useMemo(() => {
    const column = jobColumns.find((col) => col.key === jobSortKey)
    return column?.sortAccessor
      ? sortByAccessor(filteredJobs, column.sortAccessor, jobSortDirection)
      : filteredJobs
  }, [filteredJobs, jobColumns, jobSortKey, jobSortDirection])

  const pagedTalents = sortedTalents.slice(
    (talentPage - 1) * ROWS_PER_PAGE,
    talentPage * ROWS_PER_PAGE,
  )
  const pagedJobs = sortedJobs.slice(
    (jobPage - 1) * ROWS_PER_PAGE,
    jobPage * ROWS_PER_PAGE,
  )

  const handleDeleteTalent = async () => {
    if (!talentToDelete) return
    setIsDeletingTalent(true)
    try {
      await deleteAdminTalent(talentToDelete.id)
      notify('success', 'Talent permanently deleted')
      setTalentToDelete(null)
      await loadTalents()
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to delete talent'))
    } finally {
      setIsDeletingTalent(false)
    }
  }

  const handleDeleteJob = async () => {
    if (!jobToDelete) return
    setIsDeletingJob(true)
    try {
      await deleteAdminJob(jobToDelete.id)
      notify('success', 'Job permanently deleted')
      setJobToDelete(null)
      await loadJobs()
    } catch (err) {
      notify('error', getErrorMessage(err, 'Failed to delete job'))
    } finally {
      setIsDeletingJob(false)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeaderTitle
        title="Talents"
        description="Manage every registered talent and every job on the platform. Deletions are permanent."
      />

      <section className={styles.section}>
        <div>
          <h3 className={styles.sectionTitle}>Talents</h3>
          <p className={styles.sectionDescription}>
            All talent accounts. Deleting a talent removes their profile, CV
            text, embeddings, applications, messages, and related AI data.
          </p>
        </div>

        <div className={styles.layout}>
          <FilterPanel
            fields={talentFilterFields}
            filters={talentFilters}
            defaultFilters={defaultTalentFilters}
            onApply={(next) => {
              setTalentFilters(next)
              setTalentPage(1)
            }}
            ariaLabel="Filter talents"
          />
          <div className={styles.mainColumn}>
            {!talentsLoading && sortedTalents.length === 0 ? (
              <EmptyState
                title="No talents found"
                description="Try adjusting filters, or wait for talents to register."
              />
            ) : (
              <>
                <TableToolbar
                  columns={talentColumns}
                  resultsCount={sortedTalents.length}
                  visibleColumnKeys={talentVisibleKeys}
                  onToggleColumn={(key) =>
                    setTalentVisibleKeys((prev) =>
                      prev.includes(key)
                        ? prev.filter((item) => item !== key)
                        : [...prev, key],
                    )
                  }
                  sortKey={talentSortKey}
                  sortDirection={talentSortDirection}
                  onSortChange={(key, direction) => {
                    setTalentSortKey(key)
                    setTalentSortDirection(direction)
                  }}
                />
                <DataTable
                  columns={visibleTalentColumns}
                  data={pagedTalents}
                  isLoading={talentsLoading}
                  getRowKey={(row) => row.id}
                  showRowNumber
                  rowNumberOffset={(talentPage - 1) * ROWS_PER_PAGE}
                  allowOverflow
                  ariaLabel="Talents table"
                />
                <Pagination
                  totalItems={sortedTalents.length}
                  itemsPerPage={ROWS_PER_PAGE}
                  currentPage={talentPage}
                  onPageChange={setTalentPage}
                />
              </>
            )}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div>
          <h3 className={styles.sectionTitle}>Jobs</h3>
          <p className={styles.sectionDescription}>
            All jobs stored on the platform. Deleting a job removes
            applications, questions, answers, match data, messages, and unused
            AI config.
          </p>
        </div>

        <div className={styles.layout}>
          <FilterPanel
            fields={jobFilterFields}
            filters={jobFilters}
            defaultFilters={defaultJobFilters}
            onApply={(next) => {
              setJobFilters(next)
              setJobPage(1)
            }}
            ariaLabel="Filter jobs"
          />
          <div className={styles.mainColumn}>
            {!jobsLoading && sortedJobs.length === 0 ? (
              <EmptyState
                title="No jobs found"
                description="Try adjusting filters, or wait for recruiters to post jobs."
              />
            ) : (
              <>
                <TableToolbar
                  columns={jobColumns}
                  resultsCount={sortedJobs.length}
                  visibleColumnKeys={jobVisibleKeys}
                  onToggleColumn={(key) =>
                    setJobVisibleKeys((prev) =>
                      prev.includes(key)
                        ? prev.filter((item) => item !== key)
                        : [...prev, key],
                    )
                  }
                  sortKey={jobSortKey}
                  sortDirection={jobSortDirection}
                  onSortChange={(key, direction) => {
                    setJobSortKey(key)
                    setJobSortDirection(direction)
                  }}
                />
                <DataTable
                  columns={visibleJobColumns}
                  data={pagedJobs}
                  isLoading={jobsLoading}
                  getRowKey={(row) => row.id}
                  showRowNumber
                  rowNumberOffset={(jobPage - 1) * ROWS_PER_PAGE}
                  allowOverflow
                  ariaLabel="Jobs table"
                />
                <Pagination
                  totalItems={sortedJobs.length}
                  itemsPerPage={ROWS_PER_PAGE}
                  currentPage={jobPage}
                  onPageChange={setJobPage}
                />
              </>
            )}
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(talentToDelete)}
        title="Permanently delete this talent?"
        message={`Deleting ${talentToDelete?.firstName ?? ''} ${
          talentToDelete?.lastName ?? ''
        } will remove their account, CV text, embeddings, applications, messages, and all related data. This cannot be undone.`}
        confirmLabel="Delete talent"
        variant="danger"
        isConfirming={isDeletingTalent}
        onConfirm={() => void handleDeleteTalent()}
        onCancel={() => setTalentToDelete(null)}
      />

      <ConfirmDialog
        open={Boolean(jobToDelete)}
        title="Permanently delete this job?"
        message={`Deleting "${
          jobToDelete?.role?.name ?? 'this job'
        }" will remove the job, applications, questions, answers, match data, and related messages. This cannot be undone.`}
        confirmLabel="Delete job"
        variant="danger"
        isConfirming={isDeletingJob}
        onConfirm={() => void handleDeleteJob()}
        onCancel={() => setJobToDelete(null)}
      />
    </div>
  )
}

export default Talents
