import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import { IoChevronDown, IoChevronUp, IoClose, IoRefresh } from 'react-icons/io5'

import { WorkTypeCheckboxes } from '@/components/features/jobs/WorkTypeCheckboxes'
import { EMPTY_LOCATION } from '@/components/forms/LocationSelect'
import { RoleSelect } from '@/components/forms/Roles/RoleSelect'
import {
  EXPERIENCE_LEVEL_OPTIONS,
  Select,
  WORK_MODE_OPTIONS,
} from '@/components/forms/Select'
import { Button } from '@/components/ui/Button'
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
  onApply: (filters: JobFiltersTypes) => void
}

export const JobFilter: React.FC<JobFilterProps> = ({ filters, onApply }) => {
  const [collapsed, setCollapsed] = useState(false)

  const onSubmit = (values: JobFiltersTypes) => {
    onApply(values)
  }

  return (
    <div className={styles.panel} aria-label="Filter jobs">
      <Formik initialValues={filters} enableReinitialize onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm }) => {
          const resetAll = () => {
            resetForm({ values: defaultFilterValues })
            onApply(defaultFilterValues)
          }

          return (
            <Form>
              <div className={styles.header}>
                <button
                  type="button"
                  className={styles.collapseToggle}
                  aria-expanded={!collapsed}
                  aria-label={collapsed ? 'Expand filters' : 'Collapse filters'}
                  onClick={() => setCollapsed((prev) => !prev)}>
                  {collapsed ? <IoChevronDown /> : <IoChevronUp />}
                  <span className={styles.title}>Filters</span>
                </button>
                <button
                  type="button"
                  className={styles.resetAll}
                  disabled={!hasActiveFilter(values)}
                  onClick={resetAll}>
                  <IoRefresh /> Reset all
                </button>
              </div>

              {!collapsed && (
                <>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="role">
                      Role
                    </label>
                    <RoleSelect
                      name="role"
                      value={values.role}
                      onChange={(value) => setFieldValue('role', value)}
                      creatable={false}
                    />
                  </div>

                  <div className={styles.field}>
                    <label
                      className={styles.fieldLabel}
                      htmlFor="experienceLevel">
                      Experience Level
                    </label>
                    <Select
                      name="experienceLevel"
                      options={EXPERIENCE_LEVEL_OPTIONS}
                      value={values.experienceLevel}
                      onChange={(value) =>
                        setFieldValue('experienceLevel', value)
                      }
                      placeholder="Select experience level"
                    />
                  </div>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Work Type</span>
                    <WorkTypeCheckboxes
                      value={values.workMode}
                      onChange={(value) => setFieldValue('workMode', value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Location</span>
                    <LocationTabsSelect
                      value={values.location}
                      onChange={(value) => setFieldValue('location', value)}
                    />
                  </div>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.clearAll}
                      disabled={!hasActiveFilter(values)}
                      onClick={resetAll}>
                      Clear all
                    </button>
                    <Button type="submit">Apply filters</Button>
                  </div>
                </>
              )}
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

const workModeLabel = (mode: string) =>
  WORK_MODE_OPTIONS.find((option) => option.value === mode)?.label ?? mode

interface ActiveFilterChipsProps {
  filters: JobFiltersTypes
  onChange: (filters: JobFiltersTypes) => void
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onChange,
}) => {
  const { data } = useGetRoleQuery({})
  const roles: Role[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.roles)
    ? data.data.roles
    : []

  if (!hasActiveFilter(filters)) return null

  const chips: { key: string; label: string; remove: () => void }[] = []

  if (filters.role) {
    const roleName =
      roles.find((role) => role.id === filters.role)?.name ?? filters.role
    chips.push({
      key: 'role',
      label: roleName,
      remove: () => onChange({ ...filters, role: '' }),
    })
  }

  if (filters.experienceLevel) {
    chips.push({
      key: 'experienceLevel',
      label: filters.experienceLevel,
      remove: () => onChange({ ...filters, experienceLevel: '' }),
    })
  }

  filters.workMode?.forEach((mode) => {
    chips.push({
      key: `workMode-${mode}`,
      label: workModeLabel(mode),
      remove: () =>
        onChange({
          ...filters,
          workMode: filters.workMode.filter((m) => m !== mode),
        }),
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
      remove: () => onChange({ ...filters, location: { ...EMPTY_LOCATION } }),
    })
  }

  return (
    <div className={styles.chipRow}>
      {chips.map((chip) => (
        <span key={chip.key} className={styles.chip}>
          {chip.label}
          <button
            type="button"
            className={styles.chipRemove}
            aria-label={`Remove ${chip.label} filter`}
            onClick={chip.remove}>
            <IoClose />
          </button>
        </span>
      ))}
      <button
        type="button"
        className={styles.chipClearAll}
        onClick={() => onChange(defaultFilterValues)}>
        Clear all
      </button>
    </div>
  )
}
