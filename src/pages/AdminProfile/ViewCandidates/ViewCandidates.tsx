import React, { useEffect } from 'react'

import { ColumnDef, DataTable } from '@/components'
import { EXPERIENCE_LEVEL_OPTIONS, Select } from '@/components/forms/Select'
import { Button } from '@/components/ui/Button'
import { useCandidatesStore } from '@/features/admin/store/useCandidatesStore'
import { useRolesStore } from '@/features/admin/store/useRolesStore'
import { Candidate } from '@/features/admin/types'

import styles from './ViewCandidates.module.scss'

const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Any experience' },
  ...EXPERIENCE_LEVEL_OPTIONS,
]

const LIMIT = 50

const ViewCandidates = () => {
  const { candidates, isLoading, filters, setFilters, fetchCandidates } =
    useCandidatesStore()
  const { roles, fetchRoles } = useRolesStore()

  useEffect(() => {
    void fetchRoles()
  }, [fetchRoles])

  useEffect(() => {
    void fetchCandidates()
  }, [filters, fetchCandidates])

  const roleOptions = [
    { value: '', label: 'Any role' },
    ...roles.map((role) => ({ value: role.id, label: role.name })),
  ]

  const columns: ColumnDef<Candidate>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (candidate) => `${candidate.firstName} ${candidate.lastName}`,
    },
    { key: 'email', header: 'Email', render: (candidate) => candidate.email },
    {
      key: 'roles',
      header: 'Role(s)',
      render: (candidate) =>
        candidate.userRoles.map((role) => role.name).join(', ') || '—',
    },
    {
      key: 'experience',
      header: 'Experience',
      render: (candidate) => candidate.experience ?? '—',
    },
    {
      key: 'score',
      header: 'Score',
      render: (candidate) => candidate.prescreeningScore ?? '—',
    },
  ]

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>View Candidates</h2>

      <div className={styles.filters}>
        <Select
          label="Role"
          name="roleId"
          value={filters.roleId ?? ''}
          onChange={(value) =>
            setFilters({ ...filters, roleId: value || undefined, offset: 0 })
          }
          options={roleOptions}
        />
        <Select
          label="Experience"
          name="experience"
          value={filters.experience ?? ''}
          onChange={(value) =>
            setFilters({
              ...filters,
              experience: value || undefined,
              offset: 0,
            })
          }
          options={EXPERIENCE_OPTIONS}
        />
      </div>

      <DataTable
        columns={columns}
        data={candidates}
        isLoading={isLoading}
        getRowKey={(candidate) => candidate.id}
        ariaLabel="Candidates table"
        showRowNumber
        rowNumberOffset={filters.offset ?? 0}
      />

      <div className={styles.pagination}>
        <Button
          variant="outline"
          size="sm"
          disabled={(filters.offset ?? 0) === 0}
          onClick={() =>
            setFilters({
              ...filters,
              offset: Math.max((filters.offset ?? 0) - LIMIT, 0),
            })
          }>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={candidates.length < LIMIT}
          onClick={() =>
            setFilters({ ...filters, offset: (filters.offset ?? 0) + LIMIT })
          }>
          Next
        </Button>
      </div>
    </div>
  )
}

export default ViewCandidates
