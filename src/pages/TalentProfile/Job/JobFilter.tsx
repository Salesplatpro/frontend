import React, { useEffect, useRef, useState } from 'react'
import { IoClose, IoRefresh } from 'react-icons/io5'
import { LuChevronDown, LuChevronUp, LuSlidersHorizontal } from 'react-icons/lu'

import { WorkTypeCheckboxes } from '@/components/features/jobs/WorkTypeCheckboxes'
import { EMPTY_LOCATION } from '@/components/forms/LocationSelect'
import { RoleSelect } from '@/components/forms/Roles/RoleSelect'
import {
  EXPERIENCE_LEVEL_OPTIONS,
  Select,
  WORK_MODE_OPTIONS,
} from '@/components/forms/Select'
import { useGetRoleQuery } from '@/redux/api/talent'
import { Role } from '@/utils/types'

import { JobFiltersTypes } from '../../../utils/jobPostTypes'
import styles from './JobFilter.module.scss'
import { LocationTabsSelect } from './LocationTabsSelect'

export const defaultFilterValues: JobFiltersTypes = {
  role: '',
  experienceLevel: '',
  workMode: [],
  location: { ...EMPTY_LOCATION },
}

export const hasActiveFilter = (filters: JobFiltersTypes) =>
  !!(
    filters.role ||
    filters.experienceLevel ||
    filters.workMode?.length ||
    filters.location?.city?.name ||
    filters.location?.state?.name ||
    filters.location?.country?.name
  )

interface JobFilterProps {
  filters: JobFiltersTypes
  onChange: (filters: JobFiltersTypes) => void
}

export const JobFilter: React.FC<JobFilterProps> = ({ filters, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data } = useGetRoleQuery({})
  const roles: Role[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.roles)
    ? data.data.roles
    : []

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const setField = <K extends keyof JobFiltersTypes>(
    key: K,
    value: JobFiltersTypes[K],
  ) => {
    onChange({ ...filters, [key]: value })
  }

  const resetAll = () => onChange(defaultFilterValues)

  const active = hasActiveFilter(filters)

  // Build chips from active filter values
  const chips: { key: string; label: string; remove: () => void }[] = []

  if (filters.role) {
    const roleName =
      roles.find((r) => r.id === filters.role)?.name ?? filters.role
    chips.push({
      key: 'role',
      label: roleName,
      remove: () => setField('role', ''),
    })
  }

  if (filters.experienceLevel) {
    const expLabel =
      EXPERIENCE_LEVEL_OPTIONS.find((o) => o.value === filters.experienceLevel)
        ?.label ?? filters.experienceLevel
    chips.push({
      key: 'experienceLevel',
      label: expLabel,
      remove: () => setField('experienceLevel', ''),
    })
  }

  filters.workMode?.forEach((mode) => {
    const modeLabel =
      WORK_MODE_OPTIONS.find((o) => o.value === mode)?.label ?? mode
    chips.push({
      key: `workMode-${mode}`,
      label: modeLabel,
      remove: () =>
        setField(
          'workMode',
          filters.workMode.filter((m) => m !== mode),
        ),
    })
  })

  const locationLabel = [
    filters.location?.city?.name,
    filters.location?.state?.name,
    filters.location?.country?.name,
  ]
    .filter(Boolean)
    .join(', ')

  if (locationLabel) {
    chips.push({
      key: 'location',
      label: locationLabel,
      remove: () => setField('location', { ...EMPTY_LOCATION }),
    })
  }

  return (
    <div
      className={styles.container}
      ref={containerRef}
      aria-label="Filter jobs">
      {/* Toggle bar */}
      <div className={styles.bar}>
        <button
          type="button"
          className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}>
          <LuSlidersHorizontal className={styles.toggleIcon} />
          <span>Filters</span>
          {isOpen ? (
            <LuChevronUp className={styles.chevron} />
          ) : (
            <LuChevronDown className={styles.chevron} />
          )}
        </button>

        {/* Active filter chips — shown when collapsed */}
        {!isOpen && chips.length > 0 && (
          <div className={styles.chips}>
            {chips.map((chip) => (
              <span key={chip.key} className={styles.chip}>
                {chip.label}
                <button
                  type="button"
                  className={styles.chipRemove}
                  onClick={(e) => {
                    e.stopPropagation()
                    chip.remove()
                  }}
                  aria-label={`Remove ${chip.label} filter`}>
                  <IoClose />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Reset */}
        <button
          type="button"
          className={styles.resetBtn}
          disabled={!active}
          onClick={resetAll}>
          <IoRefresh />
          Reset
        </button>
      </div>

      {/* Expanded filter panel */}
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="job-filter-role">
              Role
            </label>
            <RoleSelect
              name="role"
              value={filters.role}
              onChange={(value) => setField('role', value)}
              creatable={false}
            />
          </div>

          <div className={styles.field}>
            <label
              className={styles.fieldLabel}
              htmlFor="job-filter-experience">
              Experience Level
            </label>
            <Select
              name="experienceLevel"
              options={EXPERIENCE_LEVEL_OPTIONS}
              value={filters.experienceLevel}
              onChange={(value) => setField('experienceLevel', value)}
              placeholder="Select experience level"
            />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Work Type</span>
            <WorkTypeCheckboxes
              value={filters.workMode}
              onChange={(value) => setField('workMode', value)}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.fieldLabel}>Location</span>
            <LocationTabsSelect
              value={filters.location}
              onChange={(value) => setField('location', value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
